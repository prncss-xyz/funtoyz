import { toExhaustive } from '../../assertions'
import { tag } from '../../tags/tag'
import { modalMachine } from './modal'

type Events = {
	start: void
	stop: void
	tick: void
}

type States = {
	done: number
	idle: void
	running: number
}

describe('machines/factories/modal', () => {
	it('modalMachine works', () => {
		const machine = modalMachine()<Events, States>(tag('idle'), {
			done: {},
			idle: {
				start: () => tag('running', 0),
			},
			running: {
				stop: (_e) => tag('idle'),
				tick: (_e, s) => tag('running', s + 1),
			},
		})

		// Idle -> Start
		const s1 = machine.reduce(tag('start'), tag('idle'), toExhaustive)
		expect(s1).toEqual(tag('running', 0))

		// Running -> Tick
		const s2 = machine.reduce(tag('tick'), tag('running', 10), toExhaustive)
		expect(s2).toEqual(tag('running', 11))

		// Running -> Stop
		const s3 = machine.reduce(tag('stop'), tag('running', 20), toExhaustive)
		expect(s3).toEqual(tag('idle'))

		// No handler
		const s4 = machine.reduce(tag('tick'), tag('idle'), toExhaustive)
		expect(s4).toEqual(tag('idle'))
	})

	it('modalMachine result mapping', () => {
		const machine = modalMachine<never>()<
			{ done: number },
			{ done: number },
			void,
			number
		>(
			tag('done', 42),
			{ done: {} },
			{
				done: (s) => s * 2,
			},
		)
		expect(machine.result?.(tag('done', 10))).toBe(20)
	})
})
