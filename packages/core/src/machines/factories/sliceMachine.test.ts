import { fromInit } from '../../functions/arguments/init'
import { noop } from '../../functions/basics'
import { tag3 } from '../../tags/tag'
import { Tags } from '../../tags/types'
import { InferMachineEventIn, InferMachineEventOut } from '../core'
import { directMachine } from './direct'
import { sliceMachine } from './sliceMachine'

describe('sliceMachine', () => {
	test('basic', () => {
		const sub = directMachine<Tags<{ a: number; b: boolean }>>()(
			(count: number) => ({ count }),
			{
				inc: (e: number, { count }) => ({ count: count + e }),
			},
			({ count }) => count + 1,
		)
		const machine = sliceMachine({
			a: sub,
			b: sub,
		})
		type EvIn = InferMachineEventIn<typeof machine>
		expectTypeOf<EvIn>().toEqualTypeOf<
			| {
					payload: {
						payload: number
						type: 'inc'
					}
					type: 'a'
			  }
			| {
					payload: {
						payload: number
						type: 'inc'
					}
					type: 'b'
			  }
		>()
		type EvOut = InferMachineEventOut<typeof machine>
		expectTypeOf<EvOut>().toEqualTypeOf<
			| {
					payload: number
					type: 'a'
			  }
			| {
					payload: boolean
					type: 'b'
			  }
		>()

		const s1 = fromInit(machine.init, { a: 1, b: 2 })
		expectTypeOf(s1).toEqualTypeOf<{
			a: { count: number }
			b: { count: number }
		}>()
		expect(s1).toEqual({ a: { count: 1 }, b: { count: 2 } })

		const s2 = machine.reduce(tag3('a', 'inc', 6), s1, noop)
		expect(s2).toEqual({ a: { count: 7 }, b: { count: 2 } })
		expect(machine.result?.(s2)).toEqual({ a: 8, b: 3 })
	})
})
