import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import mjml2html from "mjml-browser";
import FileSaver from "file-saver";
import Velocity from "velocityjs";

import Data from "./Data";
import Export from "./Export";
import Preview from "./Preview";
import Settings from "./Settings";

import useDebounce from "./useDebounce";

import { EXAMPLE_EDITION_DATA } from "./data/editionDataExample";
import { EXAMPLE_ARTICLE_DATA } from "./data/articleDataExample";

import "./styles.css";

const EXPORT_TYPE = {
  ENCODED: "ENCODED",
  NOT_ENCODED: "NOT ENCODED",
};

function App() {
  const [rawContent, setRawContent] = useState(null);
  const debouncedContent = useDebounce(rawContent, 500);
  const [renderedContent, setRenderedContent] = useState(null);
  const [editionData, setEditionData] = useState("");
  const [articleData, setArticleData] = useState("");
  const [campaignFilename, setCampaignFilename] = useState("template");
  const [renderMJML, setRenderMJML] = useState(true);
  const [renderVTL, setRenderVTL] = useState(true);

  useEffect(() => {
    if (debouncedContent) {
      let output = debouncedContent.replace(
        /(^ *)(#[\S ]+)([\n\r])/gm,
        "$1<mj-raw>$2</mj-raw>$3"
      );
      // Also wrap escaped velocity directives
      output = output.replace(
        /(^ *)(\\#[\S ]+)([\n\r])/gm,
        "$1<mj-raw>$2</mj-raw>$3"
      );
      if (renderVTL) {
        try {
          // First render (with article placeholders)
          output = Velocity.render(output, {
            ...editionData,
            ebx: {
              isCustomBlock: (string) => string.includes("@@@"),
              getBlockType: (string) =>
                string
                  .replaceAll("@@@", "")
                  .replace("urn:newsletter:block:", ""),
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
        } catch (error) {
          console.log("VTL rendering error", error);
        }
      } else {
        //
      }
      if (renderMJML) {
        try {
          output = mjml2html(output).html;
        } catch (error) {
          console.log("MJML rendering error", error);
          return;
        }
      } else {
        //
      }
      setRenderedContent(output);
    }
  }, [debouncedContent, articleData, editionData, renderMJML, renderVTL]);

  const editorRef = useRef(null);

  const onDataChange = (data, setter) => {
    try {
      const json = JSON.parse(data);
      setter(json);
    } catch (error) {
      // console.log('DATA ERROR');
      // console.log(error);
    }
  };

  const onEditorChange = (value) => {
    // console.log("onChange");
    setRawContent(value);
  };

  const onEditorMount = (editor) => {
    // console.log("onMount");
    editorRef.current = editor;
  };

  const onExport = (filename, fileType) => {
    if (!debouncedContent) {
      return;
    }

    let escaped = debouncedContent.replace(
      /(^ *)(#[\S ]+)([\n\r])/gm,
      "$1<mj-raw>$2</mj-raw>$3"
    );
    // Also wrap escaped velocity directives
    escaped = escaped.replace(
      /(^ *)(\\#[\S ]+)([\n\r])/gm,
      "$1<mj-raw>$2</mj-raw>$3"
    );
    // console.log(escaped);
    let vtl;
    try {
      vtl = mjml2html(escaped).html;
    } catch (error) {
      console.log("Export error", error);
      return;
    }

    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(vtl, `${filename}.vtl`);
    } else {
      const blob = new Blob([vtl], { type: "text/plain;charset=utf-8" });
      FileSaver.saveAs(blob, `${filename}.vtl`);
    }
  };

  const onCampaignFilenameChange = (event) =>
    setCampaignFilename(event.target.value);

  const handleUseExampleJSON = (index, setter) => {
    let json;
    if (index === 0) {
      json = JSON.stringify(EXAMPLE_EDITION_DATA, null, 4);
    } else if (index === 1) {
      json = JSON.stringify(EXAMPLE_ARTICLE_DATA, null, 4);
    } else {
      throw new Error("Unknown index");
    }
    document.getElementById(`dataTextArea-${index}`).value = json;

    onDataChange(json, setter);
  };

  return (
    <div className="container">
      <div className="top-slice">
        <div className="top-left">
          <div className="section-titles-container">
            <div className="section-titles">Editor</div>
          </div>
          <Editor
            className="editor"
            defaultLanguage="html"
            defaultValue=""
            onChange={onEditorChange}
            onMount={onEditorMount}
          />
        </div>
        <div className="top-right">
          <div className="preview-container">
            <Preview html={renderedContent} />
          </div>
        </div>
      </div>
      <div className="data-slice">
        <div className="top-left">
          <div className="section-titles-container">
            <div className="d-flex">
              <div className="section-titles">
                Data (Edition data with placeholder articles)
              </div>
              <div className="section-titles">
                <button onClick={() => handleUseExampleJSON(0, setEditionData)}>
                  Use Example JSON - 20/06/2023
                </button>
              </div>
            </div>
          </div>
          <Data
            data={JSON.stringify(editionData, null, 2)}
            index={0}
            onChange={(event) =>
              onDataChange(event.target.value, setEditionData)
            }
          />
        </div>
        <div className="top-right">
          <div className="section-titles-container">
            <div className="d-flex">
              <div className="section-titles">
                Data (Article and personalisation data)
              </div>
              <div className="section-titles">
                <button onClick={() => handleUseExampleJSON(1, setArticleData)}>
                  Use Example JSON - 20/06/2023
                </button>
              </div>
            </div>
          </div>
          <Data
            data={JSON.stringify(articleData, null, 2)}
            index={1}
            onChange={(event) =>
              onDataChange(event.target.value, setArticleData)
            }
          />
        </div>
      </div>
      <div className="settings-slice">
        <Export
          filename={campaignFilename}
          onChange={onCampaignFilenameChange}
          onExport={() => onExport(campaignFilename, EXPORT_TYPE.CAMPAIGN)}
          exportType="Template"
        />
        <Settings
          renderMJML={renderMJML}
          setRenderMJML={setRenderMJML}
          renderVTL={renderVTL}
          setRenderVTL={setRenderVTL}
        />
      </div>
    </div>
  );
}

export default App;
