import { assign, setup, type StateValueFrom } from "xstate";

export type RamenContext = {
  size: "mini" | "small" | "medium" | "large" | null;
  garlic: "no" | "small" | "medium" | "large";
  vegetable: "no" | "small" | "medium" | "large";
  fat: "no" | "small" | "medium" | "large" | "extralarge";
  // NOTE: RamenState cannot be used because of self type reference
  histories: string[];
}

type RamenAssignEventMap = {
  [T in keyof RamenContext]: {
    type: T,
    value: RamenContext[T]
  }
};

type RamenAssignEvent = RamenAssignEventMap[keyof RamenAssignEventMap];

export type RamenEvent = RamenAssignEvent | {type: "next"} | {type: "back"};

export type RamenState = StateValueFrom<typeof ramenMachine>;

// TODO: generate from ramenMachine
const stateKeys = [
  "size",
  "garlic",
  "vegetable",
  "fat",
];

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
    histories: [],
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
          // TODO: generate from function (somehow type does not match...)
          actions: assign({
            histories: ({context} : {context: RamenContext}) => [...context.histories, "size"],
          }),
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
          actions: assign({
            histories: ({context} : {context: RamenContext}) => [...context.histories, "garlic"],
          }),
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
          actions: assign({
            histories: ({context} : {context: RamenContext}) => [...context.histories, "vegetable"],
          }),
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
          target: "result",
          actions: assign({
            histories: ({context} : {context: RamenContext}) => [...context.histories, "fat"],
          }),
        },
        back: {
          target: "history",
        },
      },
    },
    result: {
      // NOTE: do not use type: "final", otherwise back button does not work
      on: {
        back: {
          target: "history",
        },
      },
    },
    // HACK: use histories array to move back to previous state
    history: {
      always: stateKeys.map(key => ({
        target: key,
        guard: ({context}: {context: RamenContext}) => context.histories[context.histories.length -1] === key
      })),
      exit: assign({
        // remove the last (=latest) element
        histories: ({context} : {context: RamenContext}) => context.histories.slice(0, -1),
      }),
    },
  },
});
