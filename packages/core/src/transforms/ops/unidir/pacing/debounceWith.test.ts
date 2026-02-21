import { flow } from '../../../../functions/flow'
import { collect } from '../../../extractors'
import { iterAsync } from '../../../sources/async/iter'
import { debounceWith } from './debounceWith'

async function* gen(values: number[]) {
	for (const v of values) {
		yield v
	}
}

describe('debounceWith', () => {
	test('emits immediately when value changes', async () => {
		const res = await collect(
			flow(iterAsync<number>(), debounceWith(50, Object.is)),
		)(gen([1, 1, 2, 2, 2, 3]))
		expect(res).toEqual([1, 2, 3])
	})
})
