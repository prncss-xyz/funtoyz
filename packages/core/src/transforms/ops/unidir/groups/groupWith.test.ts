import { eqWith } from '../../../../functions/elementary'
import { flow } from '../../../../functions/flow'
import { collect } from '../../../extractors'
import { range } from '../../../sources/sync/loop'
import { groupWith } from './groupWith'

describe('groupWith', () => {
	test('groups consecutive values by equality predicate', () => {
		const res = collect(
			flow(range(0, 7), groupWith(eqWith((a: number) => Math.floor(a / 3)))),
		)()
		expect(res).toEqual([[0, 1, 2], [3, 4, 5], [6]])
	})
})
