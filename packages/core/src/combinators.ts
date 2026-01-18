/**
 * Apply a list of arguments to a list of functions (branches) and merge the results with a converging function.
 */
export function converge<
	Args extends unknown[],
	Branches extends { [K in number]: (...args: Args) => unknown },
>(...branches: ((...args: Args) => unknown)[] & Branches) {
	return function <R>(
		converger: (
			...branches: unknown[] & {
				[K in keyof Branches]: Branches[K] extends (...args: any[]) => infer R
					? R
					: never
			}
		) => R,
	) {
		return function (...args: Args) {
			return converger(...(branches.map((branch) => branch(...args)) as any))
		}
	}
}

/**
 * Apply a list of arguments to a list of functions.
 */
export function juxt<Args extends unknown[], R>(
	...fns: ((...args: Args) => R)[]
) {
	return function (...args: Args) {
		return fns.map((fn) => fn(...args))
	}
}

/**
 *  Apply an argument to an object of functions.
 */
export function report<S>() {
	return function <O extends Record<PropertyKey, (s: S) => unknown>>(o: O) {
		return function (t: S): {
			[K in keyof O]: O[K] extends (s: S) => infer R ? R : never
		} {
			const res = {} as any
			for (const [k, v] of Object.entries(o)) {
				res[k] = v(t)
			}
			return res
		}
	}
}

/**
 * Apply a function to a value.
 * aka applyTo
 * */
export function thrush<A, B>(a: A) {
	return function (f: (a: A) => B) {
		return f(a)
	}
}

export function lazy<Args extends unknown[], R>(cb: (...args: Args) => R) {
	return (...args: Args) => {
		return cb(...args)
	}
}
