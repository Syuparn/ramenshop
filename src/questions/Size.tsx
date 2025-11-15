import { ramenMachine, type RamenContext } from "../state/machine";
import { Question } from "../template/Question"
import type { EventFrom, SnapshotFrom } from "xstate";

export const Size = ({state, send} : {
  state: SnapshotFrom<typeof ramenMachine>, send: (event: EventFrom<typeof ramenMachine>) => void
}) => {
  const selectionNames: {text: string, value: RamenContext["size"]}[] = [
    {text: "ミニ", value: "mini"},
    {text: "小", value: "small"},
    {text: "中", value: "medium"},
    {text: "大", value: "large"},
  ];

  const selections = selectionNames.map(s => (
    {
      key: s.text,
      onClick: () => {
        send({type: "size", value: s.value});
      },
      active: state.context.size === s.value,
    }
  ));

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
