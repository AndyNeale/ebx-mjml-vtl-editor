import React, { useState } from "react";
import pretty from "pretty";

const Preview = ({ html }) => {
  const [currentTab, setCurrentTab] = useState("Preview");
  const [isDesktop, setDesktop] = useState(true);

  const copyHTMLToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(html)
        .then(() => {})
        .catch(() => {});
    }
    alert("HTML copied to clipboard");
  };

  function formatFileSize(bytes) {
    let size = bytes;
    const multiplier = 1024;
    if (Math.abs(size) < multiplier) {
      return `${size}B`;
    }
    const units = ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    let unit = -1;
    do {
      size /= multiplier;
      unit += 1;
    } while (Math.abs(size) >= multiplier && unit < units.length - 1);
    return `${size.toFixed(0)}${units[unit]}`;
  }

  function minifyCSS(html) {
    // Regex explanation:
    // <style.*?>      -> Matches the opening tag (handles attributes like type="text/css")
    // ([\s\S]*?)      -> Capture group: matches everything inside (including newlines)
    // <\/style>       -> Matches the closing tag
    const styleTagRegex = /<style.*?>([\s\S]*?)<\/style>/gi;
    return html.replace(styleTagRegex, (match, cssContent) => {
      const minified = cssContent
        .replace(/\/\*[\s\S]*?\*\//g, "") // Remove comments
        .replace(/\s*([{}|:;,])\s*/g, "$1") // Remove spaces around syntax
        .replace(/\s+/g, " ") // Collapse whitespace
        .trim();
      // Reconstruct the tag (keeping the original opening tag attributes)
      const openingTag = match.match(/<style.*?>/i)?.[0] || "<style>";
      return `${openingTag}${minified}</style>`;
    });
  }

  function stripWhitespace(html) {
    return (
      html
        // Remove newlines
        .replace(/[\n\r]+/g, "")
        // Remove leading tabs and spaces
        .replace(/[\t ]+</g, "<")
        // Remove spaces between tags
        .replace(/>[\t ]+</g, "><")
        // Remove trailing tabs and spaces
        .replace(/>[\t ]+$/g, ">")
    );
  }

  const minified = stripWhitespace(minifyCSS(html ?? ""));

  return (
    <div className="preview-panel">
      <div className="toolbar">
        <button onClick={() => setCurrentTab("Preview")} className={currentTab === "Preview" ? "active" : ""}>
          Preview
        </button>
        <button onClick={() => setCurrentTab("HTML")} className={currentTab === "HTML" ? "active" : ""}>
          HTML
        </button>
        <button onClick={() => setCurrentTab("Minified")} className={currentTab === "Minified" ? "active" : ""}>
          Minified
        </button>
        {currentTab === "HTML" && <button onClick={copyHTMLToClipboard}>Copy</button>}
        <span className="toolbar-spacer" />
        <button onClick={() => setDesktop(true)} className={isDesktop ? "active" : ""}>
          Desktop
        </button>
        <button onClick={() => setDesktop(false)} className={isDesktop ? "" : "active"}>
          Mobile
        </button>
        <span className="file-size">
          {formatFileSize((html ?? "").length)} / {formatFileSize(minified.length)}
        </span>
      </div>
      <div className="preview-body">
        {currentTab === "Preview" && (
          <div className="preview">
            <iframe className={isDesktop ? "desktop" : "mobile"} id="previewIframe" loading="lazy" srcDoc={html} title="Edition Preview" allowFullScreen />
          </div>
        )}
        {currentTab === "HTML" && (
          <div className="preview html">
            <pre>{pretty(html ?? "")}</pre>
          </div>
        )}
        {currentTab === "Minified" && (
          <div className="preview html">
            <pre>{minified}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Preview;
