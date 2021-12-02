import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import mjml2html from "mjml-browser";
import FileSaver from "file-saver";
import Velocity from "velocityjs";

import Data from "./Data";
import Export from "./Export";
import Preview from "./Preview";

import useDebounce from "./useDebounce";

import "./styles.css";

const EXPORT_TYPE = {
  MASTER: 'MASTER',
  CAMPAIGN: 'CAMPAIGN',
}

function App() {
  const [rawContent, setRawContent] = useState(null);
  const debouncedContent = useDebounce(rawContent, 500);
  const [renderedContent, setRenderedContent] = useState(null);
  const [editionData, setEditionData] = useState(null);
  const [masterFilename, setMasterFilename] = useState("template");
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

  const onDataChange = (event) => {
    try {
      const raw = event.target.value;
      const json = JSON.parse(raw);
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

  const onMasterFilenameChange = (event) => setMasterFilename(event.target.value);
  const onCampaignFilenameChange = (event) => setCampaignFilename(event.target.value);

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

      <div className="section-titles">Data</div>
      <Data data={editionData} onChange={onDataChange} />
      <Export
        filename={masterFilename}
        onChange={onMasterFilenameChange}
        onExport={() => onExport(masterFilename, EXPORT_TYPE.MASTER)}
        exportType={EXPORT_TYPE.MASTER}
      />
      <Export
        filename={campaignFilename}
        onChange={onCampaignFilenameChange}
        onExport={() => onExport(campaignFilename, EXPORT_TYPE.CAMPAIGN)}
        exportType={EXPORT_TYPE.CAMPAIGN}
      />
    </>
  );
}

export default App;
