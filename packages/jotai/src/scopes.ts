import { noop, scope } from "@funtoyz/core";
import { atom } from "jotai";

type SetAtom<Args extends unknown[], Result> = <A extends Args>(
  ...args: A
) => Result;
type OnUnmount = () => void;
type OnMount<Args extends unknown[], Result> = <
  S extends SetAtom<Args, Result>,
>(
  setAtom: S,
) => OnUnmount | void;

export function createJotaiScope<K>() {
  const s = scope<K>();
  return function createAtomFamily<A extends { onMount?: OnMount<any, any> }>(
    fn: (k: K) => A,
  ) {
    return function atomFamily(k: K) {
      return s.get(k)((k, onMount) => {
        const a = fn(k);
        a.onMount = onMount;
        return a;
      });
    };
  };
}

const s = createJotaiScope<number>();
const t = s((k) => atom(k));
const u = s((k) => atom((get) => get(t(k)) + 2, noop))
