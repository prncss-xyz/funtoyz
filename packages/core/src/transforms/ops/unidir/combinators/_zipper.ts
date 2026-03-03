export function zipper<V1, V2, V>(
	merge: (v2: V2, v1: V1) => V,
	next: (c: V) => void,
	complete: () => void,
) {
	let opened1 = true
	let opened2 = true
	const v1s: V1[] = []
	const v2s: V2[] = []
	return {
		// completes if both are completed
		complete1() {
			if (opened2) {
				opened1 = false
				return
			}
			complete()
		},
		complete2() {
			if (opened1) {
				opened2 = false
				return
			}
			complete()
		},
		next1(v1: V1) {
			if (!opened1) return
			if (v2s.length) {
				const a = v2s.shift()!
				next(merge(a, v1))
				if (!v2s.length && !opened2) complete()
				return
			}
			v1s.push(v1)
		},
		next2(v2: V2) {
			if (!opened2) return
			if (v1s.length) {
				const r = v1s.shift()!
				next(merge(v2, r))
				if (!v1s.length && !opened1) complete()
				return
			}
			v2s.push(v2)
		},
	}
}
