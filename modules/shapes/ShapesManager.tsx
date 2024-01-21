import { useActorRef } from "@xstate/react";
import { useEffect } from "react";
import { type ActorRefFrom } from "xstate";

import { useRerender } from "@/modules/hooks/useRerender";
import { CanvasPortal } from "@/modules/kbdraw/Canvas";
import { ToolbarPortal } from "@/modules/kbdraw/Toolbar";
import { cn } from "@/modules/ui/utils/cn";

import { Shape } from "./Shape";
import { shapesMachine } from "./shapesMachine";

export function ShapesManager() {
  const shapesManager = useActorRef(shapesMachine);

  return (
    <>
      <ToolbarPortal>
        <li>
          <button
            className={cn("rounded-lg p-2", "bg-white border border-gray-400")}
            onClick={() => {
              shapesManager.send({ type: "shapes.create", shape: "rectangle" });
            }}
          >
            Create rectangle
          </button>
        </li>
      </ToolbarPortal>
      <ShapesPainter shapesManager={shapesManager} />
    </>
  );
}

export function ShapesPainter({
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
