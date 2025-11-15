import { ramenMachine } from "../state/machine";
import { Question } from "../template/Question"
import type { EventFrom, SnapshotFrom } from "xstate";

export const Size = ({state, send} : {
  state: SnapshotFrom<typeof ramenMachine>, send: (event: EventFrom<typeof ramenMachine>) => void
}) => {
  const selections = [
    {
      key: "ミニ",
      onClick: () => {
        send({type: "size", value: "mini"});
      },
      active: state.context.size === "mini",
    },
    {
      key: "小",
      onClick: () => {
        send({type: "size", value: "small"});
      },
      active: state.context.size === "small",
    },
  ];

  return (
    <Question
      title="麺の量"
      selections={selections}
      nextOnClick={() => {
        send({type: "next"});
      }}
      backOnClick={() => {
        send({type: "back"});
      }}
    />
  )
}
