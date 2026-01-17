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

const assignObj = (key: keyof RamenAssignEventMap) => {
  return {
    [key]: ({event} : {event: RamenAssignEventMap[typeof key]}) => event.value,
  } as const;
};

const historiesObj = (key: keyof RamenAssignEventMap) => {
  return {
    histories: ({context} : {context: RamenContext}) => [...context.histories, key],
  } as const;
};

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
          actions: assign(assignObj("size")),
        },
        next: [
          // mini ramen does not have garlic option
          {
            target: "vegetable",
            guard: ({context} : {context: RamenContext}) => context.size === "mini",
            actions: assign(historiesObj("size")),
          },
          // default
          {
            target: "garlic",
            actions: assign(historiesObj("size")),
          },
        ],
      },
    },
    garlic: {
      on: {
        garlic: {
          actions: assign(assignObj("garlic")),
        },
        next: {
          target: "vegetable",
          actions: assign(historiesObj("garlic")),
        },
        back: {
          target: "history",
        },
      },
    },
    vegetable: {
      on: {
        vegetable: {
          actions: assign(assignObj("vegetable")),
        },
        next: {
          target: "fat",
          actions: assign(historiesObj("vegetable")),
        },
        back: {
          target: "history",
        },
      },
    },
    fat: {
      on: {
        fat: {
          actions: assign(assignObj("fat")),
        },
        next: {
          target: "result",
          actions: assign(historiesObj("fat")),
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
