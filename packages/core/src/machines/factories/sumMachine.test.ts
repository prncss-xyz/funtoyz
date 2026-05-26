import { id } from '../../functions/basics'
import { tag } from '../../tags/tag'
import { Tag, Tags } from '../../tags/types'
import { InferMachineEventIn, InferMachineEventOut } from '../core'
import { directMachine } from './direct'
import { Sendable } from './sendable'
import { sumMachine } from './sumMachine'

type ChildEventOut = Tags<{
	exit: number
	forwarded: string
}>

describe('machines/factories/sumMachine', () => {
	it('switches between direct machines and can finish with exit', () => {
		const m0 = directMachine<ChildEventOut>()(
			id<number>,
			{
				finish: (_: void, state, send) => {
					send(tag('exit', state + 1))
					return state
				},
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
				left: (payload) => tag('right', payload),
				right: (payload) => tag('exit', payload === 2),
			},
			{
				right: (result) => result.length,
			},
		)

		type EventIn = Sendable<
			Tags<{
				inc: number
				finish: void
			}>
		>
		expectTypeOf<InferMachineEventIn<typeof machine>>().toEqualTypeOf<EventIn>()
		expectTypeOf<InferMachineEventOut<typeof machine>>().toEqualTypeOf<
			| Tag<'exit', boolean>
			| {
					payload: string
					type: 'forwarded'
			  }
		>()
	})
})
