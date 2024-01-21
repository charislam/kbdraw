import {
  type ComponentProps,
  type MouseEventHandler,
  type PropsWithChildren,
  type RefCallback,
  createContext,
  forwardRef,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { createPortal } from "react-dom";

import { cn } from "@/modules/ui/utils/cn";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";

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

const TOOLBAR_BUTTON_DATA_ATTRIBUTE = "data-toolbar-button";

function getToolbarElems(toolbarRef: HTMLElement | undefined) {
  if (!toolbarRef) return;
  return toolbarRef.querySelectorAll(`[${TOOLBAR_BUTTON_DATA_ATTRIBUTE}]`);
}

function getFirstToolbarElem(toolbarRef: HTMLElement | undefined) {
  if (!toolbarRef) return;
  return getToolbarElems(toolbarRef)?.item(0);
}

export function focusFirstToolbarElem(toolbarRef: HTMLElement | undefined) {
  if (!toolbarRef) return;
  (getFirstToolbarElem(toolbarRef) as HTMLElement)?.focus();
}

function focusNext(toolbarRef: HTMLElement | undefined) {
  if (!toolbarRef) return;

  const currentlyFocused = document.activeElement;
  if (
    !toolbarRef.contains(currentlyFocused) ||
    !currentlyFocused?.matches(`[${TOOLBAR_BUTTON_DATA_ATTRIBUTE}]`)
  ) {
    return;
  }

  let allToolbarElems = getToolbarElems(toolbarRef);
  if (!allToolbarElems) return;

  for (let i = 0; i < allToolbarElems.length; i++) {
    if (allToolbarElems.item(i) === currentlyFocused) {
      if (i === allToolbarElems.length - 1) {
        (allToolbarElems.item(0) as HTMLElement).focus();
      } else {
        (allToolbarElems.item(i + 1) as HTMLElement).focus();
      }
    }
  }
}

function focusPrevious(toolbarRef: HTMLElement | undefined) {
  if (!toolbarRef) return;

  const currentlyFocused = document.activeElement;
  if (
    !toolbarRef.contains(currentlyFocused) ||
    !currentlyFocused?.matches(`[${TOOLBAR_BUTTON_DATA_ATTRIBUTE}]`)
  ) {
    return;
  }

  let allToolbarElems = getToolbarElems(toolbarRef);
  if (!allToolbarElems) return;

  for (let i = 0; i < allToolbarElems.length; i++) {
    if (allToolbarElems.item(i) === currentlyFocused) {
      if (i === 0) {
        (
          allToolbarElems.item(allToolbarElems.length - 1) as HTMLElement
        ).focus();
      } else {
        (allToolbarElems.item(i - 1) as HTMLElement).focus();
      }
    }
  }
}

export const Toolbar = forwardRef((_, ref) => {
  const toolbarRef = useToolbarContext();

  const shortcutMap = useMemo(
    () => ({
      ArrowRight: () => focusNext(toolbarRef),
      ArrowLeft: () => focusPrevious(toolbarRef),
    }),
    [toolbarRef],
  );

  useKeyboardShortcuts(shortcutMap);

  return (
    <ul
      ref={ref as RefCallback<HTMLUListElement>}
      role="menubar"
      className={cn("bg-gray-100", "p-4", "flex flex-row gap-2")}
    ></ul>
  );
});
Toolbar.displayName = "Toolbar";

export function ToolbarButton({
  children,
  onClick,
}: PropsWithChildren<{
  onClick: MouseEventHandler<HTMLButtonElement>;
}>) {
  const toolbarRef = useToolbarContext();

  const [tabIndex, setTabIndex] = useState(-1);

  const setFocus = useCallback(
    (node: HTMLButtonElement) => {
      if (node === getFirstToolbarElem(toolbarRef)) setTabIndex(0);
    },
    [toolbarRef],
  );

  return (
    <li>
      <button
        ref={setFocus}
        role="menuitem"
        className={cn("rounded-lg p-2", "bg-white border border-gray-400")}
        onClick={onClick}
        tabIndex={tabIndex}
        data-toolbar-button={true}
      >
        {children}
      </button>
    </li>
  );
}
