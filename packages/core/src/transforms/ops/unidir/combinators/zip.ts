import { Optic } from '../../../compose'
import { Flags } from '../../../compose/_flags'

function merger<VL, VR, V>(
	merge: (left: VL, right: VR) => V,
	push: (c: V) => void,
	complete: () => void,
) {
	let openedLeft = true
	let openedRight = true
	const ls: VL[] = []
	const rs: VR[] = []
	return {
		completeLeft() {
			if (openedRight) {
				openedLeft = false
				return
			}
			complete()
		},
		completeRight() {
			if (openedLeft) {
				openedRight = false
				return
			}
			complete()
		},
		nextLeft(l: VL) {
			if (!openedLeft) return
			if (rs.length) {
				const r = rs.shift()!
				push(merge(l, r))
				if (!rs.length && !openedRight) complete()
				return
			}
			ls.push(l)
		},
		nextRight(r: VR) {
			if (!openedRight) return
			if (ls.length) {
				const a = ls.shift()!
				push(merge(a, r))
				if (!ls.length && !openedLeft) complete()
				return
			}
			rs.push(r)
		},
	}
}

export function zip<TR, SR, ER, GR, FR extends Flags, V, TL>(
	oRight: Optic<TR, SR, ER, GR, FR>,
	merge: (a: TL, b: TR) => V,
) {
	return function <SL, EL, GL, FL extends Flags>(
		oLeft: Optic<TL, SL, EL, GL, FL>,
	): Optic<V, SL, EL | ER, GL | GR, FL> {
		return {
			...oLeft,
			emitter:
				oLeft.emitter && oRight.emitter
					? (
							source: SL,
							next: (value: V) => void,
							e: (error: EL | ER) => void,
							c: () => void,
						) => {
							const { completeLeft, completeRight, nextLeft, nextRight } =
								merger(merge, next, c)

							const resultL = oLeft.emitter!(source, nextLeft, e, completeLeft)
							const resultR = oRight.emitter!(
								source as any,
								nextRight,
								e,
								completeRight,
							)

							return {
								abort: () => {
									resultL?.abort?.()
									resultR?.abort?.()
								},
								start: () => {
									resultL?.start?.()
									resultR?.start?.()
								},
							}
						}
					: undefined,
		} as any
	}
}
