import { fromInit } from '../../functions/arguments/init'
import { tag } from '../../tags/tag'
import { directMachine } from './direct'

describe('machines/factories/direct', () => {
	test('directMachine works', () => {
		const machine = directMachine()(0, {
			finish: (_: void, count) => count,
			inc: (e: number, count) => count + e,
		})

		expect(fromInit(machine.init)).toEqual(0)

		const s1 = machine.reduce(tag('inc', 5), 1)
		expect(s1).toEqual(6)

		// finish accepts a void payload
		machine.reduce('finish', s1)
		// @ts-expect-error inc does not accept a void payload
		machine.reduce('inc', s1)
	})
})
