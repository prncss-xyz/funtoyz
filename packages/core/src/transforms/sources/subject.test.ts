import { Emitter } from '../compose/_methods'
import { subject } from './subject'

function manual<T, E = never>() {
	let next!: (t: T) => void
	let error!: (e: E) => void
	let complete!: () => void
	let aborted = false
	const emitter: Emitter<T, void, E> = (_s, n, e, c) => ({
		abort: () => {
			aborted = true
		},
		start: () => {
			next = n
			error = e
			complete = c
		},
	})
	return {
		get aborted() {
			return aborted
		},
		complete: () => complete(),
		emitter,
		error: (e: E) => error(e),
		next: (t: T) => next(t),
	}
}

describe('subject', () => {
	test('does not start source until first subscriber', () => {
		let started = false
		const emitter: Emitter<number, void, never> = (_s, _n, _e, _c) => ({
			abort: () => {},
			start: () => {
				started = true
			},
		})

		const source = subject(emitter)(undefined)
		expect(started).toBe(false)

		source(
			undefined,
			() => {},
			() => {},
			() => {},
		).start()
		expect(started).toBe(true)
	})

	test('forwards values to subscriber', () => {
		const m = manual<number>()
		const source = subject(m.emitter)(undefined)

		const received: number[] = []
		source(
			undefined,
			(t) => received.push(t),
			() => {},
			() => {},
		).start()

		m.next(1)
		m.next(2)

		expect(received).toEqual([1, 2])
	})

	test('does not replay past values to late subscriber', () => {
		const m = manual<number>()
		const source = subject(m.emitter)(undefined)

		const received1: number[] = []
		source(
			undefined,
			(t) => received1.push(t),
			() => {},
			() => {},
		).start()

		m.next(1)

		const received2: number[] = []
		source(
			undefined,
			(t) => received2.push(t),
			() => {},
			() => {},
		).start()

		m.next(2)

		expect(received1).toEqual([1, 2])
		expect(received2).toEqual([2])
	})

	test('forwards complete to subscribers', () => {
		const m = manual<number>()
		const source = subject(m.emitter)(undefined)

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
		const source = subject(m.emitter)(undefined)

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

	test('abort removes subscriber from live updates', () => {
		const m = manual<number>()
		const source = subject(m.emitter)(undefined)

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

	test('aborts source when last subscriber aborts', async () => {
		const m = manual<number>()
		const source = subject(m.emitter)(undefined)

		const sub1 = source(
			undefined,
			() => {},
			() => {},
			() => {},
		)
		const sub2 = source(
			undefined,
			() => {},
			() => {},
			() => {},
		)
		sub1.start()
		sub2.start()

		sub1.abort()
		expect(m.aborted).toBe(false)

		sub2.abort()
		expect(m.aborted).toBe(false)

		await new Promise((r) => setTimeout(r, 0))
		expect(m.aborted).toBe(true)
	})

	test('does not abort source if new subscriber joins before timeout', async () => {
		const m = manual<number>()
		const source = subject(m.emitter)(undefined)

		const sub1 = source(
			undefined,
			() => {},
			() => {},
			() => {},
		)
		sub1.start()
		sub1.abort()

		const sub2 = source(
			undefined,
			() => {},
			() => {},
			() => {},
		)
		sub2.start()

		await new Promise((r) => setTimeout(r, 0))
		expect(m.aborted).toBe(false)
	})

	test('does not start source again for second subscriber', () => {
		let startCount = 0
		const emitter: Emitter<number, void, never> = (_s, _n, _e, _c) => ({
			abort: () => {},
			start: () => {
				startCount++
			},
		})

		const source = subject(emitter)(undefined)

		source(
			undefined,
			() => {},
			() => {},
			() => {},
		).start()
		source(
			undefined,
			() => {},
			() => {},
			() => {},
		).start()

		expect(startCount).toBe(1)
	})

	test('passes source value to inner emitter', () => {
		let receivedSource: number[] | undefined
		const emitter: Emitter<number, number[], never> = (
			s,
			_next,
			_error,
			_complete,
		) => {
			receivedSource = s
			return {
				abort: () => {},
				start: () => {},
			}
		}

		subject(emitter)([10, 20, 30])

		expect(receivedSource).toEqual([10, 20, 30])
	})
})
