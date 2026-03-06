import { flow } from '../../../../functions/flow'
import { pipe } from '../../../../functions/pipe'
import { collect } from '../../../extractors'
import { range } from '../../../sources/sync/loop'
import { map } from '../monadic/map'
import { zip } from './zip'

function toLetter(n: number) {
	return String.fromCharCode(97 + n)
}

describe('zip', () => {
	test('right shorter', () => {
		const res = collect(
			flow(
				range(0, 3),
				zip(flow(range(0, 2), map(toLetter))),
				map(([a, b]) => a + b),
			),
		)()
		expect(res).toEqual(['0a', '1b'])
	})
	test('left shorter', () => {
		const res = collect(
			flow(
				range(0, 2),
				zip(pipe(() => range(0, 3), map(toLetter))),
				map(([a, b]) => a + b),
			),
		)()
		expect(res).toEqual(['0a', '1b'])
	})
})
