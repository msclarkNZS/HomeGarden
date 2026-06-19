import React from "react";
import { createRoot } from "react-dom/client";
import GardenManager from "./GardenManager.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GardenManager />
  </React.StrictMode>
);
