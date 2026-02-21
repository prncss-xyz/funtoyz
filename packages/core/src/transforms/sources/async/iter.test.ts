import { collect } from '../../extractors'
import { iterAsync } from './iter'

const s = (async function* () {
	yield 0
	yield 1
	yield 2
})()

describe('interval', () => {
	it('sums interval', async () => {
		const res = await collect(iterAsync<number>())(s)
		expect(res).toEqual([0, 1, 2])
	})
})
