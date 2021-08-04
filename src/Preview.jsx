import React from "react";

const Preview = ({ html }) => (
  <div dangerouslySetInnerHTML={{ __html: html }} />
);

export default Preview;
