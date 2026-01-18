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

const actionObj = <Key extends (keyof RamenContext)>({questionKey, nextQuestionKey, nextConditions, hasBack}: {
  questionKey: Key;
  nextQuestionKey: keyof RamenContext | "result";
  nextConditions: {target: keyof RamenContext, guard: ({context} : {context: RamenContext}) => boolean}[];
  hasBack: boolean;
}) => {
  const nextActions = nextConditions.map(cond => ({
    ...cond,
    // NOTE: generic parameters of assign cannot be inferred here, so specify them explicitly
    actions: assign<RamenContext, {type: "next"}, undefined, RamenEvent, never>({
      histories: ({context} : {context: RamenContext}) => [...context.histories, questionKey],
    }),
  }));

  return {
    [questionKey]: {
      actions: assign<RamenContext, RamenAssignEventMap[Key], undefined, RamenEvent, never>({
        [questionKey]: ({event}: {event: RamenAssignEvent}) => event.value,
      }),
    },
    next: [
      ...nextActions,
      // default
      {
        target: nextQuestionKey,
        actions: assign<RamenContext, {type: "next"}, undefined, RamenEvent, never>({
          histories: ({context} : {context: RamenContext}) => [...context.histories, questionKey],
        }),
      },
    ],
    back: hasBack ? {
      target: "history",
    } : undefined,
  };
}

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
      on: actionObj<"size">({
        questionKey: "size",
        nextQuestionKey: "garlic",
        nextConditions: [
          // mini ramen does not have garlic option
          {
            target: "vegetable",
            guard: ({context} : {context: RamenContext}) => context.size === "mini",
          },
        ],
        hasBack: false,
      }),
    },
    garlic: {
      on: actionObj<"garlic">({
        questionKey: "garlic",
        nextQuestionKey: "vegetable",
        nextConditions: [],
        hasBack: true,
      }),
    },
    vegetable: {
      on: actionObj<"vegetable">({
        questionKey: "vegetable",
        nextQuestionKey: "fat",
        nextConditions: [],
        hasBack: true,
      }),
    },
    fat: {
      on: actionObj<"fat">({
        questionKey: "fat",
        nextQuestionKey: "result",
        nextConditions: [],
        hasBack: true,
      }),
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
