import { scope } from '@funtoyz/core'

export function createJotaiScope<K>() {
	const s = scope<K>()
	return <A extends { onMount?: (...args: any[]) => (() => void) | void }>(
		fn: (k: K) => A,
	) => {
		const cb = (k: K, onMount: () => void) => {
			const a = fn(k)
			a.onMount = onMount
			return a
		}
		return (k: K) => s.get(k)(cb)
	}
}
