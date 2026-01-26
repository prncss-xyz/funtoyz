import { fromInit, Init } from '../../../functions/arguments'
import { id, noop } from '../../../functions/basics'
import { nothing, Nothing } from '../../../tags/results'
import { _compo } from '../../compose'
import { Source } from '../../types'

export type Traversal<Acc, Value, Res> = {
	init: Init<Acc>
	reduce: (value: Value, acc: Acc) => Acc
	result?: (acc: Acc) => Res
	source: (r: Res) => Source<Value, never>
}

export function traversal<Acc, Value, Res>({
	init,
	reduce,
	result,
	source,
}: {
	init: Init<Acc>
	reduce: (value: Value, acc: Acc) => Acc
	result?: (acc: Acc) => Res
	source: (r: Res) => Source<Value, never>
}) {
	const modifier = (
		m: (t: Value, next: (t: Value) => void) => void,
		next: (s: Res) => void,
		s: Res,
	) => {
		let acc: Acc
		acc = fromInit(init)
		const { start, unmount } = source(s)(
			(value) =>
				m(value, (t) => {
					acc = reduce(t, acc)
				}),
			noop,
			() => {
				next(result ? result(acc) : (acc as any))
				unmount()
			},
		)
		start()
	}
	return _compo<
		Value,
		Res,
		Nothing,
		never,
		{
			prims: true
			traversable: true
		},
		{
			removable: true
		}
	>({
		emitter: <E>(s: Source<Res, E>) => {
			return (next, error, complete) => {
				let unmount = noop
				const su = s(
					(r) => {
						const ss = source(r)(next, error, noop)
						unmount = ss.unmount
						ss.start()
					},
					noop,
					complete,
				)
				return {
					start: su.start,
					unmount: () => {
						unmount()
						su.unmount()
					},
				}
			}
		},
		modifier,
		remover: (_s, next) => next((result ?? (id as any))(fromInit(init))),
		toEmpty: () => nothing(),
	})
}

export function inArray<Value>(): Traversal<Value[], Value, Value[]> {
	return {
		init: () => [],
		reduce: (t, acc) => [...acc, t],
		source: (acc) => (next, _error, complete) => {
			let done = false
			return {
				start: () => {
					for (const t of acc) {
						if (done) break
						next(t)
					}
					complete()
				},
				unmount: () => {
					done = true
				},
			}
		},
	}
}

export function elems<T>() {
	return traversal(inArray<T>())
}

export function inString(): Traversal<string, string, string> {
	return {
		init: '',
		reduce: (t, acc) => acc + t,
		source: (acc) => (next, _error, complete) => {
			let done = false
			return {
				start: () => {
					for (const t of acc) {
						if (done) break
						next(t)
					}
					complete()
				},
				unmount: () => {
					done = true
				},
			}
		},
	}
}

export function chars() {
	return traversal(inString())
}
