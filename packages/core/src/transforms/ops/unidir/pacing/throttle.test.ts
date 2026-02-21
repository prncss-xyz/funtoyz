import { flow } from '../../../../functions/flow'
import { collect } from '../../../extractors'
import { periodic } from '../../../sources/async/periodic'
import { take } from '../take-like/take'
import { throttle } from './throttle'

describe('throttle', () => {
	test('throttles rapid emissions', async () => {
		const res = await collect(flow(periodic(1), take(10), throttle(15)))()
		expect(res.length).toBeLessThan(10)
		expect(res.length).toBeGreaterThan(0)
	})
})
