export function zipper<V0, V1>(
	next: (c: [V0, V1]) => void,
	complete: () => void,
) {
	let opened0 = true
	let opened1 = true
	const v0s: V0[] = []
	const v1s: V1[] = []
	return {
		complete0() {
			if (opened1) {
				opened0 = false
				return
			}
			complete()
		},
		// completes if both are completed
		complete1() {
			if (opened0) {
				opened1 = false
				return
			}
			complete()
		},
		next0(v0: V0) {
			if (!opened0) return
			if (v1s.length) {
				const r = v1s.shift()!
				next([v0, r])
				if (!v1s.length && !opened1) complete()
				return
			}
			v0s.push(v0)
		},
		next1(v1: V1) {
			if (!opened1) return
			if (v0s.length) {
				const a = v0s.shift()!
				next([a, v1])
				if (!v0s.length && !opened0) complete()
				return
			}
			v1s.push(v1)
		},
	}
}
