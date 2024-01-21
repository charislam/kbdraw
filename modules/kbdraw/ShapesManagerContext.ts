import { createActorContext } from "@xstate/react";

import { shapesManager } from "@/modules/shapes/shapesManager";

export const ShapesManagerContext = createActorContext(shapesManager);
