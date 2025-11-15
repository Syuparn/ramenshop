import { ramenMachine } from "../state/machine";
import { Question } from "../template/Question"
import type { EventFrom, SnapshotFrom } from "xstate";

export const Vegetable = ({state, send} : {
  state: SnapshotFrom<typeof ramenMachine>, send: (event: EventFrom<typeof ramenMachine>) => void
}) => {
  const selections = [
    {
      key: "なし",
      onClick: () => {
        send({type: "vegetable", value: "no"});
      },
      active: state.context.vegetable === "no",
    },
    {
      key: "ふつう",
      onClick: () => {
        send({type: "vegetable", value: "medium"});
      },
      active: state.context.vegetable === "medium",
    },
  ];

  return (
    <Question
      title="ヤサイ"
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
