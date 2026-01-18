import { curry2 } from '../foundations/functions/arguments'

export const mul = curry2((a: number, b: number) => b * a)
export const div = curry2((a: number, b: number) => a / b)
export const add = curry2((a: number, b: number) => a + b)
export const sub = curry2((a: number, b: number) => a - b)
export const lt = curry2((a: number, b: number) => a < b)
export const lte = curry2((a: number, b: number) => a <= b)
export const gt = curry2((a: number, b: number) => a < b)
export const gte = curry2((a: number, b: number) => a <= b)
export const eq = curry2(<A, B>(a: A, b: B) => Object.is(a, b))
export const neq = curry2(<A, B>(a: A, b: B) => !Object.is(a, b))
export const and = curry2((a: unknown, b: unknown) => a && b)
export const or = curry2((a: unknown, b: undefined) => a || b)
export const xor = curry2((a: unknown, b: unknown) => (!a && b) || (!b && a))
export const iDiv = curry2((a: number, b: number) => Math.floor(a / b))
export function always<T>(a: T) {
	return function () {
		return a
	}
}
export function not(a: unknown) {
	return !a
}

// math behavior
export const modulo = curry2((a: number, b: number) => {
	if (a < 0) return b + (a % b)
	return a % b
})

export function clamp(min: number, max = Infinity) {
	return function (source: number) {
		return Math.max(Math.min(source, max), min)
	}
}

export function tuple<const Args extends unknown[]>(...args: Args) {
	return args
}

export function eqWith<A, B>(m: (a: A) => B) {
	return function (a: A, b: A) {
		return Object.is(m(a), m(b))
	}
}
