import { directMachine } from './direct'

describe('directMachine', () => {
	const { init, send } = directMachine(
		{ a: 0 },
		{
			a: (_n: number, s) => s,
			b: (n: string) => ({
				a: n.length,
			}),
			c: () => ({ a: 4 }),
			d: { a: 5 },
		},
	)
	test('send', () => {
		expect(send({ payload: 1, type: 'a' }, init())).toEqual({ a: 0 })
		expect(send({ payload: 'b', type: 'b' }, init())).toEqual({ a: 1 })
		expect(send({ payload: undefined, type: 'c' }, init())).toEqual({ a: 4 })
		expect(send({ payload: undefined, type: 'd' }, init())).toEqual({ a: 5 })
	})
	test('send should be a passthrough for unexpected tags', () => {
		expect(send({ payload: undefined, type: 'Z' } as any, init())).toEqual({
			a: 0,
		})
	})
	test('extract', () => {
		const m = directMachine(
			(a: number) => ({ a }),
			{},
			{
				extract: ({ a }) => a.toString(),
			},
		)
		expect(m.extract(m.init(1))).toBe('1')
	})
})
