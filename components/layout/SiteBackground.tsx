"use client";

import { useEffect, useState } from "react";
import { GradientWave } from "@/components/ui/gradient-wave";

const LIGHT_COLORS = ["#f2f7fc", "#dfedfa", "#bddcf3", "#8bc4e8"];
const DARK_COLORS = ["#050b14", "#071a2b", "#0b2a43", "#16466a"];
const SITE_DEFORM = { incline: 0.08, noiseAmp: 72, noiseFlow: 2.2 };

export function SiteBackground() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const syncTheme = () => setDarkMode(root.classList.contains("dark"));
    const observer = new MutationObserver(syncTheme);

    syncTheme();
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="site-background" aria-hidden="true">
      <GradientWave
        colors={darkMode ? DARK_COLORS : LIGHT_COLORS}
        noiseSpeed={0.000012}
        deform={SITE_DEFORM}
      />
    </div>
  );
}
