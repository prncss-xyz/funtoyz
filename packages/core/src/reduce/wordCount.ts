import { Reducer } from '.'

function isWordLike(t: string) {
	return /\w/.test(t)
}

export function wordCount(): Reducer<
	string,
	{
		count: number
		last: boolean
	},
	number
> {
	return {
		init: () => ({ count: 0, last: false }),
		reduce: (t, acc) => {
			const last = isWordLike(t)
			const inc = !acc.last && last ? 1 : 0
			return { count: acc.count + inc, last }
		},
		result: ({ count }) => count,
	}
}
