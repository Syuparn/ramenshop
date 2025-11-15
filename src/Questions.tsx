import type { EventFrom, SnapshotFrom } from "xstate";
import { Size } from "./questions/Size";
import { Vegetable } from "./questions/Vegetable";
import type { ramenMachine } from "./state/machine";

export const Questions = ({state, send} : {
  state: SnapshotFrom<typeof ramenMachine>, send: (event: EventFrom<typeof ramenMachine>) => void
}) => {
  return {
    size: <Size state={state} send={send} />,
    vegetable: <Vegetable state={state} send={send}/>,
    final: <></>,
  }[state.value];
};
