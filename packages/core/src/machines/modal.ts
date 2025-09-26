import { forbidden } from '../foundations/assertions'
import { fromInit, Init, toInit } from '../foundations/functions/init'
import { isFunction } from '../foundations/guards'
import {
	AnyTag,
	PAYLOAD,
	PayloadOf,
	Tag,
	tag,
	TagOf,
	Tags,
	TYPE,
	TypeIn,
} from '../foundations/tags/core'
import { AnyFunction, Prettify, ValueUnion } from '../foundations/types'
import { Final, Machine } from './core'

type States<Event extends AnyTag, State extends AnyTag, Context> = {
	[S in Exclude<TypeIn<State>, Final>]:
		| ((s: PayloadOf<State, S>, c: Context) => State)
		| {
				derive?: Init<any, [PayloadOf<State, S>]>
				events?: Partial<{
					[E in TypeIn<Event>]: Init<
						State,
						[PayloadOf<Event, E>, PayloadOf<State, S>, Context]
					>
				}>
				otherwise?: Init<State, [Event, PayloadOf<State, S>, Context]>
		  }
} & {
	final?: {
		derive?: Init<any, [PayloadOf<State, Final>]>
	}
}

type ExtractDerive<States extends object, State extends AnyTag> = ValueUnion<{
	[K in keyof States]: States[K] extends AnyFunction
		? never
		: States[K] extends { derive: Init<infer D, any> }
			? Tag<K, D>
			: TagOf<State, K>
}>

// Extract states that are not transient
type ExtractFree<States extends object, State extends AnyTag> =
	| TagOf<State, Final>
	| ValueUnion<{
			[S in Exclude<keyof States, Final>]: States[S] extends AnyFunction
				? never
				: TagOf<State, S>
	  }>
export function modalMachine<EventO extends object, StateO extends object>() {
	return function <
		const O extends States<Tags<EventO>, Tags<StateO>, Context>,
		Param = void,
		Context = void,
	>(
		init: Init<Prettify<ExtractFree<O, Tags<StateO>>>, [Param]>,
		states: O,
		_opts?: Partial<{
			context: (...args: any[]) => Context
		}>,
	): Machine<
		Tags<EventO>,
		ExtractFree<O, Tags<StateO>> & {},
		Context,
		Param,
		ExtractDerive<O, Tags<StateO>>
	> {
		function auto(s: any, c: any) {
			while (true) {
				const state = (states as any)[s[TYPE]]
				if (isFunction(state)) s = state(s[TYPE], c)
				else return s
			}
		}

		return {
			derive(s) {
				const state = (states as any)[s[TYPE]]
				/* c8 ignore next 1 */
				if (isFunction(state)) return forbidden()
				if (state.derive === undefined) return s as any
				return tag(s[TYPE] as any, fromInit(state.derive, s[PAYLOAD]))
			},
			init: toInit(init),
			send(e, s, c) {
				const state = (states as any)[s[TYPE]]
				const event = state.events[e[TYPE]]
				if (event) return auto(fromInit(event, e[PAYLOAD], s[PAYLOAD], c), c)
				if (state.otherwise)
					return auto(fromInit(state.otherwise, e, s[PAYLOAD], c), c)
				return s
			},
		}
	}
}
