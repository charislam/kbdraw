import {
  type ComponentProps,
  type RefCallback,
  type PropsWithChildren,
  createContext,
  forwardRef,
  useContext,
} from "react";

import { cn } from "@/modules/ui/utils/cn";
import { createPortal } from "react-dom";

const CanvasContext = createContext<HTMLElement | undefined>(undefined);
export const CanvasContextProvider = (
  props: ComponentProps<typeof CanvasContext.Provider>,
) => <CanvasContext.Provider {...props} />;
export const useCanvasContext = () => useContext(CanvasContext);

export function CanvasPortal({ children }: PropsWithChildren) {
  const canvas = useCanvasContext();
  return canvas ? createPortal(children, canvas) : null;
}

export const Canvas = forwardRef((_, ref) => {
  return (
    <div
      ref={ref as RefCallback<HTMLDivElement>}
      className={cn("grow", "relative")}
    />
  );
});
Canvas.displayName = "Canvas";
