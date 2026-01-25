import { isFunction } from '../../guards'
import { getEmitter } from '../compose'
import { once } from '../sources/pull/once'
import { Optic, Source } from '../types'

export function collect<Value, S, EG, EF, F>(o: Optic<Value, S, EG, EF, F>) {
	return function (s: S | Source<S, never>) {
		let res: Value[]
		_collect(o, (r) => (res = r), s)
		return res!
	}
}

export function collectAsync<Value, S, EG, EF, F>(
	o: Optic<Value, S, EG, EF, F>,
) {
	return function (s: S | Source<S, never>) {
		return new Promise<Value[]>((resolve) => {
			_collect(o, resolve, s)
		})
	}
}

export function _collect<Value, S, EG, EF, F>(
	o: Optic<Value, S, EG, EF, F>,
	resolve: (values: Value[]) => void,
	s: S | Source<S, never>,
) {
	let acc: Value[] = []
	const { start, unmount } = getEmitter(o)(isFunction(s) ? s : once(s))(
		(value) => (acc.push(value), value),
		() => {
			unmount()
			throw new Error('unexpected error')
		},
		() => (unmount(), resolve(acc)),
	)
	start()
}
