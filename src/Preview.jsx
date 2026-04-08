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

  function stripWhitespace(str) {
    return str
      .replace(/\n/g, "")
      .replace(/[\t ]+\</g, "<")
      .replace(/\>[\t ]+\</g, "><")
      .replace(/\>[\t ]+$/g, ">");
  }

  return (
    <div>
      <div className="section-titles-container">
        <div className="d-flex">
          <div className="section-titles">
            <button onClick={() => setCurrentTab("Preview")} className={currentTab === "Preview" ? "active" : ""}>
              Preview
            </button>
          </div>
          <div className="section-titles">
            <button onClick={() => setCurrentTab("HTML")} className={currentTab === "HTML" ? "active" : ""}>
              HTML
            </button>
          </div>
          {currentTab === "HTML" && (
            <div className="section-titles">
              <button onClick={copyHTMLToClipboard}>Copy</button>
            </div>
          )}
          <div className="section-titles">
            <button onClick={() => setDesktop(true)} className={isDesktop ? "active" : ""}>
              Desktop
            </button>
          </div>
          <div className="section-titles">
            <button onClick={() => setDesktop(false)} className={isDesktop ? "" : "active"}>
              Mobile
            </button>
          </div>
          <div style={{ fontSize: "14px", padding: "2px 5px" }}>
            {formatFileSize((html ?? "").length)} / {formatFileSize(stripWhitespace(html ?? "").length)}
          </div>
        </div>
      </div>
      <div>
        {currentTab === "Preview" ? (
          <div className="preview">
            <iframe className={isDesktop ? "desktop" : "mobile"} id="previewIframe" loading="lazy" srcDoc={html} title="Edition Preview" allowFullScreen />
          </div>
        ) : (
          <div className="preview html">
            <pre>{pretty(html ?? "")}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Preview;
