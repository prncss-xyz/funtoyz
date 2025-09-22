import { id } from '../foundations/functions/basics'
import { fromInit, Init, toInit } from '../foundations/functions/init'
import { merge } from '../foundations/objects'
import { AnyTag, Tags } from '../foundations/tags/core'
import { nothing, Nothing, Result } from '../foundations/tags/results'

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
	Extract = State,
	Success = never,
>(
	init: Init<State, [Param]>,
	transitions: Transitions,
	opts?: Partial<{
		context: (...args: any[]) => Context
		extract: (s: State, c: Context) => Extract
		result: (s: State, c: Context) => Result<Success, Nothing>
	}>,
) {
	function next(e: AnyTag, s: State, c: Context) {
		const f = transitions[e.type]
		// this is forbidden by the type system but will be needed for composition
		if (f === undefined) return s
		return fromInit(f, e.payload, s, c)
	}
	return {
		extract: opts?.extract ?? (id as never),
		init: toInit(init),
		result: opts?.result ?? (nothing.of as never),
		send(e: ExtractEvent<Transitions>, s: State, c: Context) {
			return merge(s, next(e, s, c))
		},
	}
}
