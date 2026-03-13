import { fromInit } from '../../functions/arguments/init'
import { id } from '../../functions/basics'
import { tag } from '../../tags/tag'
import { directMachine } from './direct'
import { productMachine } from './productMachine'

describe('productMachine', () => {
	test('basic', () => {
		const sub = directMachine()(
			id<number>,
			{
				inc: (e: number, count) => count + e,
			},
			(r) => r + 1,
		)
		const machine = productMachine({
			a: sub,
			b: sub,
		})
		const s1 = fromInit(machine.init, { a: 1, b: 2 })
		expectTypeOf(s1).toEqualTypeOf<{ a: number; b: number }>()
		expect(s1).toEqual({ a: 1, b: 2 })
		const s2 = machine.reduce(tag('a', 'inc', 5), s1)
		expect(s2).toEqual({ a: 6, b: 2 })
		expect(machine.result?.(s2)).toEqual({ a: 7, b: 3 })
	})
})
