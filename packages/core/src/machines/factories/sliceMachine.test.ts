import { fromInit } from '../../functions/arguments/init'
import { id } from '../../functions/basics'
import { tag3 } from '../../tags/tag'
import { directMachine } from './direct'
import { sliceMachine } from './sliceMachine'

describe('sliceMachine', () => {
	test('basic', () => {
		const sub = directMachine()(
			id<number>,
			{
				inc: (e: number, count) => count + e,
			},
			(r) => r + 1,
		)
		const machine = sliceMachine({
			a: sub,
			b: sub,
		})
		const s1 = fromInit(machine.init, { a: 1, b: 2 })
		expectTypeOf(s1).toEqualTypeOf<{ a: number; b: number }>()
		expect(s1).toEqual({ a: 1, b: 2 })

		const s2 = machine.reduce(tag3('a', 'inc', 6), s1)
		expect(s2).toEqual({ a: 7, b: 2 })
		expect(machine.result?.(s2)).toEqual({ a: 8, b: 3 })
	})
})
