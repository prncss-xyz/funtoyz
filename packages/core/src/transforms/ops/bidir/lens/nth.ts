import { lens } from '.'
import { replace } from '../../../../arrays'

export function nth<Index extends keyof O & number, O extends unknown[]>(
	index: Index,
) {
	return lens<O[Index], O>({
		get: (o) => o[index],
		set: (v, o) => replace(v, index)(o) as O,
	})
}
