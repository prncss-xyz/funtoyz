import { tag } from '../foundations/tags/core'
import { directMachine } from './direct'

describe('directMachine', () => {
	const { derive, init, makeSend } = directMachine(
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
			derive: (s) => (s.a > 5 ? tag('final', 'toto') : tag('pending', s)),
		},
	)

	const send = makeSend()
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
		expect(derive({ a: 3 })).toEqual(tag('pending', { a: 3 }))
	})

	test('derive, default', () => {
		const m = directMachine((a: number) => ({ a }), {})
		expect(m.derive({ a: 1 })).toEqual(tag('pending', { a: 1 }))
	})
})
