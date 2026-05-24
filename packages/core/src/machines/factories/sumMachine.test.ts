import { fromInit } from '../../functions/arguments/init'
import { id } from '../../functions/basics'
import { tag } from '../../tags/tag'
import { Tags } from '../../tags/types'
import { directMachine } from './direct'
import { Sendable } from './sendable'
import { sumMachine } from './sumMachine'

type ChildEventOut = Tags<{
	exit: number
	forwarded: string
}>

describe('machines/factories/sumMachine', () => {
	it('switches between direct machines and can finish with exit', () => {
		const left = directMachine<ChildEventOut>()<
			{
				inc: number
				finish: void
			},
			number,
			number,
			string
		>(
			id<number>,
			{
				finish: (_event, state, send) => {
					send(tag('exit', state + 1))
					return state
				},
				inc: (amount, state, send) => {
					const next = state + amount
					send(tag('forwarded', `left:${next}`))
					return next
				},
			},
			(state) => `left:${state}`,
		)

		const right = directMachine<ChildEventOut>()<
			{
				inc: number
				finish: void
			},
			number,
			number,
			string
		>(
			(initial) => initial,
			{
				finish: (_event, state, send) => {
					send(tag('exit', state * 2))
					return state
				},
				inc: (amount, state, send) => {
					const next = state * amount
					send(tag('forwarded', `right:${next}`))
					return next
				},
			},
			(state) => `right:${state}`,
		)

		type EventIn = Sendable<
			Tags<{
				inc: number
				finish: void
			}>
		>

		const machine = sumMachine<EventIn, string>()(
			{ left, right },
			{
				left: (payload) => tag('right', payload),
				right: (payload) => tag('exit', `done:${payload}`),
			},
		)

		const s0 = fromInit(machine.init, tag('left', 2))
		expect(s0).toEqual(tag('left', 2))
		expect(machine.result?.(s0)).toEqual(tag('left', 'left:2'))

		const forwarded: unknown[] = []
		const s1 = machine.reduce(tag('inc', 3), s0, (event: unknown) => {
			forwarded.push(event)
		})
		expect(s1).toEqual(tag('left', 5))
		expect(forwarded).toEqual([tag('forwarded', 'left:5')])

		const s2 = machine.reduce(tag('finish'), s1, (event: unknown) => {
			forwarded.push(event)
		})
		expect(s2).toEqual(tag('right', 6))
		expect(machine.result?.(s2)).toEqual(tag('right', 'right:6'))
		expect(forwarded).toEqual([tag('forwarded', 'left:5')])

		const sent: unknown[] = []
		const s3 = machine.reduce(tag('finish'), s2, (event: unknown) => {
			sent.push(event)
		})
		expect(s3).toEqual(tag('right', 6))
		expect(sent).toEqual([tag('exit', 'done:12')])
	})
})
