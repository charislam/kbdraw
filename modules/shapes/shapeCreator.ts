import { setup } from "xstate";

import { Shape } from "./sharedTypes";

type Position = [number, number];

export function shapeMachineFactory({ type }: { type: Shape }) {
  return setup({
    types: {} as {
      context: { type: Shape; position: Position };
      event:
        | { type: "ui.blur" }
        | { type: "ui.focus" }
        | { type: "editMode.color" }
        | { type: "editMode.position" }
        | { type: "editMode.size" };
    },
  }).createMachine({
    initial: "active",
    context: {
      type,
      position: [0, 0],
    },
    states: {
      idle: {
        on: {
          "ui.focus": { target: "active" },
        },
      },
      active: {
        on: {
          "ui.blur": { target: "idle" },
          "editMode.color": { target: ".editColor" },
          "editMode.position": { target: ".editPosition" },
          "editMode.size": { target: ".editSize" },
        },
        initial: "editPosition",
        states: {
          editColor: {},
          editPosition: {},
          editSize: {},
        },
      },
    },
  });
}

export type ShapeMachine = ReturnType<typeof shapeMachineFactory>;
