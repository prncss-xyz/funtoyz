import { failure, nothing, success } from '../../../tags/results'
import { collect } from '../../extractors'
import { unfold } from './unfold'

describe('unfold', () => {
	test('', () => {
		const res = collect(
			unfold(0, (acc) =>
				acc < 3 ? success.of(acc + 1) : failure.of(nothing()),
			),
		)()
		expect(res).toEqual([1, 2, 3])
	})
})
