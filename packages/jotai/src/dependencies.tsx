import {
	createContainer,
	dependency,
	Empty,
	Prettify,
	Schema,
} from '@funtoyz/core'
import { atom, Atom } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { type ReactElement, type ReactNode } from 'react'

export function createContainerAtom<I extends Empty>() {
	type S = { [K in keyof I]: Atom<I[K]> }
	const containerAtom = atom(undefined as unknown as S)
	type Res = Prettify<readonly [typeof containerAtom, S]>

	function hydrateTestContainerAtom<C extends Partial<S>, P = Empty>(
		fn: (source: Schema<P>) => Schema<C>,
		parent: P,
	): Res
	function hydrateTestContainerAtom<C extends Partial<S>>(
		fn: (source: Schema<Empty>) => Schema<C>,
	): Res
	function hydrateTestContainerAtom(fn: (s: any) => any, parent?: any) {
		return [containerAtom, createContainer(fn, parent)] as any
	}

	function hydrateContainerAtom<C extends S, P = Empty>(
		fn: (source: Schema<P>) => Schema<C>,
		parent: P,
	): Res
	function hydrateContainerAtom<C extends S>(
		fn: (source: Schema<Empty>) => Schema<C>,
	): Res
	function hydrateContainerAtom(fn: (s: any) => any, parent?: any) {
		return [containerAtom, createContainer(fn, parent)] as any
	}

	const cache = new Map<keyof I, Atom<any>>()
	const services = new Proxy({} as S, {
		get(_, prop) {
			const key = prop as keyof I
			if (cache.has(key)) {
				return cache.get(key)
			}
			const serviceAtom = atom((get) => {
				const container = get(containerAtom)
				if (!container) {
					throw new Error(
						`Container not hydrated. Make sure to use SUT or hydrateContainerAtom.`,
					)
				}
				return get((container as any)[key])
			})
			cache.set(key, serviceAtom)
			return serviceAtom
		},
	})

	function SUT<C extends Partial<S>, P = Empty>({
		fn,
		parent,
		children,
	}: {
		fn: (source: Schema<P>) => Schema<C>
		parent: P
		children: ReactNode
	}): ReactElement
	function SUT<C extends Partial<S>>({
		fn,
		children,
	}: {
		fn: (source: Schema<Empty>) => Schema<C>
		children: ReactNode
	}): ReactElement
	function SUT({
		fn,
		parent,
		children,
	}: {
		fn: (source: Schema<any>) => Schema<Partial<S>>
		parent?: any
		children: ReactNode
	}) {
		useHydrateAtoms([hydrateTestContainerAtom(fn, parent)])
		return children
	}

	function dep<
		Key extends PropertyKey,
		Value extends Key extends keyof S ? Schema<S>[Key] : unknown,
	>(key: Key, value: Value) {
		return dependency(key, value)
	}

	return {
		containerAtom,
		dep,
		hydrateContainerAtom,
		hydrateTestContainerAtom,
		services,
		SUT,
	}
}
