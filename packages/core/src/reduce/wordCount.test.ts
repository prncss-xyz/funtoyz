import { reduce } from '.'
import { wordCount } from './wordCount'

describe('isWordLike', () => {
	test('defined', () => {
		const res = reduce(wordCount(), 'hello world')
		expect(res).toEqual(2)
	})
})
