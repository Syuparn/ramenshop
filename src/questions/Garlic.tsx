import { ramenMachine, type RamenContext } from "../state/machine";
import { Question } from "../template/Question"
import type { EventFrom, SnapshotFrom } from "xstate";

export const Garlic = ({state, send} : {
  state: SnapshotFrom<typeof ramenMachine>, send: (event: EventFrom<typeof ramenMachine>) => void
}) => {
  const selectionNames: {text: string, value: RamenContext["garlic"]}[] = [
    {text: "抜き", value: "no"},
    {text: "少なめ", value: "small"},
    {text: "ふつう", value: "medium"},
    {text: "マシ", value: "large"},
  ];

  const selections = selectionNames.map(s => (
    {
      key: s.text,
      onClick: () => {
        send({type: "garlic", value: s.value});
      },
      active: state.context.garlic === s.value,
    }
  ));

  return (
    <Question
      title="ニンニク"
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
