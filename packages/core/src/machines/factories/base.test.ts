import { flow } from '../../functions/flow'
import { collect } from '../../transforms/extractors'
import { elems } from '../../transforms/ops/bidir/traversal/elems'
import { scan } from '../../transforms/ops/unidir/scan'
import { once } from '../../transforms/sources/sync/once'
import { machineToReducer } from '../core'
import { baseMachine } from './base'

describe('machines/factories/base', () => {
	it('baseMachine works', () => {
		const machine = baseMachine<never>()(
			0,
			(event: number, state: number) => {
				return state + event
			},
			String,
		)
		const o = flow(once<number[]>(), elems(), scan(machineToReducer(machine())))
		const res = collect(o)([1, 2, 3])
		expect(res).toEqual(['0', '1', '3', '6'])
	})
})
