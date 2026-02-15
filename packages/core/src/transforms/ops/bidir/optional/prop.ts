import { optional } from '.'
import { Nothing } from '../../../../tags/results'

export function prop<Key extends keyof O, O>(key: Key) {
	return optional<
		NonNullable<O[Key]>,
		O,
		(null | undefined) & O[Key] extends never ? never : Nothing
	>({
		get: (o) => {
			const res = o[key]
			if (res == undefined) return undefined
			return res as never
		},
		remove: (o) => {
			const res = { ...o }
			delete res[key]
			return res
		},
		set: (v, o) => ({ ...o, [key]: v }),
	})
}
