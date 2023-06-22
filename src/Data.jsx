import React from "react";

const Data = ({ data, index, onChange }) => (
  <div>
    <textarea id={`dataTextArea-${index}`} className="data" onChange={onChange}>
      {data}
    </textarea>
  </div>
);

export default Data;
