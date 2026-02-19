import { flow } from '../../functions/flow'
import { collect } from '../../transforms/extractors'
import { elems } from '../../transforms/ops/bidir/traversal/elems'
import { scan } from '../../transforms/ops/unidir/scan'
import { once } from '../../transforms/sources/sync/once'
import { exit } from '../core'
import { baseMachine } from './base'

describe('machines/factories/base', () => {
	it.skip('baseMachine works', () => {
		const machine = baseMachine<never, string>()(
			0,
			(event: number, state: number) => {
				if (event === 0) return exit('done')
				return state + event
			},
			String,
		)
		// FIX: type
		const o = flow(once<number[]>(), elems(), scan(machine() as any))
		const res = collect(o)([1, 2, 3, 0, 5])
		expect(res).toEqual(['0', '1', '3', '6', 'done'])
	})
})
