import { flow } from '../../../../functions/flow'
import { collect } from '../../../extractors'
import { range } from '../../../sources/sync/loop'
import { map } from '../monadic/map'
import { concat } from './concat'

describe('concat', () => {
	test('concatenates two sources', () => {
		const res = collect(
			flow(
				range(0, 2),
				concat(
					flow(
						range(0, 2),
						map((x) => String.fromCharCode(97 + x)),
					),
				),
			),
		)()
		expect(res).toEqual([0, 1, 'a', 'b'])
	})
})
