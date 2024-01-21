"use client";

import { Canvas } from "./Canvas";
import { ShapesManagerContext } from "./ShapesManagerContext";
import { Toolbar } from "./Toolbar";

export function KbDraw() {
  return (
    <ShapesManagerContext.Provider>
      <Toolbar />
      <Canvas />
    </ShapesManagerContext.Provider>
  );
}
