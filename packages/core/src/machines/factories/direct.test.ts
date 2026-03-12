import { fromInit } from '../../functions/arguments/init'
import { tag } from '../../tags/tag'
import { directMachine } from './direct'

describe('machines/factories/direct', () => {
	test('directMachine works', () => {
		const machine = directMachine()(0, {
			finish: (e: number) => e,
			inc: (e: number, count) => count + e,
		})

		expect(fromInit(machine.init)).toEqual(0)

		const s1 = machine.reduce(tag('inc', 5), 1)
		expect(s1).toEqual(6)
	})
})
