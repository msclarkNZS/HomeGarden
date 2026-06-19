import React, { useState, useEffect, useMemo } from "react";
import { createRoot } from "react-dom/client";
import GardenManager, { CloudCtx } from "./GardenManager.jsx";
import { cloudConfigured, onAuth, signIn, signUp, signOut, pull, push } from "./cloud.js";

function Root() {
  const [session, setSession] = useState(null);
  useEffect(() => { if (!cloudConfigured) return; return onAuth(setSession); }, []);

  const cloud = useMemo(() => cloudConfigured ? {
    configured: true, session, signIn, signUp, signOut, pull, push,
  } : null, [session]);

  return (
    <CloudCtx.Provider value={cloud}>
      <GardenManager />
    </CloudCtx.Provider>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
