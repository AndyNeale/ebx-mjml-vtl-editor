import React from "react";

const Data = ({ data, onChange }) => (
  <div>
    <textarea className="data" onChange={onChange}>
      {data}
    </textarea>
  </div>
);

export default Data;
