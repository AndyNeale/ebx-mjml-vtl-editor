import React, { useState } from "react";
import pretty from "pretty";

const Preview = ({ html }) => {
  const [currentTab, setCurrentTab] = useState("Preview");

  return (
    <div>
      <div className="section-titles-container">
        <div className="d-flex">
          <div className="section-titles">
            <button onClick={() => setCurrentTab("Preview")}>Preview</button>
          </div>
          <div className="section-titles">
            <button onClick={() => setCurrentTab("HTML")}>HTML</button>
          </div>
        </div>
      </div>
      <div>
        {currentTab === "Preview" ? (
          <iframe
            className="preview"
            id="previewIframe"
            loading="lazy"
            srcDoc={html}
            title="Edition Preview"
            allowFullScreen
          />
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
