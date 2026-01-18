export function merge<P extends object>(p: P, q: Partial<P>): P {
	let res: P | undefined = undefined
	for (const k in q) {
		if (!res) if (p[k] !== q[k]) res = { ...p }
		if (res) (res as any)[k] = q[k]
	}
	return res ?? p
}
