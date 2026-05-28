import { toExhaustive } from '../../assertions'
import { fromInit } from '../../functions/arguments/init'
import { tag } from '../../tags/tag'
import { directMachine } from './direct'

describe('machines/factories/direct', () => {
	test('directMachine works', () => {
		const machine = directMachine()(
			{
				count: 0,
				toto: 3,
			},
			{
				finish: (_: void, count) => count,
				inc: (e: number, { count }) => ({ count: count + e }),
			},
		)

		expect(fromInit(machine.init)).toEqual({ count: 0, toto: 3 })

		const s1 = machine.reduce(
			tag('inc', 5),
			{
				count: 1,
				toto: 3,
			},
			toExhaustive,
		)
		expect(s1).toEqual({ count: 6, toto: 3 })

		// finish accepts a void payload
		machine.reduce(tag('finish'), s1, toExhaustive)
		// @ts-expect-error inc does not accept a void payload
		machine.reduce(tag('inc'), s1, toExhaustive)
	})
})
