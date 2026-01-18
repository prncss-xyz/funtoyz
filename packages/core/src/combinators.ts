/**
 * Apply a function to a value.
 * aka applyTo
 * */
export function thrush<A, B>(a: A) {
	return function (f: (a: A) => B) {
		return f(a)
	}
}

export function lazy<Args extends any[], R>(cb: (...args: Args) => R) {
	return (...args: Args) => {
		return cb(...args)
	}
}
