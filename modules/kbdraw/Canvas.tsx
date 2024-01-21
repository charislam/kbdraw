import { useEffect } from "react";

import { useRerender } from "@/modules/hooks/useRerender";
import { cn } from "@/modules/ui/utils/cn";
import { Shape } from "@/modules/shapes/Shape";

import { ShapesManagerContext } from "./ShapesManagerContext";

export function Canvas() {
  const shapesManager = ShapesManagerContext.useActorRef();
  const rerender = useRerender();

  useEffect(() => {
    return shapesManager
      .getSnapshot()
      .context.changeEmitter.subscribe(rerender);
  }, [rerender, shapesManager]);

  const snapshot = shapesManager.getSnapshot();

  return (
    <div className={cn("grow")}>
      {snapshot.context.allShapes.map((shape) => (
        <Shape key={shape.id} shape={shape} />
      ))}
    </div>
  );
}
