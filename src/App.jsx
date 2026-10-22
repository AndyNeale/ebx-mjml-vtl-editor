import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import Velocity from "velocityjs";

import Preview from "./Preview";
import useDebounce from "./useDebounce";

import "./styles.css";

const MIN_SECTION_HEIGHT = 80;
const MIN_COLUMN_WIDTH = 200;

const SECTIONS = [
  { key: "editor", title: "Editor", language: "html" },
  { key: "edition", title: "Edition configuration", language: "json" },
  { key: "branding", title: "Branding configuration", language: "json" },
];

function App() {
  const [rawContent, setRawContent] = useState(null);
  const debouncedContent = useDebounce(rawContent, 500);
  const [renderedContent, setRenderedContent] = useState(null);
  const [editionData, setEditionData] = useState({});
  const [articleData, setArticleData] = useState({});
  const [openSections, setOpenSections] = useState({ editor: true, edition: false, branding: false });
  const [sectionWeights, setSectionWeights] = useState({ editor: 1, edition: 1, branding: 1 });
  const [leftWidth, setLeftWidth] = useState(() => Math.round(window.innerWidth * 0.5));
  const sectionRefs = useRef({});
  const containerRef = useRef(null);

  useEffect(() => {
    if (debouncedContent) {
      let output = debouncedContent;
      try {
        // Remove delayed evaluation code
        output = output.replaceAll("\\\\\\", "");
        // First render (with article placeholders)
        output = Velocity.render(output, {
          ...editionData,
          ...articleData,
          ebx: {
            isCustomBlock: (string) => string.includes("@@@"),
            getBlockType: (string) => string.replaceAll("@@@", "").replace("urn:newsletter:block:", ""),
          },
          json: {
            parse: (string) => new Map(Object.entries(JSON.parse(string))),
          },
          html: {
            decode: (string) => decodeURIComponent(string),
          },
        });
        // Second render (with article data)
        output = Velocity.render(output, {
          ...articleData,
        });
        // Remove unresolved categories
        output = output.replaceAll("${article.metadata.categories}", "");
      } catch (error) {
        console.log("VTL rendering error", error);
      }
      setRenderedContent(output);
    }
  }, [debouncedContent, articleData, editionData]);

  const onDataChange = (data, setter) => {
    try {
      setter(JSON.parse(data));
    } catch (error) {
      // Ignore invalid JSON while typing
    }
  };

  const onChangeFor = {
    editor: (value) => setRawContent(value),
    edition: (value) => onDataChange(value, setEditionData),
    branding: (value) => onDataChange(value, setArticleData),
  };

  // Accordion behaviour: exactly one section is always open
  const openSection = (key) => setOpenSections(Object.fromEntries(SECTIONS.map((s) => [s.key, s.key === key])));

  // Drag handling: pointer capture keeps events flowing even over the preview iframe
  const startDrag = (event, onMove) => {
    event.preventDefault();
    const target = event.currentTarget;
    target.setPointerCapture(event.pointerId);
    const startX = event.clientX;
    const startY = event.clientY;
    const move = (e) => onMove(e.clientX - startX, e.clientY - startY);
    const end = () => {
      target.removeEventListener("pointermove", move);
      target.removeEventListener("pointerup", end);
      target.removeEventListener("pointercancel", end);
    };
    target.addEventListener("pointermove", move);
    target.addEventListener("pointerup", end);
    target.addEventListener("pointercancel", end);
  };

  const onColumnDividerDown = (event) => {
    const startWidth = leftWidth;
    const max = containerRef.current.clientWidth - MIN_COLUMN_WIDTH;
    startDrag(event, (dx) => setLeftWidth(Math.min(max, Math.max(MIN_COLUMN_WIDTH, startWidth + dx))));
  };

  const onSectionDividerDown = (event, upperKey, lowerKey) => {
    // Snapshot the current pixel heights so every open section keeps its size
    const heights = {};
    SECTIONS.forEach(({ key }) => {
      if (openSections[key]) heights[key] = sectionRefs.current[key].offsetHeight;
    });
    const total = heights[upperKey] + heights[lowerKey];
    startDrag(event, (_dx, dy) => {
      const upper = Math.min(total - MIN_SECTION_HEIGHT, Math.max(MIN_SECTION_HEIGHT, heights[upperKey] + dy));
      setSectionWeights({ ...heights, [upperKey]: upper, [lowerKey]: total - upper });
    });
  };

  const openKeys = SECTIONS.map((s) => s.key).filter((key) => openSections[key]);

  return (
    <div className="container" ref={containerRef}>
      <div className="left-column" style={{ width: leftWidth }}>
        {SECTIONS.map(({ key, title, language }) => {
          const isOpen = openSections[key];
          const nextOpenKey = openKeys[openKeys.indexOf(key) + 1];
          return (
            <React.Fragment key={key}>
              <div className={`section ${isOpen ? "open" : ""}`} style={isOpen ? { flex: `${sectionWeights[key]} 1 0` } : undefined} ref={(el) => (sectionRefs.current[key] = el)}>
                <button className="section-header" onClick={() => openSection(key)} aria-expanded={isOpen}>
                  <span className="chevron">{isOpen ? "▾" : "▸"}</span>
                  {title}
                </button>
                {/* Kept mounted while collapsed so editor content survives toggling */}
                <div className="section-body" hidden={!isOpen}>
                  <Editor
                    height="100%"
                    theme="vs-dark"
                    defaultLanguage={language}
                    defaultValue={language === "json" ? "{}" : ""}
                    onChange={onChangeFor[key]}
                    options={{ automaticLayout: true, minimap: { enabled: false }, scrollBeyondLastLine: false }}
                  />
                </div>
              </div>
              {isOpen && nextOpenKey && <div className="divider horizontal" onPointerDown={(e) => onSectionDividerDown(e, key, nextOpenKey)} />}
            </React.Fragment>
          );
        })}
      </div>
      <div className="divider vertical" onPointerDown={onColumnDividerDown} />
      <div className="right-column">
        <Preview html={renderedContent} />
      </div>
    </div>
  );
}

export default App;
