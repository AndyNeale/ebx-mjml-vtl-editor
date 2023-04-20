import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import mjml2html from "mjml-browser";
import FileSaver from "file-saver";
import Velocity from "velocityjs";

import Data from "./Data";
import Export from "./Export";
import Preview from "./Preview";
import Settings from "./Settings";

import useDebounce from "./useDebounce";

import { EXAMPLE_DATA } from "./data/example";

import "./styles.css";

const MJML = {
  API_URL: "https://api.mjml.io/v1/render",
  APPLICATION_ID: "bdc1c2c6-6469-4bb1-a4d3-0383d46fb4de",
  CORS_PROXY_URL: "https://corsproxy.service.echobox.com/",
  PUBLIC_KEY: "bcceb0fc-4c37-41da-9851-db1017b2eb92",
};

const EXPORT_TYPE = {
  ENCODED: "ENCODED",
  NOT_ENCODED: "NOT ENCODED",
};

function App() {
  const [rawContent, setRawContent] = useState(null);
  const debouncedContent = useDebounce(rawContent, 500);
  const [renderedContent, setRenderedContent] = useState(null);
  const [editionData, setEditionData] = useState("");
  const [campaignFilename, setCampaignFilename] = useState("template");
  const [renderMJML, setRenderMJML] = useState(true);
  const [renderVTL, setRenderVTL] = useState(true);

  useEffect(() => {
    const renderTemplate = async () => {
      if (debouncedContent) {
        let output = debouncedContent.replace(
          /(^ *)(#[\S ]+)([\n\r])/gm,
          "$1<mj-raw>$2</mj-raw>$3"
        );
        if (renderVTL) {
          try {
            output = Velocity.render(output, {
              ...editionData,
              ebx: {
                isCustomBlock: (string) => string.includes("@@@"),
                getBlockType: (string) =>
                  string
                    .replaceAll("@@@", "")
                    .replace("urn:newsletter:block:", ""),
              },
              json: {
                parse: (string) => new Map(Object.entries(JSON.parse(string))),
              },
            });
          } catch (error) {
            console.log("VTL rendering error", error);
          }
        } else {
          //
        }
        if (renderMJML) {
          try {
            const config = {
              url: `${MJML.CORS_PROXY_URL}${MJML.API_URL}`,
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "Echobox",
              },
              auth: {
                username: MJML.APPLICATION_ID,
                password: MJML.PUBLIC_KEY,
              },
              data: JSON.stringify({
                mjml: output,
              }),
            };
            const response = await axios(config);
            output = response.data.html;
            /*
            const credentials = Buffer.from(
              `${MJML.APPLICATION_ID}:${MJML.PUBLIC_KEY}`
            ).toString("base64");
            const result = await fetch(MJML.API_URL, {
              method: "POST",
              headers: {
                Authorization: `Basic ${credentials}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                render_mjml: output,
              }),
            });
            output = result.json().html;
            */
          } catch (error) {
            console.log("MJML rendering error", error);
            return;
          }
        } else {
          //
        }
        setRenderedContent(output);
      }
    };
    renderTemplate();
  }, [debouncedContent, editionData, renderMJML, renderVTL]);

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

  const onExport = (filename, fileType) => {
    if (!debouncedContent) {
      return;
    }

    let escaped = debouncedContent.replace(
      /(^ *)(#[\S ]+)([\n\r])/gm,
      "$1<mj-raw>$2</mj-raw>$3"
    );
    // console.log(escaped);
    let vtl;
    try {
      vtl = mjml2html(escaped).html;
    } catch (error) {
      console.log("Export error", error);
      return;
    }

    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(vtl, `${filename}.vtl`);
    } else {
      const blob = new Blob([vtl], { type: "text/plain;charset=utf-8" });
      FileSaver.saveAs(blob, `${filename}.vtl`);
    }
  };

  const onCampaignFilenameChange = (event) =>
    setCampaignFilename(event.target.value);

  const handleUseExampleJSON = () => {
    const json = JSON.stringify(EXAMPLE_DATA, null, 4);
    document.getElementById("dataTextarea").value = json;
    onDataChange(json);
  };

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
        <button onClick={handleUseExampleJSON} className="m-0 p-0">
          Use Example JSON - 10/05/22
        </button>
      </div>
      <Data
        data={JSON.stringify(editionData, null, 2)}
        onChange={(event) => onDataChange(event.target.value)}
      />
      <Export
        filename={campaignFilename}
        onChange={onCampaignFilenameChange}
        onExport={() => onExport(campaignFilename, EXPORT_TYPE.CAMPAIGN)}
        exportType="Template"
      />
      <Settings
        renderMJML={renderMJML}
        setRenderMJML={setRenderMJML}
        renderVTL={renderVTL}
        setRenderVTL={setRenderVTL}
      />
    </>
  );
}

export default App;
