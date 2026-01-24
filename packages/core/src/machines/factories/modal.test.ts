import { tag } from '../../tags/tag'
import { Tags } from '../../tags/types'
import { exit } from '../core'
import { modalMachine } from './modal'

type Events = Tags<{
	start: void
	stop: void
	tick: void
}>

type States = Tags<{
	done: number
	idle: void
	running: number
}>

describe('machines/factories/modal', () => {
	it('modalMachine works', () => {
		const machine = modalMachine<never, number>()<Events, States>(tag('idle'), {
			done: {},
			idle: {
				start: () => tag('running', 0),
			},
			running: {
				stop: (_e, s) => exit(s),
				tick: (_e, s) => tag('running', s + 1),
			},
		})

		const instance = machine()

		// Idle -> Start
		const s1 = instance.reduce(tag('start'), tag('idle'), () => {})
		expect(s1).toEqual(tag('running', 0))

		// Running -> Tick
		const s2 = instance.reduce(tag('tick'), tag('running', 10), () => {})
		expect(s2).toEqual(tag('running', 11))

		// Running -> Stop
		const s3 = instance.reduce(tag('stop'), tag('running', 20), () => {})
		expect(s3).toEqual(exit(20))

		// No handler
		const s4 = instance.reduce(tag('tick'), tag('idle'), () => {})
		expect(s4).toEqual(tag('idle'))
	})

	it('modalMachine result mapping', () => {
		const machine = modalMachine<never, number>()<
			Tags<{ done: number }>,
			Tags<{ done: number }>,
			void,
			number
		>(
			tag('done', 42),
			{ done: {} },
			{
				done: (s) => s * 2,
			},
		)
		const instance = machine()
		expect(instance.result(tag('done', 10))).toBe(20)
	})
})
