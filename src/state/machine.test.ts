import { test, expect } from "vitest";
import {ramenMachine } from "./machine.js";
import { createActor } from "xstate";

test("size -> garlic", () => {
  const actor = createActor(ramenMachine)
  actor.start();
  actor.send({type: "size", value: "large"});
  actor.send({type: "next"});
  expect(actor.getSnapshot().value).toBe("garlic");
});

test("size -> vegetable if size is mini", () => {
  const actor = createActor(ramenMachine)
  actor.start();
  actor.send({type: "size", value: "mini"});
  actor.send({type: "next"});
  expect(actor.getSnapshot().value).toBe("vegetable");
});

test("back to the previous state", () => {
  const actor = createActor(ramenMachine)
  actor.start();
  actor.send({type: "size", value: "mini"});
  actor.send({type: "next"});
  actor.send({type: "back"});
  expect(actor.getSnapshot().value).toBe("size");
});
