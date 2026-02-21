import { lt } from '../../../../functions/elementary'
import { flow } from '../../../../functions/flow'
import { collect } from '../../../extractors'
import { range } from '../../../sources/sync/loop'
import { takeWhile } from './takeWhile'

describe('takeWhile', () => {
	test('takes while condition holds', () => {
		const res = collect(flow(range(0, 10), takeWhile(lt(5))))()
		expect(res).toEqual([0, 1, 2, 3, 4])
	})
})
