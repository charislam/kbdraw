import { memo } from "react";

import { cn } from "@/modules/ui/utils/cn";

export const Shape = memo(function Shape({ shape }: { shape: any }) {
  return (
    <div
      className={cn(
        "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
        "w-96 h-96",
        "bg-white border border-gray-400",
      )}
    >
      {shape.getSnapshot().context.type + "-" + shape.id}
    </div>
  );
});
Shape.displayName = "Shape";
