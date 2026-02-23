import { curry2, curry2_1 } from './arguments/curry'

export const mul = curry2((a: number, b: number) => b * a)
export const div = curry2((a: number, b: number) => a / b)
export const add = curry2((a: number, b: number) => a + b)
export const sub = curry2((a: number, b: number) => a - b)
export const lt = curry2((a: number, b: number) => a < b)
export const lte = curry2((a: number, b: number) => a <= b)
export const gt = curry2((a: number, b: number) => a > b)
export const gte = curry2((a: number, b: number) => a >= b)
export const eeq = curry2(<A, B>(a: A, b: B) => Object.is(a, b))
export const neq = curry2(<A, B>(a: A, b: B) => !Object.is(a, b))
export const and = curry2((a: unknown, b: unknown) => a && b)
export const or = curry2((a: unknown, b: undefined) => a || b)
export const xor = curry2((a: unknown, b: unknown) => (!a && b) || (!b && a))
export const iDiv = curry2((a: number, b: number) => Math.floor(a / b))
export const min = curry2((a: number, b: number) => Math.min(a, b))
export const max = curry2((a: number, b: number) => Math.max(a, b))
export function always<T>(a: T) {
	return function () {
		return a
	}
}

export function compare<T>(a: T, b: T): number {
	return a < b ? -1 : a > b ? 1 : 0
}

export function maxFrom<A, T>(f: (a: A) => T) {
	return (a: A, b: A) => (f(a) > f(b) ? a : b)
}

export function minFrom<A, T>(f: (a: A) => T) {
	return (a: A, b: A) => (f(a) < f(b) ? a : b)
}

export function maxWith<A>(f: (a: A, b: A) => number) {
	return (a: A, b: A) => (f(a, b) > 0 ? a : b)
}

export function minWith<A>(f: (a: A, b: A) => number) {
	return (a: A, b: A) => (f(a, b) < 0 ? a : b)
}

export function not(a: unknown) {
	return !a
}

// math behavior
export const modulo = curry2((a: number, b: number) => {
	if (a < 0) return b + (a % b)
	return a % b
})

export const clamp = curry2_1((min: number, max: number, source: number) =>
	Math.max(Math.min(source, max), min),
)

export function tuple<const Args extends unknown[]>(...args: Args) {
	return args
}

export function eqWith<A, B>(m: (a: A) => B) {
	return curry2((a: A, b: A) => Object.is(m(a), m(b)))
}
