import { flow } from '../../../../functions/flow'
import { collect } from '../../../extractors'
import { range } from '../../../sources/sync/loop'
import { map } from './map'
import { mapAsync } from './mapAsync'

function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

describe('mapAsync', () => {
	test('resolves promises and emits values in completion order', async () => {
		const res = await collect(
			flow(
				range(0, 3),
				map(async (v) => {
					await delay(v * 10)
					return v
				}),
				mapAsync((x) => x),
			),
		)()
		// Values complete out of order: 0 (0ms), 1 (10ms), 2 (20ms)
		expect(res).toEqual([0, 1, 2])
	})
})
