import { flow } from '../../../../functions/flow'
import { collect } from '../../../extractors'
import { periodic } from '../../../sources/async/periodic'
import { take } from '../take-like/take'
import { debounce } from './debounce'

describe('debounce', () => {
	test('debounces and flushes on complete', async () => {
		const res = await collect(flow(periodic(1), take(5), debounce(50)))()
		expect(res).toHaveLength(1)
	})
})
