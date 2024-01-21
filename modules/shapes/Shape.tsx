import { useSelector } from "@xstate/react";
import { type ActorRefFrom } from "xstate";
import { memo, useSyncExternalStore } from "react";

import { cn } from "@/modules/ui/utils/cn";

import { type ShapeMachine } from "./shapeCreator";

function autoFocus(node: HTMLElement) {
  node.focus();
}

export const Shape = memo(function Shape({
  shape,
}: {
  shape: ActorRefFrom<ShapeMachine>;
}) {
  const value = useSelector(shape, (snapshot) => snapshot.value);

  return (
    <div
      ref={autoFocus}
      tabIndex={0}
      className={cn(
        "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
        "w-96 h-96",
        "bg-white border border-gray-400",
        "focus:border-2 focus:border-blue-400",
      )}
      onFocus={() => shape.send({ type: "focus" })}
      onBlur={() => shape.send({ type: "blur" })}
    >
      {shape.getSnapshot().context.type + "-" + shape.id}
      {value}
    </div>
  );
});
Shape.displayName = "Shape";
