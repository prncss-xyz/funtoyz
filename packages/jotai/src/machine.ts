import {
	baseMachine,
	directMachine,
	fromInit,
	Machine,
	modalMachine,
	spicedMachine,
} from '@funtoyz/core'
import { atom, Getter, Setter, WritableAtom } from 'jotai'

import { unwrap } from './_utils'

type CW = (cb: (get: Getter, set: Setter) => void) => void
type CR = Getter

export function createMachine<Prop, Value, State, Result, R = void>(
	machine: Machine<Prop, Value, State, Result, CW, CR>,
	prop: Prop,
	atomFactory: (init: State) => WritableAtom<Promise<State>, [State], R>,
): {
	disabled: (action: Value) => WritableAtom<Promise<boolean>, [], R>
	next: (action: Value) => WritableAtom<Promise<Result>, [], R>
	resultAtom: WritableAtom<Promise<Result>, [action: Value], R>
}
export function createMachine<Prop, Value, State, Result, R = void>(
	machine: Machine<Prop, Value, State, Result, CW, CR>,
	prop: Prop,
	atomFactory: (init: State) => WritableAtom<State, [State], R>,
): {
	disabled: (action: Value) => WritableAtom<Promise<boolean>, [], R>
	next: (action: Value) => WritableAtom<Result, [], R>
	resultAtom: WritableAtom<Promise<Result>, [action: Value], R>
}
export function createMachine<Value, State, Result, R = void>(
	machine: Machine<void, Value, State, Result, CW, CR>,
  prop?: void,
): {
	disabled: (action: Value) => WritableAtom<boolean, [], R>
	next: (action: Value) => WritableAtom<Result, [], R>
	resultAtom: WritableAtom<Result, [action: Value], R>
}
export function createMachine<Prop, Value, State, Result, R = void>(
	machine: Machine<Prop, Value, State, Result, CW, CR>,
	prop: Prop,
): {
	disabled: (action: Value) => WritableAtom<boolean, [], R>
	next: (action: Value) => WritableAtom<Result, [], R>
	resultAtom: WritableAtom<Result, [action: Value], R>
}

export function createMachine<Prop, Value, State, Result, R>(
	machine: Machine<Prop, Value, State, Result, CW, CR>,
	prop: Prop,
	atomFactory?: (
		init: State,
	) => WritableAtom<Promise<State> | State, [State], R>,
) {
	const baseAtom = (atomFactory ?? (atom as never))(
		fromInit(machine.init, prop),
	)
	const spiced = spicedMachine(machine)
	const setter = (get: Getter, set: Setter, action: Value) =>
		unwrap(
			get(baseAtom),
			spiced.send(
				action,
				(state) => set(baseAtom, state),
				(cb) => cb(get, set),
			),
		)
	return {
		disabled: (action: Value) =>
			atom(
				(get) => unwrap(get(baseAtom), spiced.disabled(action)),
				(get, set) => setter(get, set, action),
			),
		next: (action: Value) =>
			atom(
				(get) => unwrap(get(baseAtom), spiced.next(action, get)),
				(get, set) => setter(get, set, action),
			),
		resultAtom: atom(
			(get) => unwrap(get(baseAtom), spiced.result(get)),
			setter,
		),
	}
}

export const jotaiBaseMachine = baseMachine<CW, CR>()
export const jotaiDirectMachine = directMachine<CW, CR>()
export const jotaiModalMachine = modalMachine<CW, CR>()

// TODO: check how autocompletion fares in typical react setting
