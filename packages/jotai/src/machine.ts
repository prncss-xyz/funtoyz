import { forbidden, fromInit, Machine, spicedMachine } from '@funtoyz/core'
import { atom, Getter, Setter, WritableAtom } from 'jotai'

// TODO: async atomFactory
export function machineAtom<Value, State = Value, Result = State, R = void>(
	machine: Machine<Value, State, Result, never>,
	{
		atomFactory,
	}: {
		atomFactory?: (init: State) => WritableAtom<State, [State], R>
	},
): {
	disabled: (action: Value) => WritableAtom<boolean, [], R>
	next: (action: Value) => WritableAtom<Result, [], R>
	result: WritableAtom<Result, [action: Value], R>
}
export function machineAtom<
	Value,
	EventOut,
	State = Value,
	Result = State,
	R = void,
>(
	machine: Machine<Value, State, Result, EventOut>,
	{
		atomFactory,
		impl,
	}: {
		atomFactory?: (init: State) => WritableAtom<State, [State], R>
		impl: (e: EventOut) => void
	},
): {
	disabled: (action: Value) => WritableAtom<boolean, [], R>
	next: (action: Value) => WritableAtom<Result, [], R>
	result: WritableAtom<Result, [action: Value], R>
}
export function machineAtom<Value, State, Result, EventOut, R>(
	machine: Machine<Value, State, Result, EventOut>,
	{
		atomFactory,
		impl,
	}: {
		atomFactory?: (init: State) => WritableAtom<State, [State], R>
		impl?: (e: EventOut) => void
	},
) {
	const baseAtom = (atomFactory ?? (atom as never))(fromInit(machine.init))
	const spiced = spicedMachine(machine, impl ?? (forbidden as never))
	const setter = (get: Getter, set: Setter, action: Value) =>
		set(baseAtom, spiced.send(action)(get(baseAtom)))
	return {
		disabled: (action: Value) =>
			atom(
				(get) => spiced.disabled(action)(get(baseAtom)),
				(get, set) => setter(get, set, action),
			),
		next: (action: Value) =>
			atom(
				(get) => spiced.next(action)(get(baseAtom)),
				(get, set) => setter(get, set, action),
			),
		result: atom((get) => spiced.result(get(baseAtom)), setter),
	}
}
