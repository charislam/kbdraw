import { useEffect } from "react";

import { type KeyBindingMap, tinykeys } from "@/modules/keyboard/tinykeys";

export function useKeyboardShortcuts(
  keymap: KeyBindingMap,
  container?: Window | Document | HTMLElement,
) {
  useEffect(() => tinykeys(container ?? window, keymap), [container, keymap]);
}
