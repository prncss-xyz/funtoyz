import { pipe } from './pipe'

test('pipe', () => {
	const result = pipe(
		(x: number) => x + 1,
		(x) => x * 2,
	)(0)
	expect(result).toEqual(2)
})
