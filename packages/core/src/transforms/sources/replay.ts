import { match } from '../../tags/match'
import { tag } from '../../tags/tag'
import { Tags } from '../../tags/types'
import { Emitter } from '../compose/_methods'

// cold observable
export function replay<T, S, E>(
	emitter: Emitter<T, S, E>,
): (s: S) => Emitter<T, void, E> {
	let id = 0
	const subs = new Map<
		number,
		{
			complete: () => void
			error: (e: E) => void
			next: (t: T) => void
		}
	>()
	return (s) => {
		let state: Tags<{ complete: void; error: E; next: T[] }> = tag(
			'next',
			[] as T[],
		)
		const { start } = emitter(
			s,
			(t) => {
				if (state.type === 'next') {
					state.payload.push(t)
					subs.forEach(({ next }) => next(t))
				}
			},
			(e) => {
				state = tag('error', e)
				subs.forEach(({ error }) => error(e))
			},
			() => {
				state = tag('complete')
				subs.forEach(({ complete }) => complete())
			},
		)
		start()
		return (_s, next, error, complete) => {
			const _id = id++
			return {
				abort: () => {
					subs.delete(_id)
				},
				start: () => {
					match(state, {
						complete: () => complete(),
						error,
						next: (buffer) => {
							buffer.forEach((t) => next(t))
							subs.set(_id, { complete, error, next })
						},
					})
				},
			}
		}
	}
}
