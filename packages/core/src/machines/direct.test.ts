import { always } from '../foundations/functions/basics'
import { Tag, tag } from '../foundations/tags/core'
import { directMachine } from './direct'

describe('directMachine', () => {
	const { derive, init, send } = directMachine(
		{ a: 0 },
		{
			a: (_n: number, s) => s,
			b: (n: string) => ({
				a: n.length,
			}),
			c: () => ({ a: 4 }),
			d: { a: 5 },
		},
		{
			derive: ({ a }) => a * 2,
			isFinal: (s) => s.a > 5,
		},
	)

	describe('send', () => {
		test('basic', () => {
			expect(send(tag('a', 1), init())).toEqual({ a: 0 })
			expect(send(tag('b', 'b'), init())).toEqual({ a: 1 })
			expect(send(tag('c'), init())).toEqual({ a: 4 })
			expect(send(tag('d'), init())).toEqual({ a: 5 })
		})
		test('should be a passthrough for unexpected tags', () => {
			expect(send(tag('Z') as any, init())).toEqual({
				a: 0,
			})
		})
	})
	test('derive', () => {
		expect(derive({ a: 3 })).toEqual(tag('pending', 6))
		expect(derive({ a: 6 })).toEqual(tag('final', 12))
		expectTypeOf(derive({ a: 6 })).toEqualTypeOf<
			Tag<'final' | 'pending', number>
		>()
	})
	test('derive, default', () => {
		const m = directMachine((a: number) => ({ a }), {})
		expect(m.derive({ a: 1 })).toEqual(tag('pending', { a: 1 }))
		expectTypeOf(m.derive({ a: 6 })).toEqualTypeOf<
			Tag<'pending', { a: number }>
		>()
	})
	test('derive, always final', () => {
		const m = directMachine(
			(a: number) => ({ a }),
			{},
			{ isFinal: always(true) },
		)
		expectTypeOf(m.derive({ a: 6 })).toEqualTypeOf<
			Tag<'final', { a: number }>
		>()
	})
})
