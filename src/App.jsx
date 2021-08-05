import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import mjml2html from "mjml";
import Velocity from "velocityjs";

import Data from "./Data";
import Preview from "./Preview";

import useDebounce from "./useDebounce";

import "./styles.css";

function App() {
  const [rawContent, setRawContent] = useState(null);
  const debouncedContent = useDebounce(rawContent, 500);
  const [renderedContent, setRenderedContent] = useState(null);
  const [editionData, setEditionData] = useState(null);

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

  return (
    <>
      <div className="d-flex">
        <Editor
          className="editor"
          defaultLanguage="html"
          defaultValue=""
          onChange={onEditorChange}
          onMount={onEditorMount}
          width="50%"
        />
        <Preview html={renderedContent} />
      </div>
      <Data data={editionData} onChange={onDataChange} />
    </>
  );
}

export default App;
