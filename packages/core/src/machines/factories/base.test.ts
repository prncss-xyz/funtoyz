import { flow } from '../../functions/flow'
import { Tag } from '../../tags/types'
import { collect } from '../../transforms/extractors'
import { elems } from '../../transforms/ops/bidir/traversal/elems'
import { scan } from '../../transforms/ops/unidir/folding/scan'
import { once } from '../../transforms/sources/sync/once'
import { baseMachine } from './base'

describe('machines/factories/base', () => {
	it('baseMachine works', () => {
		const machine = baseMachine()(
			0,
			(event: Tag<'add', number>, state: number) => {
				return state + event.payload
			},
			String,
		)
		// TODO: scan for machines
		const o = flow(once<Tag<'add', number>[]>(), elems(), scan(machine as any))
		const res = collect(o)([
			{ type: 'add', payload: 1 },
			{ type: 'add', payload: 2 },
			{ type: 'add', payload: 3 },
		])
		expect(res).toEqual(['0', '1', '3', '6'])
	})
})
