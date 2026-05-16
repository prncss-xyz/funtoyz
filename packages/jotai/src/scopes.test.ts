import { atom, createStore } from "jotai";
import { describe, expect, it } from "vitest";
import { createJotaiScope } from "./scopes";
import { noop } from "@funtoyz/core";

describe("createJotaiScope", () => {
  const s = createJotaiScope<number>();
  const family = s((k) => atom(k));
  it("should create the same atom for the same key", () => {
    const atom1 = family(1);
    const atom2 = family(1);

    expect(atom1).toBe(atom2);
  });

  it("should create different atoms for different keys", () => {
    const atom1 = family(1);
    const atom2 = family(2);

    expect(atom1).not.toBe(atom2);
  });

  it("should create a different atom after mounting and unmounting", async () => {
    const store = createStore();
    const atom1 = family(1);
    const unmount = store.sub(atom1, noop);

    expect(atom1).toBe(family(1));

    unmount();
    await Promise.resolve();

    expect(atom1).not.toBe(family(1));
  });
});
