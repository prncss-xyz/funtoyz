import { flow, linear, once, prop } from '@funtoyz/core'
import { atom, createStore } from 'jotai'

import { asyncAtomFactory } from './_testUtils'
import { disabledAtom, focusAtom, viewAtom } from './optics'

test('view', () => {
	const store = createStore()
	const sourceAtom = atom(1)
	const o = flow(once<number>(), linear(2))
	const targetAtom = viewAtom(sourceAtom, o)
	const res1 = store.get(targetAtom)
	expect(res1).toBe(2)
	expectTypeOf(res1).toEqualTypeOf<number>()
	const targetAtom2 = viewAtom(sourceAtom, linear(2))
	const res2 = store.get(targetAtom2)
	expectTypeOf(res2).toEqualTypeOf<number>()
	expect(res2).toBe(2)
})

describe('focus', async () => {
	test('sync', async () => {
		const store = createStore()
		const sourceAtom = atom({ a: 1 })
		const targetAtom = focusAtom(sourceAtom, prop('a'))
		const res = store.get(targetAtom)
		expectTypeOf(res).toEqualTypeOf<number>()
		expect(res).toBe(1)
		store.set(targetAtom, 4)
		await Promise.resolve()
		expect(store.get(sourceAtom)).toEqual({ a: 4 })
		const thirdAtom = focusAtom(targetAtom, linear(2))
		const res2 = store.get(thirdAtom)
		expectTypeOf(res2).toEqualTypeOf<number>()
		expect(res2).toEqual(8)
	})
	test('async', async () => {
		const store = createStore()
		const sourceAtom = asyncAtomFactory({ a: 1 })
		const targetAtom = focusAtom(sourceAtom, prop('a'))
		const res = await store.get(targetAtom)
		expect(res).toBe(1)
		expectTypeOf(res).toEqualTypeOf<number>()
		store.set(targetAtom, 4)
		expect(await store.get(sourceAtom)).toEqual({ a: 4 })
		const thirdAtom = focusAtom(targetAtom, linear(2))
		const res2 = await store.get(thirdAtom)
		expectTypeOf(res2).toEqualTypeOf<number>()
		expect(res2).toEqual(8)
	})
})

describe('disabledFocus', async () => {
	test('sync', async () => {
		const store = createStore()
		const sourceAtom = atom({ a: 1 })
		const targetAtom = disabledAtom(sourceAtom, prop('a'), 4)
		expect(store.get(targetAtom)).toBeFalsy()
		store.set(targetAtom)
		await Promise.resolve()
		expect(store.get(sourceAtom)).toEqual({ a: 4 })
		expect(store.get(targetAtom)).toBe(true)
	})
	test('async', async () => {
		const store = createStore()
		const sourceAtom = asyncAtomFactory({ a: 1 })
		const partAtom = disabledAtom(sourceAtom, prop('a'), 4)
		expect(await store.get(partAtom)).toBe(false)
		store.set(partAtom)
		await Promise.resolve()
		expect(await store.get(sourceAtom)).toEqual({ a: 4 })
		expect(await store.get(partAtom)).toBe(true)
	})
})
