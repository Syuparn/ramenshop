import { assign, setup, type StateValueFrom } from "xstate";

export type RamenContext = {
  size: "mini" | "small" | "medium" | "large" | null;
  garlic: "no" | "small" | "medium" | "large";
  vegetable: "no" | "small" | "medium" | "large";
  fat: "no" | "small" | "medium" | "large" | "extralarge";
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
}).createMachine({
  id: "ramen",
  initial: "size",
  context: {
    size: null,
    garlic: "medium",
    vegetable: "medium",
    fat: "medium",
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
          target: "garlic",
        },
      },
    },
    garlic: {
      on: {
        garlic: {
          actions: assign({
            garlic: ({event} : {event: RamenAssignEventMap["garlic"]}) => event.value,
          }),
        },
        next: {
          target: "vegetable",
        },
        back: {
          target: "history",
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
          target: "fat",
        },
        back: {
          target: "history",
        },
      },
    },
    fat: {
      on: {
        fat: {
          actions: assign({
            fat: ({event} : {event: RamenAssignEventMap["fat"]}) => event.value,
          }),
        },
        next: {
          target: "final",
        },
        back: {
          target: "history",
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

