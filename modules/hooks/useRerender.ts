import { useReducer } from "react";

export function useRerender() {
  const [, rerender] = useReducer((sem) => (sem === 0 ? 1 : 0), 0);
  return rerender;
}
