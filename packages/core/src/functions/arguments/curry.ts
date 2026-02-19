export function curry2<A, B, R>(fn: (a: A, b: B) => R) {
	function res(b: B): (a: A) => R
	function res(a: A, b: B): R
	function res(...args: [A, B] | [B]) {
		if (args.length === 2) return fn(...args)
		return function (a: A) {
			return fn(a, args[0])
		}
	}
	return res
}

export function curry2_1<A, B, C, R>(fn: (a: A, b: B, c: C) => R) {
	function res(a: A, b: B): (c: C) => R
	function res(a: A, b: B, c: C): R
	function res(...args: [A, B, C] | [A, B]) {
		if (args.length === 3) return fn(...args)
		return function (c: C) {
			return fn(args[0], args[1], c)
		}
	}
	return res
}
