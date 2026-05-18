import { collection, OnMount } from './collection'

export function scope<Key>() {
	return collection((key: Key, onMount) => {
		const store = new Map<(key: Key, onMount: OnMount) => any, any>()
		return <Res>(fn: (key: Key, onMount: OnMount) => Res) => {
			if (!store.has(fn)) store.set(fn, fn(key, onMount))
			return store.get(fn) as Res
		}
	})
}
