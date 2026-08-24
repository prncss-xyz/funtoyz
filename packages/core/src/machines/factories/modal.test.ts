import { tag } from '../../tags/tag'
import { dispatchMachine } from '../dispatch'
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
		const s1 = dispatchMachine(machine, tag('start'), tag('idle'), vi.fn())
		expect(s1).toEqual(tag('running', 0))

		// Running -> Tick
		const s2 = dispatchMachine(
			machine,
			tag('tick'),
			tag('running', 10),
			vi.fn(),
		)
		expect(s2).toEqual(tag('running', 11))

		// Running -> Stop
		const s3 = dispatchMachine(
			machine,
			tag('stop'),
			tag('running', 20),
			vi.fn(),
		)
		expect(s3).toEqual(tag('idle'))

		// No handler
		const s4 = dispatchMachine(machine, tag('tick'), tag('idle'), vi.fn())
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
