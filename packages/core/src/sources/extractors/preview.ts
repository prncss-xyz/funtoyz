import type { Optic, Source } from '../core/types'

import { Result, toResult } from '../../tags/results'
import { _first, _get } from './observe'

export function preview<T, S, EG, EF, F, ES = never>(
	o: Optic<T, S, EG, EF, F>,
) {
	return function (s: S | Source<S, ES>): Result<T, EF | EG | ES> {
		let res: Result<T, EF | EG | ES>
		_preview(o, s, (t) => (res = t))
		return res!
	}
}

export function previewAsync<T, S, EG, EF, F, ES = never>(
	o: Optic<T, S, EG, EF, F>,
) {
	return function (s: S | Source<S, ES>): Promise<Result<T, EF | EG | ES>> {
		return new Promise((resolve) => {
			_preview(o, s, resolve)
		})
	}
}

export function _preview<T, S, EG, EF, ES, F>(
	o: Optic<T, S, EG, EF, F>,
	s: S | Source<S, ES>,
	resolve: (t: Result<T, EF | EG | ES>) => void,
) {
	const { error, next } = toResult<T, EF | EG | ES>(resolve)
	_get(o, s, next, error)
}
