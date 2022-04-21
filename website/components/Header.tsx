import * as React from "react";
import { useState, useEffect, CSSProperties } from "react";

export default function Header() {
  const headerMirror = `

KEEP YOUR VALIDATORS HEALTHY

            _   _                           _ _             
        ___| |_| |__  _ __ ___   ___  _ __ (_) |_ ___  _ __ 
       / _ \\ __| '_ \\| '_ ' _ \\ / _ \\| '_ \\| | __/ _ \\| '__|
      |  __/ |_| | | | | | | | | (_) | | | | | || (_) | |   
       \\___|\\__|_| |_|_| |_| |_|\\___/|_| |_|_|\\__\\___/|_|   

       
                                               ALWAYS BE STAKING
`;

  // mirror effect
  const [loc, setLoc] = useState(-1200);
  useEffect(() => {
    const onScroll = () => setLoc(Math.min(-900 + window.scrollY * 6, 0));
    window.addEventListener("scroll", onScroll);
  }, []);

  const percent = Math.exp(-(500 * 500) / (loc * loc)) * 100;
  const gradientStops = [
    `#888 ${percent - 10}%`,
    `#bbb ${percent - 5}%`,
    `#fff ${percent + 0}%`,
    `#bbb ${percent + 5}%`,
    `#555 ${percent + 10}%`,
  ];
  const mirrorStyle: CSSProperties = {
    backgroundImage: `linear-gradient(45deg, ${gradientStops.join(", ")})`,
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    color: "transparent",
  };

  return (
    <div className="hero">
      <pre style={mirrorStyle}>{headerMirror}</pre>
    </div>
  );
}
