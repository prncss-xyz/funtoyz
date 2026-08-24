import { fromInit } from '../../functions/arguments/init'
import { tag3 } from '../../tags/tag'
import {
	dispatchMachine,
	InferMachineEventIn,
	InferMachineEventOut,
} from '../dispatch'
import { directMachine } from './direct'
import { sliceMachine } from './sliceMachine'

describe('sliceMachine', () => {
	test('basic', () => {
		const sub1 = directMachine<{ p: number; q: boolean }>()(
			(count: number) => ({ count }),
			{
				inc: (e: number, { count }) => ({ count: count + e }),
			},
			({ count }) => count + 1,
		)
		const sub2 = directMachine<{ p: number | string; q: boolean }>()(
			(count: number) => ({ count }),
			{
				inc: (e: number, { count }) => ({ count: count + e }),
			},
			({ count }) => count + 1,
		)
		const machine = sliceMachine({
			a: sub1,
			b: sub2,
		})
		type EvIn = InferMachineEventIn<typeof machine>
		expectTypeOf<EvIn>().toEqualTypeOf<{
			a: {
				payload: number
				type: 'inc'
			}
			b: {
				payload: number
				type: 'inc'
			}
		}>()
		type EvOut = InferMachineEventOut<typeof machine>
		expectTypeOf<EvOut>().toEqualTypeOf<{
			p: number | string
			q: boolean
		}>()

		const s1 = fromInit(machine.init, { a: 1, b: 2 })
		expectTypeOf(s1).toEqualTypeOf<{
			a: { count: number }
			b: { count: number }
		}>()
		expect(s1).toEqual({ a: { count: 1 }, b: { count: 2 } })

		const s2 = dispatchMachine(machine, tag3('a', 'inc', 6), s1, vi.fn())
		expect(s2).toEqual({ a: { count: 7 }, b: { count: 2 } })
		expect(machine.result?.(s2)).toEqual({ a: 8, b: 3 })
	})
})
