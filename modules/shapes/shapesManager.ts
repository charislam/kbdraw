import { type ActorRefFrom, assign, setup } from "xstate";

import { EventEmitter } from "@/modules/events/EventEmitter";
import { genId } from "@/modules/utils/genId";

import { rectangle } from "./shapeImpl/rectangle";
import type { ShapeMachine } from "./shapeCreator";
import type { Shape } from "./sharedTypes";

const SHAPE_TEMPLATES: Record<Shape, ShapeMachine> = { rectangle };

const INITIAL_SHAPES: Record<Shape, Array<ActorRefFrom<ShapeMachine>>> = {
  rectangle: [],
};

export const shapesManager = setup({
  types: {} as {
    context: {
      changeEmitter: EventEmitter<void, void>;
      allShapes: Array<ActorRefFrom<ShapeMachine>>;
      shapesByType: Record<Shape, Array<ActorRefFrom<ShapeMachine>>>;
      shapesById: Map<string, ActorRefFrom<ShapeMachine>>;
    };
    events: { type: "create"; shape: Shape };
  },
  actions: {
    createShape: assign(({ context, event, spawn }) => {
      const newShape = spawn(SHAPE_TEMPLATES[event.shape]);

      context.allShapes.push(newShape);
      context.shapesByType[event.shape].push(newShape);
      context.shapesById.set(genId(), newShape);

      context.changeEmitter.emit();

      return {
        allShapes: context.allShapes,
        shapesByType: context.shapesByType,
        shapesById: context.shapesById,
      };
    }),
  },
  guards: {
    validShape: ({ event }) => Object.hasOwn(SHAPE_TEMPLATES, event.shape),
  },
}).createMachine({
  id: "shapesManager",
  context: {
    changeEmitter: new EventEmitter(),
    allShapes: [],
    shapesByType: INITIAL_SHAPES,
    shapesById: new Map(),
  },
  initial: "active",
  states: {
    active: {
      on: {
        create: {
          guard: { type: "validShape" },
          actions: { type: "createShape" },
        },
      },
    },
  },
});
