import type { Optic, Source } from '../types'

import { exhaustive } from '../../assertions'
import { _first, _get, _observe } from './observe'

export function view<T, S, F>(o: Optic<T, S, never, never, F>) {
	return function (s: S | Source<S, never>): T {
		let res: T
		_get(o, s, (t) => (res = t), exhaustive)
		return res!
	}
}

export function viewAsync<T, S, F>(o: Optic<T, S, never, never, F>) {
	return function (s: S | Source<S, never>) {
		return new Promise<T>((resolve) => {
			_get(o, s, resolve, exhaustive)
		})
	}
}
