import { sourceSync } from '.'
import { noop } from '../../../functions/basics'

export function none<S>() {
	return sourceSync<S, void, never>((_s, _next, _error, complete) => {
		return {
			abort: noop,
			start: complete,
		}
	})
}
