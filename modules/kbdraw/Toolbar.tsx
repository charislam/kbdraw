import { cn } from "@/modules/ui/utils/cn";

import { ShapesManagerContext } from "./ShapesManagerContext";

export function Toolbar() {
  const shapesManager = ShapesManagerContext.useActorRef();

  return (
    <div className={cn("bg-gray-100", "p-4")}>
      <ul role="menubar">
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
      </ul>
    </div>
  );
}
