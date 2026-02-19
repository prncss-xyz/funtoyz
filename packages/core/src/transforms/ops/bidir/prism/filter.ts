import { prism } from '.'
import { fromInit, Init } from '../../../../functions/arguments/init'
import { id } from '../../../../functions/basics'
import { nothing, Nothing } from '../../../../tags/results'
import { tag } from '../../../../tags/tag'
import { Compose } from '../../../compose'

export function filter<Here, There extends Here, Err = Nothing>(
	cond: (w: Here) => w is There,
	err?: Init<Err, [Here]>,
): Compose<Here, There, never, Err, { EXISTS: false }>
export function filter<Here, Err = Nothing>(
	cond: (w: Here) => boolean,
	err?: Init<Err, [Here]>,
): Compose<Here, Here, never, Err, { EXISTS: false }>
export function filter<Here, Err = Nothing>(
	cond: (w: Here) => boolean,
	err: Init<Err, [Here]> = nothing as never,
) {
	return prism<Here, Here, Err>({
		get: (w) =>
			cond(w) ? tag('success', w) : tag('failure', fromInit(err, w)),
		set: id,
	})
}
