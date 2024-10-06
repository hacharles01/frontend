import React from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";

import "@react-pdf-viewer/default-layout/lib/styles/index.css";

import pdf from "../../assets/rbm_user_guide.pdf";

const UserGuide = () => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <div
      className=""
      style={{
        height: "80vh",
      }}
    >
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.1.81/build/pdf.worker.min.js">
        <Viewer fileUrl={pdf} plugins={[defaultLayoutPluginInstance]} />
      </Worker>
    </div>
  );
};

export default UserGuide;
