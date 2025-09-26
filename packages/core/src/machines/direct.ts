import { fromInit, Init, toInit } from '../foundations/functions/init'
import { merge } from '../foundations/objects/merge'
import { AnyTag, PAYLOAD, tag, Tags, TYPE } from '../foundations/tags/core'

type ExtractEvent<O> = Tags<{
	[K in keyof O]: O[K] extends () => any
		? void
		: O[K] extends (p: infer P, ...args: any[]) => any
			? P
			: void
}>

export function directMachine<
	State extends object,
	Transitions extends Record<
		PropertyKey,
		((p: any, s: State, c: Context) => Partial<State>) | Partial<State>
	>,
	Param = void,
	Context = void,
	Derive extends Tags<{ final: any; pending: any }> = Tags<{
		final: never
		pending: State
	}>,
>(
	init: Init<State, [Param]>,
	transitions: Transitions,
	opts?: Partial<{
		context: (...args: any[]) => Context
		derive: (s: State, c: Context) => Derive
	}>,
) {
	function next(e: AnyTag, s: State, c: Context) {
		const f = transitions[e[TYPE]]
		// this is forbidden by the type system but will be needed for composition
		if (f === undefined) return s
		return fromInit(f, e[PAYLOAD], s, c)
	}
	return {
		derive: opts?.derive ?? ((s) => tag('pending', s)),
		init: toInit(init),
		makeSend: (c: Context) => (e: ExtractEvent<Transitions>, s: State) =>
			merge(s, next(e, s, c)),
	}
}
