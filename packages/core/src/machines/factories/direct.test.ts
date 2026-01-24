import { exit } from '../core'
import { directMachine } from './direct'

describe('machines/factories/direct', () => {
	test('directMachine works', () => {
		const machine = directMachine<never, number>()(
			{
				count: 0,
			},
			{
				finish: (_e: any, s: { count: number }) => exit(s.count),
				inc: (e: any, s: { count: number }) => ({ count: s.count + e.payload }),
			},
		)

		const instance = machine()
		expect(instance.init).toEqual({ count: 0 })

		const s1 = instance.reduce(
			{ payload: 5, type: 'inc' },
			{ count: 0 },
			() => {},
		)
		expect(s1).toEqual({ count: 5 })

		const s2 = instance.reduce({ type: 'finish' }, { count: 10 }, () => {})
		expect(s2).toEqual(exit(10))
	})
})
