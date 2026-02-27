export function unwrap<A, B>(source: B | Promise<B>, select: (w: B) => A) {
	return source instanceof Promise ? source.then(select) : select(source)
}
