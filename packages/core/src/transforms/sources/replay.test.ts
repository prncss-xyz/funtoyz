import { Emitter } from '../compose/_methods'
import { replay } from './replay'

function manual<T, E = never>() {
	let next!: (t: T) => void
	let error!: (e: E) => void
	let complete!: () => void
	const emitter: Emitter<T, void, E> = (_s, n, e, c) => ({
		abort: () => {},
		start: () => {
			next = n
			error = e
			complete = c
		},
	})
	return {
		complete: () => complete(),
		emitter,
		error: (e: E) => error(e),
		next: (t: T) => next(t),
	}
}

describe('replay', () => {
	test('replays buffered values to late subscriber', () => {
		const m = manual<number>()
		const source = replay(m.emitter)(undefined)

		m.next(1)
		m.next(2)

		const received: number[] = []
		source(
			undefined,
			(t) => received.push(t),
			() => {},
			() => {},
		).start()

		expect(received).toEqual([1, 2])
	})

	test('forwards live values after replay', () => {
		const m = manual<number>()
		const source = replay(m.emitter)(undefined)

		m.next(1)

		const received: number[] = []
		source(
			undefined,
			(t) => received.push(t),
			() => {},
			() => {},
		).start()

		m.next(2)
		m.next(3)

		expect(received).toEqual([1, 2, 3])
	})

	test('forwards complete to subscribers', () => {
		const m = manual<number>()
		const source = replay(m.emitter)(undefined)

		let completed = false
		source(
			undefined,
			() => {},
			() => {},
			() => {
				completed = true
			},
		).start()

		m.complete()

		expect(completed).toBe(true)
	})

	test('forwards error to subscribers', () => {
		const m = manual<number, string>()
		const source = replay(m.emitter)(undefined)

		let receivedError: string | undefined
		source(
			undefined,
			() => {},
			(e) => {
				receivedError = e
			},
			() => {},
		).start()

		m.error('fail')

		expect(receivedError).toBe('fail')
	})

	test('multiple subscribers get independent replays', () => {
		const m = manual<number>()
		const source = replay(m.emitter)(undefined)

		m.next(1)

		const received1: number[] = []
		const received2: number[] = []

		source(
			undefined,
			(t) => received1.push(t),
			() => {},
			() => {},
		).start()
		m.next(2)
		source(
			undefined,
			(t) => received2.push(t),
			() => {},
			() => {},
		).start()
		m.next(3)

		expect(received1).toEqual([1, 2, 3])
		expect(received2).toEqual([1, 2, 3])
	})

	test('subscriber after complete gets only complete', () => {
		const m = manual<number>()
		const source = replay(m.emitter)(undefined)

		m.next(1)
		m.complete()

		const received: number[] = []
		let completed = false
		source(
			undefined,
			(t) => received.push(t),
			() => {},
			() => {
				completed = true
			},
		).start()

		expect(received).toEqual([])
		expect(completed).toBe(true)
	})

	test('subscriber after error gets error', () => {
		const m = manual<number, string>()
		const source = replay(m.emitter)(undefined)

		m.error('fail')

		let receivedError: string | undefined
		source(
			undefined,
			() => {},
			(e) => {
				receivedError = e
			},
			() => {},
		).start()

		expect(receivedError).toBe('fail')
	})

	test('abort removes subscriber from live updates', () => {
		const m = manual<number>()
		const source = replay(m.emitter)(undefined)

		const received: number[] = []
		const { abort, start } = source(
			undefined,
			(t) => received.push(t),
			() => {},
			() => {},
		)
		start()

		m.next(1)
		abort()
		m.next(2)

		expect(received).toEqual([1])
	})

	test('passes source value to inner emitter', () => {
		let receivedSource: number[] | undefined
		const emitter: Emitter<number, number[], never> = (
			s,
			next,
			_error,
			complete,
		) => ({
			abort: () => {},
			start: () => {
				receivedSource = s
				s.forEach(next)
				complete()
			},
		})

		replay(emitter)([10, 20, 30])

		expect(receivedSource).toEqual([10, 20, 30])
	})
})
