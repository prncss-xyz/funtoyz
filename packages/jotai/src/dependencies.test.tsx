import { pipe } from "@funtoyz/core";
import { render, renderHook } from "@testing-library/react";
import { atom, createStore, useAtomValue } from "jotai";
import { useHydrateAtoms } from "jotai/utils";

import { createContainerAtom } from "./dependencies";

const { dep, SUT, hydrateContainerAtom, services } = createContainerAtom<{
  a: number;
  b: string;
}>();

describe("createJotaiContainer", () => {
  test("hydrateContainer", () => {
    const store = createStore();
    const containerPair = hydrateContainerAtom(
      pipe(
        dep("a", () => atom(4)),
        dep("b", () => atom("toto")),
      ),
    );

    renderHook(() => useHydrateAtoms([containerPair], { store }));

    expect(store.get(services.a)).toBe(4);
    expect(store.get(services.b)).toBe("toto");
  });

  test("SUT hydrates the container and renders children, accepting partial implementation", () => {
    function Child() {
      const a = useAtomValue(services.a);
      return <div>{a}</div>;
    }

    const { getByText } = render(
      <SUT fn={dep("a", () => atom(4))}>
        <Child />
      </SUT>,
    );

    expect(getByText("4")).toBeTruthy();
  });
});
