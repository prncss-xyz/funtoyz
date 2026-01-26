import { fromInit } from '../../../functions/arguments'
import { Exit, Machine } from '../../../machines/core'
import { Nothing, nothing } from '../../../tags/results'
import { sequence } from './sequence'

export function transduce<
	EventIn,
	State,
	Result,
	EventOut,
	Final,
	Finish extends boolean,
>({
	finish,
	init,
	reduce,
}: Machine<EventIn, State, Result, EventOut, Final, Finish>) {
	return sequence<EventOut, EventIn, Finish extends true ? Nothing : never>(
		(source) => {
			let state = fromInit(init)
			let calls: EventOut[] = []
			const send_ = (event: EventOut) => calls.push(event)
			return (n, e, c) => {
				const { start, unmount } = source(
					(v) => {
						const res = reduce(v, state, send_)
						if (!(res instanceof Exit)) state = res
						if (calls.length) {
							calls.forEach(n)
							calls = []
						}
						if (res instanceof Exit) c()
					},
					e,
					() => {
						if (finish) return e(nothing() as never)
						c()
					},
				)
				return {
					start,
					unmount,
				}
			}
		},
	)
}
