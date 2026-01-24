import { exit } from '../core'
import { baseMachine } from './base'

describe('machines/factories/base', () => {
	it('baseMachine works', () => {
		const machine = baseMachine<number, number>()(
			0,
			(event: number, state: number) => {
				if (event === 0) return exit(state)
				return state + event
			},
			(state) => `Result: ${state}`,
		)

		const instance = machine()
		expect(instance.init).toBe(0)

		const s1 = instance.reduce(5, 0, () => {})
		expect(s1).toBe(5)

		const s2 = instance.reduce(0, 5, () => {})
		expect(s2).toEqual(exit(5))

		expect(instance.result!(10)).toBe('Result: 10')
	})
})
