import { lt } from '../../../../functions/elementary'
import { flow } from '../../../../functions/flow'
import { collect } from '../../../extractors'
import { range } from '../../../sources/sync/loop'
import { dropWhile } from './dropWhile'

describe('dropWhile', () => {
	test('drops while condition holds', () => {
		const res = collect(flow(range(0, 7), dropWhile(lt(3))))()
		expect(res).toEqual([4, 5, 6])
	})
})
