import { fromInit } from '../../functions/arguments/init'
import { tag } from '../../tags/tag'
import { Tags } from '../../tags/types'
import {
	dispatchMachine,
	InferMachineEventIn,
	InferMachineEventOut,
	InferMachineResult,
} from '../dispatch'
import { directMachine } from './direct'
import { sumMachine } from './sumMachine'

describe('machines/factories/sumMachine', () => {
	it('switches between direct machines and can finish with exit', () => {
		const m0 = directMachine<{
			exit: number
			forwarded: string
		}>()(
			(count: number) => ({ count }),
			{
				finish: (_: void, { count }, send) => send(tag('exit', count + 1)),
				inc: (amount: number, { count }, send) => {
					const next = count + amount
					send(tag('forwarded', `left:${next}`))
					return { count: next }
				},
			},
			String,
		)

		const machine = sumMachine<boolean>()(
			{ left: m0, right: m0 },
			{
				exit: {
					left: (count) => tag('right', count),
					right: (payload) => tag('exit', payload === 2),
				},
				result: {
					right: (result) => result.length,
				},
			},
		)

		type Res = InferMachineResult<typeof machine>
		expectTypeOf<Res>().toEqualTypeOf<
			Tags<{
				left: string
				right: number
			}>
		>()
		expectTypeOf<InferMachineEventIn<typeof machine>>().toEqualTypeOf<{
			inc: number
			finish: void
		}>()
		type EvOut = InferMachineEventOut<typeof machine>
		expectTypeOf<EvOut>().toEqualTypeOf<{ forwarded: string; exit: boolean }>()

		const sent: Tags<EvOut>[] = []
		const initial = fromInit(machine.init, tag('left', 0))
		const incremented = dispatchMachine(
			machine,
			tag('inc', 1),
			initial,
			(event) => sent.push(event),
		)
		expect(incremented).toEqual(tag('left', { count: 1 }))
		expect(sent).toEqual([tag('forwarded', 'left:1')])

		const switched = dispatchMachine(
			machine,
			tag('finish'),
			incremented,
			(event) => sent.push(event),
		)
		expect(switched).toEqual(tag('right', { count: 2 }))

		dispatchMachine(machine, tag('finish'), switched, (event) =>
			sent.push(event),
		)
		expect(sent.at(-1)).toEqual(tag('exit', false))
	})
})
