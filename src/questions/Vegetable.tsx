import { ramenMachine, type RamenContext } from "../state/machine";
import { Question } from "../template/Question"
import type { EventFrom, SnapshotFrom } from "xstate";

export const Vegetable = ({state, send} : {
  state: SnapshotFrom<typeof ramenMachine>, send: (event: EventFrom<typeof ramenMachine>) => void
}) => {
  const selectionNames: {text: string, value: RamenContext["vegetable"]}[] = [
    {text: "なし", value: "no"},
    {text: "少なめ", value: "small"},
    {text: "ふつう", value: "medium"},
    {text: "マシ", value: "large"},
  ];

  const selections = selectionNames.map(s => (
    {
      key: s.text,
      onClick: () => {
        send({type: "vegetable", value: s.value});
      },
      active: state.context.vegetable === s.value,
    }
  ));

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
