import { tag } from '../../tags/tag'
import { Tags } from '../../tags/types'
import {
	InferMachineEventIn,
	InferMachineEventOut,
	InferMachineResult,
} from '../core'
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
					left: (count) => tag('right', { count }),
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
	})
})
