import { ramenMachine, type RamenContext } from "../state/machine";
import { Question } from "../template/Question"
import type { EventFrom, SnapshotFrom } from "xstate";

export const Fat = ({state, send} : {
  state: SnapshotFrom<typeof ramenMachine>, send: (event: EventFrom<typeof ramenMachine>) => void
}) => {
  const selectionNames: {text: string, value: RamenContext["fat"]}[] = [
    {text: "抜き", value: "no"},
    {text: "少なめ", value: "small"},
    {text: "ふつう", value: "medium"},
    {text: "マシ", value: "large"},
    {text: "マシマシ", value: "extralarge"},
  ];

  const selections = selectionNames.map(s => (
    {
      key: s.text,
      onClick: () => {
        send({type: "fat", value: s.value});
      },
      active: state.context.fat === s.value,
    }
  ));

  return (
    <Question
      title="アブラ"
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
