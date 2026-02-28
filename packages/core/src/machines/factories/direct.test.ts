import { directMachine } from './direct'

describe('machines/factories/direct', () => {
	test('directMachine works', () => {
		const machine = directMachine()(
			{
				count: 0,
			},
			{
				finish: (e: any) => e,
				inc: (e: any, s: { count: number }) => ({ count: s.count + e.payload }),
			},
		)

		const instance = machine()
		expect(instance.init).toEqual({ count: 0 })

		const s1 = instance.reduce({ payload: 5, type: 'inc' }, { count: 1 })
		expect(s1).toEqual({ count: 6 })
	})
})
