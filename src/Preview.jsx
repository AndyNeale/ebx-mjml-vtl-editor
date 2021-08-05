import React from "react";

const Preview = ({ html }) => (
  <iframe
    className="preview"
    id="previewIframe"
    loading="lazy"
    srcDoc={html}
    title="Edition Preview"
    allowFullScreen
  />
);

export default Preview;
