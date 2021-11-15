import React from "react";

const Preview = ({ html }) => (
  <div>
    <div className="section-titles">Preview</div>
    <div>
      <iframe
        className="preview"
        id="previewIframe"
        loading="lazy"
        srcDoc={html}
        title="Edition Preview"
        allowFullScreen
      />
    </div>
  </div>
);

export default Preview;
