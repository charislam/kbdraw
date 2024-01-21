import {
  type ComponentProps,
  type PropsWithChildren,
  type RefCallback,
  createContext,
  forwardRef,
  useContext,
} from "react";
import { createPortal } from "react-dom";

import { cn } from "@/modules/ui/utils/cn";

const ToolbarContext = createContext<HTMLElement | undefined>(undefined);
ToolbarContext.displayName = "ToolbarContext";
export const ToolbarContextProvider = (
  props: ComponentProps<typeof ToolbarContext.Provider>,
) => <ToolbarContext.Provider {...props} />;
export const useToolbarContext = () => useContext(ToolbarContext);

export function ToolbarPortal({ children }: PropsWithChildren) {
  const toolbarRef = useToolbarContext();
  return toolbarRef ? createPortal(children, toolbarRef) : null;
}

export const Toolbar = forwardRef((_, ref) => {
  return (
    <ul
      ref={ref as RefCallback<HTMLUListElement>}
      role="menubar"
      className={cn("bg-gray-100", "p-4")}
      tabIndex={-1}
    ></ul>
  );
});
Toolbar.displayName = "Toolbar";
