import { prism } from '.'
import { flow } from '../../../../functions/flow'
import { failure, success } from '../../../../tags/results'
import { once } from '../../../sources/sync/once'

// TODO: will be less trivial with validation
export function prismFromGuard<T>(_cb: (u: unknown) => u is T) {
	return once<T>()
}

export const num = prismFromGuard((u) => typeof u === 'number')
export const str = prismFromGuard((u) => typeof u === 'string')
export const bool = prismFromGuard((u) => typeof u === 'boolean')
export function literal<const VS extends unknown[]>(...vs: VS) {
	function isLiteral(u: unknown): u is VS {
		return vs.some((v) => Object.is(u, v))
	}
	return prismFromGuard(isLiteral)
}

export const strToNum = flow(
	once<string>(),
	prism<number, string, 'NaN'>({
		get: (s) => {
			const num = Number(s)
			if (isNaN(num)) return failure.of('NaN')
			return success.of(num)
		},
		set: String,
	}),
)
