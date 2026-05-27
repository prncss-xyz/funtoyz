import { fromInit, Machine, spicedMachine } from '@funtoyz/core'
import { atom, Getter, Setter, WritableAtom } from 'jotai'

import { unwrap } from './_utils'
export function createMachine<Prop, Value, State, Result, Ef, R = void>(
	machine: Machine<Prop, Value, State, Result, Ef>,
	props: {
		atomFactory: (init: State) => WritableAtom<Promise<State>, [State], R>
		effects?: (ef: Ef, get: Getter, set: Setter) => void
		prop: Prop
	},
): {
	disabled: (action: Value) => WritableAtom<Promise<boolean>, [], R>
	next: (action: Value) => WritableAtom<Promise<Result>, [], R>
	resultAtom: WritableAtom<Promise<Result>, [action: Value], R>
}
export function createMachine<Prop, Value, State, Result, Ef, R = void>(
	machine: Machine<Prop, Value, State, Result, Ef>,
	props: {
		atomFactory: (init: State) => WritableAtom<State, [State], R>
		effects?: (ef: Ef, get: Getter, set: Setter) => void
		prop: Prop
	},
): {
	disabled: (action: Value) => WritableAtom<Promise<boolean>, [], R>
	next: (action: Value) => WritableAtom<Result, [], R>
	resultAtom: WritableAtom<Promise<Result>, [action: Value], R>
}
export function createMachine<Value, State, Result, Ef, R = void>(
	machine: Machine<void, Value, State, Result, Ef>,
	props?: {
		atomFactory: (init: State) => WritableAtom<Promise<State>, [State], R>
		effects?: (ef: Ef, get: Getter, set: Setter) => void
		prop?: void
	},
): {
	disabled: (action: Value) => WritableAtom<Promise<boolean>, [], R>
	next: (action: Value) => WritableAtom<Promise<Result>, [], R>
	resultAtom: WritableAtom<Promise<Result>, [action: Value], R>
}
export function createMachine<Value, State, Result, Ef, R = void>(
	machine: Machine<void, Value, State, Result, Ef>,
	props?: {
		atomFactory: (init: State) => WritableAtom<State, [State], R>
		effects?: (ef: Ef, get: Getter, set: Setter) => void
		prop?: void
	},
): {
	disabled: (action: Value) => WritableAtom<Promise<boolean>, [], R>
	next: (action: Value) => WritableAtom<Result, [], R>
	resultAtom: WritableAtom<Promise<Result>, [action: Value], R>
}
export function createMachine<Value, State, Result, Ef, R = void>(
	machine: Machine<void, Value, State, Result, Ef>,
	props?: {
		effects?: (ef: Ef, get: Getter, set: Setter) => void
		prop?: void
	},
): {
	disabled: (action: Value) => WritableAtom<boolean, [], R>
	next: (action: Value) => WritableAtom<Result, [], R>
	resultAtom: WritableAtom<Result, [action: Value], R>
}
export function createMachine<Prop, Value, State, Result, Ef, R = void>(
	machine: Machine<Prop, Value, State, Result, Ef>,
	props: {
		effects?: (ef: Ef, get: Getter, set: Setter) => void
		prop: Prop
	},
): {
	disabled: (action: Value) => WritableAtom<boolean, [], R>
	next: (action: Value) => WritableAtom<Result, [], R>
	resultAtom: WritableAtom<Result, [action: Value], R>
}

export function createMachine<Prop, Value, State, Result, Ef, R>(
	machine: Machine<Prop, Value, State, Result, Ef>,
	props?: {
		atomFactory?: (
			init: State,
		) => WritableAtom<Promise<State> | State, [State], R>
		effects?: (ef: Ef, get: Getter, set: Setter) => void
		prop?: Prop
	},
) {
	const baseAtom = (props?.atomFactory ?? (atom as never))(
		fromInit(machine.init, props!.prop!),
	)
	const spiced = spicedMachine(machine)
	const setter = (get: Getter, set: Setter, action: Value) =>
		unwrap(
			get(baseAtom),
			spiced.send(
				action,
				(state) => set(baseAtom, state),
				(ef) => (props?.effects ? props.effects(ef, get, set) : noEffects(ef)),
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
				(get) => unwrap(get(baseAtom), spiced.next(action)),
				(get, set) => setter(get, set, action),
			),
		resultAtom: atom((get) => unwrap(get(baseAtom), spiced.result()), setter),
	}
}

function noEffects(e: unknown): never {
	throw new Error(`Effects are not supported in this machine (${e})`)
}
