import { setup } from "xstate";

import { Shape } from "./sharedTypes";

export function shapeMachineFactory({ type }: { type: Shape }) {
  return setup({ types: {} as { context: { type: Shape } } }).createMachine({
    initial: "active",
    context: {
      type,
    },
    states: {
      idle: {},
      active: {},
    },
  });
}

export type ShapeMachine = ReturnType<typeof shapeMachineFactory>;
