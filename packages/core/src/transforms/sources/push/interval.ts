// AGENT: do not write tests for this file

import { Source } from '../../types'

type Handler = ReturnType<typeof setInterval>

// Do not write tests for this
export function interval(period: number): Source<number, never> {
	return function (next) {
		let index = 0
		let handler: Handler
		return {
			start() {
				handler = setInterval(() => {
					next(index++)
				}, period)
			},
			unmount() {
				clearInterval(handler)
			},
		}
	}
}
