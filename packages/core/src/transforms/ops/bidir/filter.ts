import { fromInit, Init } from '../../../functions/arguments'
import { Compo, compo_, trush } from '../../compose_'

export function filter<Here, There extends Here, Err = 'nothing'>(
	cond: (w: Here) => w is There,
	err?: Init<Err, [Here]>,
): Compo<There, Here, Err, never>
export function filter<Here, Err = 'nothing'>(
	cond: (w: Here) => boolean,
	err?: Init<Err, [Here]>,
): Compo<Here, Here, Err, never>
export function filter<Here, Err = 'nothing'>(
	cond: (w: Here) => boolean,
	err?: Init<Err, [Here]>,
) {
	const getter = (w: Here, next: (t: Here) => void, error: (e: Err) => void) =>
		cond(w) ? next(w) : error(err ? fromInit(err, w) : ('nothing' as any))
	return compo_<Here, Here, Err, never>({
		getter,
		remover: (w, next) => !cond(w) && next(w),
		reviewer: trush,
	})
}
