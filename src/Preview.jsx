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
        </div>
      </div>
      <div>
        {currentTab === "Preview" ? (
          <div className="preview">
            <iframe className={isDesktop ? "desktop" : "mobile"} id="previewIframe" loading="lazy" srcDoc={html} title="Edition Preview" allowFullScreen />
          </div>
        ) : (
          <div className="preview html">
            <pre>{pretty(html)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Preview;
