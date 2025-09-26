import { always, id } from '../foundations/functions/basics'
import { fromInit, Init, toInit } from '../foundations/functions/init'
import { merge } from '../foundations/objects/merge'
import { AnyTag, PAYLOAD, Tag, tag, Tags, TYPE } from '../foundations/tags/core'
import { Prettify } from '../foundations/types'
import { Final, Machine } from './core'

type T<IsFinal> =
	| (IsFinal extends false ? 'pending' : never)
	| (IsFinal extends true ? Final : never)
type Derived<IsFinal, Derive> = Tag<T<IsFinal>, Derive>

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
	Derive = State,
	IsFinal extends boolean = false,
>(
	init: Init<State, [Param]>,
	transitions: Transitions,
	opts?: Partial<{
		context(...args: any[]): Context
		derive(s: State): Derive
		isFinal(s: State): IsFinal
	}>,
): Machine<
	ExtractEvent<Transitions>,
	State,
	Context,
	Param,
	Prettify<Derived<IsFinal, Derive>>
> {
	function next(e: AnyTag, s: State, c: Context) {
		const f = transitions[e[TYPE]]
		// this is forbidden by the type system but will be needed for composition
		if (f === undefined) return s
		return fromInit(f, e[PAYLOAD], s, c)
	}
	const derive = opts?.derive ?? id
	const isFinal = opts?.isFinal ?? always(false)
	return {
		derive: (s: State) =>
			tag(isFinal(s) ? 'final' : 'pending', derive(s)) as any,
		init: toInit(init),
		send: (e: ExtractEvent<Transitions>, s: State, c: Context) =>
			merge(s, next(e, s, c)),
	}
}
