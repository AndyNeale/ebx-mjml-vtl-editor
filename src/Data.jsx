import React from "react";

const Data = ({ data, onChange }) => (
  <div>
    <textarea
      id="dataTextarea"
      className="data"
      onChange={onChange}
      value={data}
    />
  </div>
);

export default Data;
