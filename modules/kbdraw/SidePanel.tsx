import {
  type ComponentProps,
  type RefCallback,
  createContext,
  forwardRef,
  useContext,
} from "react";

import { cn } from "@/modules/ui/utils/cn";

const SidePanelContext = createContext<HTMLElement | undefined>(undefined);
SidePanelContext.displayName = "SidePanelContext";
export const SidePanelContextProvider = (
  props: ComponentProps<typeof SidePanelContext.Provider>,
) => <SidePanelContext.Provider {...props} />;
export const useSidePanelContext = () => useContext(SidePanelContext);

export const SidePanel = forwardRef((_, ref) => {
  return (
    <div
      ref={ref as RefCallback<HTMLDivElement>}
      className={cn("w-96", "bg-blue-50")}
      tabIndex={-1}
    />
  );
});
SidePanel.displayName = "SidePanel";
