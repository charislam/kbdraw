import { setup } from "xstate";

import { Shape } from "./sharedTypes";

type Position = [number, number];

export function shapeMachineFactory({ type }: { type: Shape }) {
  return setup({
    types: {} as {
      context: { type: Shape; name: string; position: Position };
      event:
        | { type: "ui.blur" }
        | { type: "ui.focus" }
        | { type: "editMode.color" }
        | { type: "editMode.position" }
        | { type: "editMode.size" };
      input: { name: string };
    },
  }).createMachine({
    initial: "active",
    context: ({ input }) => ({
      type,
      name: input.name,
      position: [0, 0],
    }),
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
          "editMode.handles": { target: ".editHandles" },
          "editMode.position": { target: ".editPosition" },
          "editMode.rename": { target: ".editRename" },
          "editMode.size": { target: ".editSize" },
        },
        initial: "editPosition",
        states: {
          editColor: {},
          editHandles: {},
          editPosition: {},
          editRename: {},
          editSize: {},
        },
      },
    },
  });
}

export type ShapeMachine = ReturnType<typeof shapeMachineFactory>;
