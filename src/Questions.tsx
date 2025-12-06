import type { EventFrom, SnapshotFrom } from "xstate";
import { Size } from "./questions/Size";
import { Vegetable } from "./questions/Vegetable";
import type { ramenMachine } from "./state/machine";
import { Result } from "./Result";
import { Garlic } from "./questions/Garlic";
import { Fat } from "./questions/Fat";

export const Questions = ({state, send} : {
  state: SnapshotFrom<typeof ramenMachine>, send: (event: EventFrom<typeof ramenMachine>) => void
}) => {
  return {
    size: <Size state={state} send={send} />,
    garlic: <Garlic state={state} send={send} />,
    vegetable: <Vegetable state={state} send={send}/>,
    fat: <Fat state={state} send={send}/>,
    result: <Result state={state} backOnClick={() => {send({type: "back"});}}/>,
    // never be rendered
    back: <></>,
    history: <></>,
  }[state.value];
};
