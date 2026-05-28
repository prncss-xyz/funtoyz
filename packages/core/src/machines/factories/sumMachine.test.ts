import { id } from '../../functions/basics'
import { tag } from '../../tags/tag'
import { Tag, Tags } from '../../tags/types'
import {
	InferMachineEventIn,
	InferMachineEventOut,
	InferMachineResult,
} from '../core'
import { directMachine } from './direct'
import { sumMachine } from './sumMachine'

describe('machines/factories/sumMachine', () => {
	it('switches between direct machines and can finish with exit', () => {
		type ChildEventOut = Tags<{
			exit: number
			forwarded: string
		}>
		const m0 = directMachine<ChildEventOut>()(
			id<number>,
			{
				finish: (_: void, state, send) => send(tag('exit', state + 1)),
				inc: (amount: number, state, send) => {
					const next = state + amount
					send(tag('forwarded', `left:${next}`))
					return next
				},
			},
			String,
		)

		const machine = sumMachine<boolean>()(
			{ left: m0, right: m0 },
			{
				exit: {
					left: (payload) => tag('right', payload),
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
		expectTypeOf<InferMachineEventIn<typeof machine>>().toEqualTypeOf<
			Tags<{ inc: number; finish: void }>
		>()
		expectTypeOf<InferMachineEventOut<typeof machine>>().toEqualTypeOf<
			| Tag<'exit', boolean>
			| {
					payload: string
					type: 'forwarded'
			  }
		>()
	})
})
