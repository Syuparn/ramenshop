import { assign, setup, type StateValueFrom } from "xstate";

export type RamenContext = {
  size: "mini" | "small" | "medium" | "large" | null;
  vegetable: "no" | "small" | "medium" | "large";
}

type RamenAssignEventMap = {
  [T in keyof RamenContext]: {
    type: T,
    value: RamenContext[T]
  }
};

type RamenAssignEvent = RamenAssignEventMap[keyof RamenAssignEventMap];

export type RamenEvent = RamenAssignEvent | {type: "next"} | {type: "back"};

export const ramenMachine = setup({
  types: {} as {
    events: RamenEvent;
    context: RamenContext;
  },
  //actions: ramenAssignActions,
}).createMachine({
  id: "ramen",
  initial: "size",
  context: {
    size: null,
    vegetable: "medium",
  },
  states: {
    size: {
      on: {
        size: {
          actions: assign({
            size: ({event} : {event: RamenAssignEventMap["size"]}) => event.value,
          }),
        },
        next: {
          target: "vegetable",
        },
      },
    },
    vegetable: {
      on: {
        vegetable: {
          actions: assign({
            vegetable: ({event} : {event: RamenAssignEventMap["vegetable"]}) => event.value,
          }),
        },
        next: {
          target: "final",
        },
      },
    },
    final: {
      type: "final",
    },
    history: {
      type: "history",
    },
  },
});

export type RamenState = StateValueFrom<typeof ramenMachine>;

