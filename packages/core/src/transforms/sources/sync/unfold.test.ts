import { nothing, result } from '../../../tags/results'
import { collect } from '../../extractors'
import { unfold } from './unfold'

describe('unfold', () => {
	test('', () => {
		const res = collect(
			unfold(0, (acc) =>
				acc < 3 ? result.success.of(acc + 1) : result.failure.of(nothing()),
			),
		)()
		expect(res).toEqual([1, 2, 3])
	})
})
