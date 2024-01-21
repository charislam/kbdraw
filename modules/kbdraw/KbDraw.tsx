"use client";

import { useMemo, useState } from "react";

import { useKeyboardShortcuts } from "@/modules/hooks/useKeyboardShortcuts";
import { type KeyBindingMap } from "@/modules/keyboard/tinykeys";
import { ShapesManager } from "@/modules/shapes/ShapesManager";
import { cn } from "@/modules/ui/utils/cn";

import { Canvas, CanvasContextProvider } from "./Canvas";
import { SidePanel, SidePanelContextProvider } from "./SidePanel";
import {
  Toolbar,
  ToolbarContextProvider,
  focusFirstToolbarElem,
} from "./Toolbar";

export function KbDraw() {
  const [toolbarRef, setToolbarRef] = useState<HTMLElement>();
  const [sidePanelRef, setSidePanelRef] = useState<HTMLElement>();
  const [canvasRef, setCanvasRef] = useState<HTMLElement>();

  const keyboardShortcuts: KeyBindingMap = useMemo(
    () => ({
      "g t": () => focusFirstToolbarElem(toolbarRef),
      "g p": () => sidePanelRef?.focus(),
    }),
    [sidePanelRef, toolbarRef],
  );
  useKeyboardShortcuts(keyboardShortcuts);

  return (
    <ToolbarContextProvider value={toolbarRef}>
      <SidePanelContextProvider value={sidePanelRef}>
        <CanvasContextProvider value={canvasRef}>
          <ShapesManager />
          <Toolbar ref={setToolbarRef} />
          <div className={cn("grow", "flex flex-row")}>
            <Canvas ref={setCanvasRef} />
            <SidePanel ref={setSidePanelRef} />
          </div>
        </CanvasContextProvider>
      </SidePanelContextProvider>
    </ToolbarContextProvider>
  );
}
