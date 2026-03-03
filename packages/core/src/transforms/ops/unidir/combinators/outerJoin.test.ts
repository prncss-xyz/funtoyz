import { flow } from '../../../../functions/flow'
import { collect } from '../../../extractors'
import { range } from '../../../sources/sync/loop'
import { map } from '../monadic/map'
import { outerJoin } from './outerJoin'

function toLetter(n: number) {
	return String.fromCharCode(97 + n)
}

describe('outerJoin', () => {
	test('basic', () => {
		const res = collect(
			flow(
				range(0, 2),
				outerJoin(flow(range(0, 2), map(toLetter)), (a, b) => a + b),
			),
		)()
		expect(res).toEqual(['0a', '1a', '0b', '1b'])
	})
})
