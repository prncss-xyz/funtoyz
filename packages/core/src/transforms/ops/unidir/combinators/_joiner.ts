export function joiner<V1, V2, V>(
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
			for (const v2 of v2s) next(merge(v2, v1))
			v1s.push(v1)
		},
		next2(v2: V2) {
			for (const v1 of v1s) next(merge(v2, v1))
			v2s.push(v2)
		},
	}
}
