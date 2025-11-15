import type { SnapshotFrom } from "xstate";
import type { ramenMachine } from "./state/machine";
import { Text } from "@chakra-ui/react";

export const Result = ({state} : {
  state: SnapshotFrom<typeof ramenMachine>,
}) => {
  // NOTE: null must not be assigned
  const size = {mini: "ミニ", small: "小", medium: "中", large: "大"}[state.context.size ?? "small"];
  const garlic = {no: "ニンニク抜き", small: "ニンニク少なめ", medium: "", large: "ニンニクマシ"}[state.context.garlic];
  const vegetable = {no: "ヤサイ無し", small: "ヤサイ少なめ", medium: "", large: "ヤサイマシ"}[state.context.vegetable];
  const fat = {no: "アブラ抜き", small: "アブラ少なめ", medium: "", large: "アブラマシ", extralarge: "アブラマシマシ"}[state.context.fat];

  return (
    <Text>
      ラーメン{size}{garlic}{vegetable}{fat}
    </Text>
  )
};
