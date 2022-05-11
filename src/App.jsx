import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import mjml2html from "mjml-browser";
import FileSaver from "file-saver";
import Velocity from "velocityjs";

import Data from "./Data";
import Export from "./Export";
import Preview from "./Preview";

import useDebounce from "./useDebounce";

import { EXAMPLE_DATA } from "./data/example";

import "./styles.css";

const EXPORT_TYPE = {
  ENCODED: 'ENCODED',
  NOT_ENCODED: 'NOT ENCODED',
}

function App() {
  const [rawContent, setRawContent] = useState(null);
  const debouncedContent = useDebounce(rawContent, 500);
  const [renderedContent, setRenderedContent] = useState(null);
  const [editionData, setEditionData] = useState("");
  // const [masterFilename, setMasterFilename] = useState("template");
  const [campaignFilename, setCampaignFilename] = useState("template");

  useEffect(() => {
    if (debouncedContent) {
      let vtl;
      let html;
      try {
        vtl = Velocity.render(debouncedContent, editionData);
        // console.log(html);
        // console.log("VTL OK");
      } catch (error) {
        // console.log("VTL ERROR");
        // console.log(error);
      }
      try {
        html = mjml2html(vtl).html;
        setRenderedContent(html);
        // console.log(html);
        // console.log("MJML OK");
      } catch (error) {
        // console.log("MJML ERROR");
        // console.log(error);
        return;
      }
    }
  }, [debouncedContent, editionData]);

  const editorRef = useRef(null);

  const onDataChange = (data) => {
    try {
      const json = JSON.parse(data);
      setEditionData(json);
    } catch (error) {
      // console.log('DATA ERROR');
      // console.log(error);
    }
  };

  const onEditorChange = (value) => {
    // console.log("onChange");
    setRawContent(value);
  };

  const onEditorMount = (editor) => {
    // console.log("onMount");
    editorRef.current = editor;
  };

  const escapeString = str => {
    const escapedString = str.replace(/[\\]/g, '\\\\')
    .replace(/[\"]/g, '\\\"')
    .replace(/[\/]/g, '\\/')
    .replace(/[\b]/g, '\\b')
    .replace(/[\f]/g, '\\f')
    .replace(/[\n]/g, '\\n')
    .replace(/[\r]/g, '\\r')
    .replace(/[\t]/g, '\\t')
    return escapedString;
  };

  const onExport = (filename, fileType) => {
    if (!debouncedContent) {
      return;
    }

    // console.log("onExport");
    let escaped = debouncedContent.replace(
      /(^ *)(#[\S ]+)([\n\r])/gm,
      "$1<mj-raw>$2</mj-raw>$3"
    );
    // console.log(escaped);
    let vtl;
    try {
      vtl = mjml2html(escaped).html;
      if (fileType === EXPORT_TYPE.MASTER)
      {
        vtl = escapeString(vtl);
      }
    } catch (error) {
      // console.log("VTL ERROR");
      // console.log(error);
      return;
    }
    
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(vtl, `${filename}.vtl`);
    } else {
      const blob = new Blob([vtl], { type: "text/plain;charset=utf-8" });
      FileSaver.saveAs(blob, `${filename}.vtl`);
    }
  };

  // const onMasterFilenameChange = (event) => setMasterFilename(event.target.value);
  const onCampaignFilenameChange = (event) => setCampaignFilename(event.target.value);

  const handleUseExampleJSON = () => {
    const json = JSON.stringify(EXAMPLE_DATA, null, 4);
    document.getElementById("dataTextarea").value = json;
    onDataChange(json);
  }

  return (
    <>
      <div className="d-flex">
        <div className="editor-container">
          <div className="section-titles">Editor</div>
          <Editor
            className="editor"
            defaultLanguage="html"
            defaultValue=""
            onChange={onEditorChange}
            onMount={onEditorMount}
          />
        </div>
        <div className="preview-container">
          <Preview html={renderedContent} />
        </div>
      </div>
      <div className="d-flex">
        <div className="section-titles d-flex align-items-center">Data</div>
        <button onClick={handleUseExampleJSON} className="m-0 p-0">Use Example JSON - 10/05/22</button>
      </div>
      <Data data={editionData} onChange={event => onDataChange(event.target.value)} />
      {/* Old Method which manually encodes the template, was used for when we didn't apply encoding on the backend */}
      {/* <Export
        filename={masterFilename}
        onChange={onMasterFilenameChange}
        onExport={() => onExport(masterFilename, EXPORT_TYPE.MASTER)}
        exportType={EXPORT_TYPE.ENCODED}
      /> */}
      <Export
        filename={campaignFilename}
        onChange={onCampaignFilenameChange}
        onExport={() => onExport(campaignFilename, EXPORT_TYPE.CAMPAIGN)}
        exportType="Template"
      />
    </>
  );
}

export default App;
