import { fromInit } from '../../functions/arguments/init'
import { id } from '../../functions/basics'
import { add } from '../../functions/elementary'
import { baseMachine } from './base'
import { productMachine } from './productMachine'

describe('productMachine', () => {
	test('basic', () => {
		const sub = baseMachine()(id<number>, add)
		const machine = productMachine<number>()({
			a: sub,
			b: sub,
		})
		const s1 = fromInit(machine.init, { a: 1, b: 2 })
		expectTypeOf(s1).toEqualTypeOf<{ a: number; b: number }>()
		expect(s1).toEqual({ a: 1, b: 2 })

		const s2 = machine.reduce(3, s1)
		expect(s2).toEqual({ a: 4, b: 5 })
	})
})
