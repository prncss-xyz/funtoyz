import { Tags } from './core'
import { Send, sender } from './sender'

describe('sender', () => {
	type T = Tags<{ a: void; b: undefined; c: string | undefined; d: string }>
	type S = Send<T>
	expectTypeOf<S>().toEqualTypeOf<'a' | 'b' | 'c' | T>()

	test('convert string', () => {
		expect(sender('a')).toEqual({ payload: undefined, type: 'a' })
	})
	test('keep object', () => {
		expect(sender({ payload: 3, type: 'a' })).toEqual({ payload: 3, type: 'a' })
	})
})
