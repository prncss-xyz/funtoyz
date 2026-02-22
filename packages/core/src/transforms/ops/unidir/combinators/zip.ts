import { Optic } from '../../../compose'
import { Flags, HasFlag } from '../../../compose/_flags'

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

// TODO: handle sync (runtime)
// TODO: harmonize R -> 1 L -> 2

export function zip<
	TR,
	SR,
	ER,
	GR,
	FR extends Flags & { UNIQUE: false },
	V,
	TL,
>(
	oRight: Optic<TR, SR, ER, GR, HasFlag<'READ', FR>>,
	merge: (a: TL, b: TR) => V,
) {
	return function <SL, EL, GL, FL extends { UNIQUE: false }>(
		oLeft: Optic<TL, SL, EL, GL, HasFlag<'READ', FL>>,
	): Optic<
		V,
		SL,
		EL | ER,
		GL | GR,
		(FR['SYNC'] extends false ? { SYNC: false } : object) & {
			CONSTRUCT: false
			UNIQUE: false
			WRITE: false
		}
	> {
		return {
			emitter: (
				source: SL,
				next: (value: V) => void,
				e: (error: EL | ER) => void,
				c: () => void,
			) => {
				const { completeLeft, completeRight, nextLeft, nextRight } = merger(
					merge,
					next,
					c,
				)

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
			},
			flags: {
				CONSTRUCT: false,
				SYNC: oRight.flags.SYNC as never,
				UNIQUE: false,
				WRITE: false,
			},
			nothing: oLeft.nothing,
		}
	}
}
