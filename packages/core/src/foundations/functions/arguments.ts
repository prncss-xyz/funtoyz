import { isFunction } from '../../guards'

export type Init<Res, Args extends any[] = []> = ((...args: Args) => Res) | Res

export function fromInit<Res, Args extends any[] = []>(
	init: Init<Res, Args>,
	...args: Args
): Res {
	return isFunction(init) ? init(...args) : init
}

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

export function negate<T>(f: (v: T) => unknown) {
	return function (v: T) {
		return !f(v)
	}
}
