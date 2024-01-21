import { useActorRef, useSelector } from "@xstate/react";
import { useEffect } from "react";
import { type ActorRefFrom } from "xstate";

import { useRerender } from "@/modules/hooks/useRerender";
import { CanvasPortal } from "@/modules/kbdraw/Canvas";
import { ToolbarButton, ToolbarPortal } from "@/modules/kbdraw/Toolbar";
import { cn } from "@/modules/ui/utils/cn";

import { Shape } from "./Shape";
import { shapesMachine } from "./shapesMachine";

export function ShapesManager() {
  const shapesManager = useActorRef(shapesMachine);
  const showConfirmationModal = useSelector(
    shapesManager,
    (snapshot) => snapshot.value === "confirming",
  );

  return (
    <>
      <ToolbarPainter shapesManager={shapesManager} />
      <ShapesPainter shapesManager={shapesManager} />
      {showConfirmationModal && (
        <p>
          Confirm this destructive action.
          <button
            onClick={() => {
              shapesManager.send({ type: "action.destructive.cancel" });
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              shapesManager.send({ type: "action.destructive.confirm" });
            }}
          >
            Confirm
          </button>
        </p>
      )}
    </>
  );
}

function ToolbarPainter({
  shapesManager,
}: {
  shapesManager: ActorRefFrom<typeof shapesMachine>;
}) {
  return (
    <ToolbarPortal>
      <ToolbarButton
        onClick={() => {
          shapesManager.send({ type: "action.create", shape: "rectangle" });
        }}
      >
        Create rectangle
      </ToolbarButton>
      <ToolbarButton
        onClick={() => {
          shapesManager.send({ type: "action.clear" });
        }}
      >
        Clear all
      </ToolbarButton>
    </ToolbarPortal>
  );
}

function ShapesPainter({
  shapesManager,
}: {
  shapesManager: ActorRefFrom<typeof shapesMachine>;
}) {
  const rerender = useRerender();

  useEffect(() => {
    return shapesManager
      .getSnapshot()
      .context.changeEmitter.subscribe(rerender);
  }, [rerender, shapesManager]);

  const snapshot = shapesManager.getSnapshot();

  return (
    <CanvasPortal>
      {snapshot.context.allShapes.map((shape) => (
        <Shape key={shape.id} shape={shape} />
      ))}
    </CanvasPortal>
  );
}
