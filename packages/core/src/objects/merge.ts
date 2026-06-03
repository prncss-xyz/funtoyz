// link { ...q, p }, but will preserve reference is the result is shallow equal
function merge0<P extends object>(p: P, q: Partial<P>): P {
	let res: P | undefined = undefined
	for (const k in q) {
		if (res) (res as any)[k] = q[k]
		else if (p[k] !== q[k]) res = { ...p, [k]: q[k] }
	}
	return res ?? p
}

export function merge<P>(p: P, q: Partial<P>): P
export function merge<P>(p: P): <Q extends P>(q: Q) => Q
export function merge<P extends object>(p: Partial<P>, q?: P) {
	if (q === undefined) return <Q extends P>(q: Q) => merge0(q, p)
	return merge0(p, q)
}
