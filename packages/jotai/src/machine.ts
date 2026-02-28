import {
	baseMachine,
	fromInit,
	Machine,
	modalMachine,
	spicedMachine,
} from '@funtoyz/core'
import { atom, Getter, Setter, WritableAtom } from 'jotai'

import { unwrap } from './_utils'

type CW = (cb: (get: Getter, set: Setter) => void) => void
type CR = Getter

export function machineAtom<Value, State = Value, Result = State, R = void>(
	machine: Machine<Value, State, Result, CW, CR>,
	atomFactory: (init: State) => WritableAtom<Promise<State>, [State], R>,
): {
	disabled: (action: Value) => WritableAtom<Promise<boolean>, [], R>
	next: (action: Value) => WritableAtom<Promise<Result>, [], R>
	result: WritableAtom<Promise<Result>, [action: Value], R>
}
export function machineAtom<Value, State = Value, Result = State, R = void>(
	machine: Machine<Value, State, Result, CW, CR>,
	atomFactory?: (init: State) => WritableAtom<State, [State], R>,
): {
	disabled: (action: Value) => WritableAtom<boolean, [], R>
	next: (action: Value) => WritableAtom<Result, [], R>
	result: WritableAtom<Result, [action: Value], R>
}
export function machineAtom<Value, State, Result, R>(
	machine: Machine<Value, State, Result, CW, CR>,
	atomFactory?: (
		init: State,
	) => WritableAtom<Promise<State> | State, [State], R>,
) {
	const baseAtom = (atomFactory ?? (atom as never))(fromInit(machine.init))
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
		result: atom((get) => unwrap(get(baseAtom), spiced.result(get)), setter),
	}
}

export const jotaiBaseMachine = baseMachine<CW, CR>()
export const jotaiModalMachine = modalMachine<CW, CR>()
