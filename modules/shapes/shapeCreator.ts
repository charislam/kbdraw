import { setup } from "xstate";

import { Shape } from "./sharedTypes";

export function shapeMachineFactory({ type }: { type: Shape }) {
  return setup({
    types: {} as {
      context: { type: Shape };
      event: { type: "blur" } | { type: "focus" };
    },
  }).createMachine({
    initial: "active",
    context: {
      type,
    },
    states: {
      idle: {
        on: {
          focus: { target: "active" },
        },
      },
      active: {
        on: {
          blur: { target: "idle" },
        },
      },
    },
  });
}

export type ShapeMachine = ReturnType<typeof shapeMachineFactory>;
