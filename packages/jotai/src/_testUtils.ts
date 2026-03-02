import { atom } from 'jotai'

export const asyncAtomFactory = <State>(init: State) => {
	const baseAtom = atom(init)
	return atom(
		(get) => Promise.resolve(get(baseAtom)),
		(_get, set, value: State) => set(baseAtom, value),
	)
}
