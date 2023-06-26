import React from "react";

const Data = ({ data, index, onChange }) => (
  <textarea id={`dataTextArea-${index}`} className="data" onChange={onChange}>
    {data}
  </textarea>
);

export default Data;
