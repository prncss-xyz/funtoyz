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

type Pre<Args, Acc extends unknown[] = []> = Args extends [
	infer T,
	...infer Rest,
]
	? [...Acc, T] | Pre<Rest, [...Acc, T]>
	: never
type Rest<P extends unknown[], Q extends unknown[]> = P extends [
	infer T,
	...infer R,
]
	? Q extends [infer U, ...infer S]
		? T extends U
			? Rest<R, S>
			: never
		: never
	: Q
export type Curry<Args extends unknown[], Res> = {
	<PS extends Pre<Args>>(...p: PS): Curry<Rest<PS, Args>, Res>
	(...p: Args): Res
}

/**
 * Curry a function. If the function has optional or variadic arguments, you need to specify the number of arguments through the `n` parameter.
 *
 * @param [n=f.length] If the function has optional or variadic arguments, you need to specify the number of arguments.
 *
 * @remark Will not preserve the type of generic functions.
 */
export function curry<Args extends unknown[], Res>(
	f: (...args: Args) => Res,
	n = f.length,
): Curry<Args, Res> {
	return function <PS extends Pre<Args>>(...p: PS) {
		if (p.length >= n) {
			return (f as any)(...p)
		}
		return curry(function (...q) {
			return (f as any)(...p, ...q)
		}, n - p.length)
	}
}
