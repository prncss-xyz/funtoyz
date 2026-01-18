function merge0<P extends object>(p: Partial<P>, q: P): P {
	let res: P | undefined = undefined
	for (const k in p) {
		if (!res) if (q[k] !== p[k]) res = { ...q }
		if (res) (res as any)[k] = p[k]
	}
	return res ?? q
}

export function merge<P>(p: Partial<P>, q: P): P
export function merge<P>(p: P): <Q extends P>(q: Q) => Q
export function merge<P extends object>(p: Partial<P>, q?: P) {
	if (q === undefined) return <Q extends P>(q: Q) => merge0(p, q)
	return merge0(p, q)
}
