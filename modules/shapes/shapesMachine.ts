import { type ActorRefFrom, assign, setup } from "xstate";

import { EventEmitter } from "@/modules/events/EventEmitter";
import { genId } from "@/modules/utils/genId";

import { rectangle } from "./shapeImpl/rectangle";
import type { ShapeMachine } from "./shapeCreator";
import type { Shape } from "./sharedTypes";

const SHAPE_TEMPLATES: Record<Shape, ShapeMachine> = { rectangle };

const INITIAL_SHAPES: Record<Shape, Array<string>> = {
  rectangle: [],
};

export const shapesMachine = setup({
  types: {} as {
    context: {
      changeEmitter: EventEmitter<void, void>;
      allShapes: Array<string>;
      shapesByType: Record<Shape, Array<string>>;
      shapesById: Map<string, ActorRefFrom<ShapeMachine>>;
    };
    events:
      | { type: "action.create"; shape: Shape }
      | { type: "action.clear" }
      | { type: "action.destructive.confirm" }
      | { type: "action.destructive.cancel" };
  },
  actions: {
    createShape: assign(({ context, event, spawn }) => {
      const shapeId = genId();
      if (event.type !== "action.create") {
        throw Error(
          "can only trigger action `createShape` from `action.create` events",
        );
      }

      const newShape = spawn(SHAPE_TEMPLATES[event.shape], {
        id: shapeId,
        input: { name: shapeId },
      });

      context.allShapes.push(shapeId);
      context.shapesByType[event.shape].push(shapeId);
      context.shapesById.set(shapeId, newShape);

      context.changeEmitter.emit();

      return {
        allShapes: context.allShapes,
        shapesByType: context.shapesByType,
        shapesById: context.shapesById,
      };
    }),
    clearAll: assign(({ context }) => {
      for (const key in context.shapesByType) {
        if (Object.hasOwn(context.shapesByType, key)) {
          context.shapesByType[key as keyof typeof context.shapesByType] =
            [] as Array<string>;
        }
      }
      context.shapesById.clear();

      context.changeEmitter.emit();

      return {
        allShapes: [] as Array<string>,
        shapesByType: context.shapesByType,
        shapesById: context.shapesById,
      };
    }),
  },
  guards: {
    validShape: ({ event }) =>
      event.type === "action.create" &&
      Object.hasOwn(SHAPE_TEMPLATES, event.shape),
  },
}).createMachine({
  id: "shapesManager",
  context: {
    changeEmitter: new EventEmitter(),
    allShapes: [],
    shapesByType: INITIAL_SHAPES,
    shapesById: new Map(),
  },
  initial: "editing",
  states: {
    editing: {
      id: "editing",
      on: {
        "action.create": {
          guard: { type: "validShape" },
          actions: { type: "createShape" },
        },
        "action.clear": {
          target: "confirming.clearAll",
        },
      },
    },
    confirming: {
      initial: "unknown",
      states: {
        unknown: {},
        clearAll: {
          on: {
            "action.destructive.confirm": {
              target: "#editing",
              actions: { type: "clearAll" },
            },
            "action.destructive.cancel": { target: "#editing" },
          },
        },
      },
    },
  },
});
