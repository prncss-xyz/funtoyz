import { flow } from '../../../functions/flow'
import { collect } from '../../extractors'
import { take } from '../../ops/unidir/take'
import { periodic } from './periodic'

describe.skip('periodic', () => {
	test('basic', async () => {
		const res = await collect(flow(periodic, take(3)))(1)
		expect(res.length).toEqual(3)
	})
})
