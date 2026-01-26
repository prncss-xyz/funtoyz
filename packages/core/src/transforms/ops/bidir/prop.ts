/* eslint-disable @typescript-eslint/no-empty-object-type */

import { nothing, Nothing } from '../../../tags/results'
import { compo_ } from '../../compose_'

type OptionalKeys<T> = {
	[K in keyof T]: object extends Pick<T, K> ? K : never
}[keyof T]

type OptionalValue<T> = (null | undefined) & T extends never ? never : Nothing

export function prop<Key extends keyof O, O>(key: Key) {
	return compo_<
		Exclude<O[Key], null | undefined>,
		O,
		OptionalValue<O[Key]>,
		never,
		{ optional: true },
		Key extends OptionalKeys<O> ? { removable: true } : {}
	>({
		getter: (o, succ, err) => {
			const res = o[key]
			if (res === undefined || res === null) return err(nothing() as any)
			return succ(res as Exclude<O[Key], null | undefined>)
		},
		remover: (o, succ) => {
			const res = { ...o }
			delete res[key]
			return succ(res)
		},
		setter: (v, succ, o) => succ({ ...o, [key]: v }),
	})
}
