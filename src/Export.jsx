import React from "react";

const Export = ({ filename, onChange, onExport }) => (
  <div>
    <label htmlFor="filename">Filename</label>
    <input name="filename" type="text" value={filename} onChange={onChange} />
    <label>.vtl</label>
    <button onClick={onExport}>Export</button>
  </div>
);

export default Export;
