import {
	disabledUpdate,
	Flags,
	Focus,
	fromFocus,
	HasFlag,
	NonFunction,
	Optic,
	update,
	Update,
	View,
	view,
} from '@funtoyz/core'
import { Atom, atom, WritableAtom } from 'jotai'

import { unwrap } from './_utils'

// TODO: do I need NonFunction

export function viewAtom<T, S, E extends G, G, F extends Flags>(
	baseAtom: Atom<Promise<S>>,
	focus: Focus<T, S, E, G, HasFlag<'READ', F>>,
): Atom<Promise<View<T, G>>>
export function viewAtom<T, S, E extends G, G, F extends Flags>(
	baseAtom: Atom<Promise<S>>,
	focus: Optic<T, S, E, G, HasFlag<'READ', F>>,
): Atom<Promise<View<T, G>>>

export function viewAtom<T, S, E extends G, G, F extends Flags>(
	baseAtom: Atom<S>,
	focus: Focus<T, S, E, G, HasFlag<'READ' | 'SYNC', F>>,
): Atom<View<T, G>>
export function viewAtom<T, S, E extends G, G, F extends Flags>(
	baseAtom: Atom<S>,
	focus: Optic<T, S, E, G, HasFlag<'READ' | 'SYNC', F>>,
): Atom<View<T, G>>

export function viewAtom<T, S, E extends G, G, F extends Flags>(
	baseAtom: Atom<S>,
	focus: Focus<T, S, E, G, HasFlag<'READ', F>>,
): Atom<Promise<View<T, G>>>
export function viewAtom<T, S, E extends G, G, F extends Flags>(
	baseAtom: Atom<S>,
	focus: Optic<T, S, E, G, HasFlag<'READ', F>>,
): Atom<Promise<View<T, G>>>

export function viewAtom<T, S, E extends G, G, F extends Flags, R>(
	baseAtom: Atom<S> | WritableAtom<S, [NonFunction<S>], R>,
	focus:
		| Focus<T, S, E, G, HasFlag<'READ', F>>
		| Optic<T, S, E, G, HasFlag<'READ', F>>,
) {
	const o = fromFocus(focus)
	const v = view(o)
	return atom((get) => unwrap(get(baseAtom), v))
}

// We restrict focusAtom to sync atoms

export function focusAtom<T, S, E extends G, G, F extends Flags, R>(
	baseAtom: WritableAtom<Promise<S>, [S], R>,
	focus: Focus<T, S, E, G, HasFlag<'READ' | 'SYNC' | 'WRITE', F>>,
): WritableAtom<Promise<View<T, G>>, [arg: Update<T, G>], R>
export function focusAtom<T, S, E extends G, G, F extends Flags, R>(
	baseAtom: WritableAtom<Promise<S>, [S], R>,
	focus: Optic<T, S, E, G, HasFlag<'READ' | 'SYNC' | 'WRITE', F>>,
): WritableAtom<Promise<View<T, G>>, [arg: Update<T, G>], R>
export function focusAtom<T, S, E extends G, G, F extends Flags, R>(
	baseAtom: WritableAtom<S, [NonFunction<S>], R>,
	focus: Focus<T, S, E, G, HasFlag<'READ' | 'SYNC' | 'WRITE', F>>,
): WritableAtom<View<T, G>, [arg: Update<T, G>], R>
export function focusAtom<T, S, E extends G, G, F extends Flags, R>(
	baseAtom: WritableAtom<S, [NonFunction<S>], R>,
	focus: Optic<T, S, E, G, HasFlag<'READ' | 'SYNC' | 'WRITE', F>>,
): WritableAtom<View<T, G>, [arg: Update<T, G>], R>

export function focusAtom<T, S, E extends G, G, F extends Flags, R>(
	baseAtom: WritableAtom<S, [NonFunction<S>], R>,
	focus:
		| Focus<T, S, E, G, HasFlag<'READ' | 'SYNC' | 'WRITE', F>>
		| Optic<T, S, E, G, HasFlag<'READ' | 'SYNC' | 'WRITE', F>>,
) {
	const o = fromFocus(focus)
	const v = view(o)
	const u = update(o)
	return atom(
		(get) => unwrap(get(baseAtom), v),
		(get, set, arg: Update<T, G>) =>
			set(baseAtom, unwrap(get(baseAtom), u(arg)) as NonFunction<S>),
	)
}

// We restrict disabledAtom to sync atoms

export function disabledAtom<T, S, E extends G, G, F extends Flags, R>(
	baseAtom: WritableAtom<Promise<S>, [NonFunction<S>], R>,
	focus: Focus<T, S, E, G, HasFlag<'READ' | 'SYNC' | 'WRITE', F>>,
	value: Update<T, G>,
): WritableAtom<Promise<boolean>, [], R>
export function disabledAtom<T, S, E extends G, G, F extends Flags, R>(
	baseAtom: WritableAtom<Promise<S>, [NonFunction<S>], R>,
	focus: Optic<T, S, E, G, HasFlag<'READ' | 'SYNC' | 'WRITE', F>>,
	value: Update<T, G>,
): WritableAtom<Promise<boolean>, [], R>
export function disabledAtom<T, S, E extends G, G, F extends Flags, R>(
	baseAtom: WritableAtom<S, [NonFunction<S>], R>,
	focus: Focus<T, S, E, G, HasFlag<'READ' | 'SYNC' | 'WRITE', F>>,
	value: Update<T, G>,
): WritableAtom<boolean, [], R>
export function disabledAtom<T, S, E extends G, G, F extends Flags, R>(
	baseAtom: WritableAtom<S, [NonFunction<S>], R>,
	focus: Optic<T, S, E, G, HasFlag<'READ' | 'SYNC' | 'WRITE', F>>,
	value: Update<T, G>,
): WritableAtom<boolean, [], R>

export function disabledAtom<T, S, E extends G, G, F extends Flags, R>(
	baseAtom: WritableAtom<Promise<S>, [NonFunction<S>], R>,
	focus: Focus<T, S, E, G, HasFlag<'SYNC' | 'WRITE', F>>,
	value: T,
): WritableAtom<Promise<boolean>, [], R>
export function disabledAtom<T, S, E extends G, G, F extends Flags, R>(
	baseAtom: WritableAtom<Promise<S>, [NonFunction<S>], R>,
	focus: Optic<T, S, E, G, HasFlag<'SYNC' | 'WRITE', F>>,
	value: T,
): WritableAtom<Promise<boolean>, [], R>
export function disabledAtom<T, S, E extends G, G, F extends Flags, R>(
	baseAtom: WritableAtom<S, [NonFunction<S>], R>,
	focus: Focus<T, S, E, G, HasFlag<'SYNC' | 'WRITE', F>>,
	value: T,
): WritableAtom<boolean, [], R>
export function disabledAtom<T, S, E extends G, G, F extends Flags, R>(
	baseAtom: WritableAtom<S, [NonFunction<S>], R>,
	focus: Optic<T, S, E, G, HasFlag<'SYNC' | 'WRITE', F>>,
	value: T,
): WritableAtom<boolean, [], R>

export function disabledAtom<T, S, E extends G, G, F extends Flags, R>(
	baseAtom: WritableAtom<S, [NonFunction<S>], R>,
	focus:
		| Focus<T, S, E, G, HasFlag<'SYNC' | 'WRITE', F>>
		| Optic<T, S, E, G, HasFlag<'SYNC' | 'WRITE', F>>,
	value: Update<T, G>,
) {
	const o = fromFocus(focus)
	const v = disabledUpdate(o)(value)
	const u = update(o)(value)
	return atom(
		(get) => unwrap(get(baseAtom), v),
		(get, set) => set(baseAtom, unwrap(get(baseAtom), u) as NonFunction<S>),
	)
}
