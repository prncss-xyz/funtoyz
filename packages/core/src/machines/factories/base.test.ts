import { flow } from '../../functions/flow'
import { eq } from '../../transforms/eq'
import { collect } from '../../transforms/extractors/collect'
import { elems } from '../../transforms/ops/bidir/traversal'
import { scan } from '../../transforms/ops/unidir/scan'
import { exit } from '../core'
import { baseMachine } from './base'

describe('machines/factories/base', () => {
	it('baseMachine works', () => {
		const machine = baseMachine<never, string>()(
			0,
			(event: number, state: number) => {
				if (event === 0) return exit('done')
				return state + event
			},
			String,
		)
		const o = flow(eq<number[]>(), elems(), scan(machine()))
		const res = collect(o)([1, 2, 3, 0, 5])
		expect(res).toEqual(['0', '1', '3', '6', 'done'])
	})
})
