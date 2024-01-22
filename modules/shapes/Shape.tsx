import { useSelector } from "@xstate/react";
import { type ActorRefFrom } from "xstate";
import { type RefCallback, memo, useCallback, useMemo, useRef } from "react";

import { useKeyboardShortcuts } from "@/modules/hooks/useKeyboardShortcuts";
import { cn } from "@/modules/ui/utils/cn";

import { type ShapeMachine } from "./shapeCreator";
import { SidePanelPortal } from "../kbdraw/SidePanel";

function autoFocus(node: HTMLElement) {
  node?.focus();
}

export const Shape = memo(function Shape({
  shape,
}: {
  shape: ActorRefFrom<ShapeMachine>;
}) {
  const shapeRef = useRef<HTMLElement>();
  const value = useSelector(shape, (snapshot) => snapshot.value);
  const isActive = useSelector(shape, (snapshot) => snapshot.matches("active"));

  const setRef = useCallback((node: HTMLElement) => {
    autoFocus(node);
    shapeRef.current = node;
  }, []);

  const shortcutMap = useMemo(
    () => ({
      c: () => shape.send({ type: "editMode.color" }),
      r: () => shape.send({ type: "editMode.rename" }),
    }),
    [shape],
  );
  useKeyboardShortcuts(shortcutMap, shapeRef.current);

  return (
    <>
      <div
        ref={setRef as RefCallback<HTMLElement>}
        tabIndex={-1}
        className={cn(
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          "w-96 h-96",
          "bg-white border border-gray-400",
          "focus:border-2 focus:border-blue-400",
          "cursor-pointer",
        )}
        onFocus={() => shape.send({ type: "ui.focus" })}
        onBlur={() => shape.send({ type: "ui.blur" })}
      >
        {shape.getSnapshot().context.type + "-" + shape.id}
        {JSON.stringify(value)}
      </div>
      {isActive && (
        <SidePanelPortal>{shape.getSnapshot().context.name}</SidePanelPortal>
      )}
    </>
  );
});
Shape.displayName = "Shape";
