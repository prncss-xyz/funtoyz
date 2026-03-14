import { Tags } from '../../tags/types'
import { fromSendable, Sendable } from './sendable'

type T = Tags<{ start: void; tick: number }>

describe('sendable', () => {
	test('fromSendable returns existing tag object', () => {
		const existing: T = { payload: 1, type: 'tick' }
		expect(fromSendable<T>(existing)).toEqual(existing)
	})

	test('fromSendable converts void payload types', () => {
		expect(fromSendable<T>('start')).toEqual({
			payload: undefined,
			type: 'start',
		})
	})

	expectTypeOf<Sendable<T>>().toEqualTypeOf<'start' | T>()
})
