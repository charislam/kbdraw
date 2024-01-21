import { useSelector } from "@xstate/react";
import { type ActorRefFrom } from "xstate";
import { type RefCallback, memo } from "react";

import { cn } from "@/modules/ui/utils/cn";

import { type ShapeMachine } from "./shapeCreator";

function autoFocus(node: HTMLElement) {
  node?.focus();
}

export const Shape = memo(function Shape({
  shape,
}: {
  shape: ActorRefFrom<ShapeMachine>;
}) {
  const value = useSelector(shape, (snapshot) => snapshot.value);

  return (
    <div
      ref={autoFocus as RefCallback<HTMLDivElement>}
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
  );
});
Shape.displayName = "Shape";
