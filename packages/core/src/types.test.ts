import { expectTypeOf } from 'vitest'
import { ValueIntersection, ValueEventIntersection } from './types'

describe('ValueIntersection', () => {
	it('intersects object values', () => {
		type Input = {
			a: { x: number }
			b: { y: string }
		}
		type Result = ValueIntersection<Input>
		type Expected = { x: number; y: string }

		expectTypeOf<Result>().toEqualTypeOf<Expected>()
	})

	it('intersects primitive values', () => {
		type Input = {
			a: string
			b: number
		}
		type Result = ValueIntersection<Input>
		expectTypeOf<Result>().toEqualTypeOf<never>()
	})
})

describe('ShallowValueIntersection', () => {
	it('intersects object values field-by-field', () => {
		type Input = {
			a: { x: number; y: string }
			b: { x: number; z: boolean }
		}
		type Result = ValueEventIntersection<Input>
		type Expected = { x: number; y: string; z: boolean }

		expectTypeOf<Result>().toEqualTypeOf<Expected>()
	})

	it('intersects fields present in both', () => {
		type Input = {
			a: { x: 1; b: true }
			b: { x: 2 }
		}
		type Result = ValueEventIntersection<Input>
		type Expected = { b: true }

		expectTypeOf<Result>().toEqualTypeOf<Expected>()
	})

	it('should return never when intersecting object and boolean', () => {
		type Input = {
			a: { n: number }
			b: boolean
		}
		type Result = ValueEventIntersection<Input>
		expectTypeOf<Result>().toEqualTypeOf<
			{
				n: number
			} & boolean
		>()
	})

	it('falls back to ValueIntersection when not all members are objects', () => {
		type Input = {
			a: number
			b: string
		}
		type Result = ValueEventIntersection<Input>
		expectTypeOf<Result>().toEqualTypeOf<never>()
	})

	it('falls back to ValueIntersection when not all members are objects', () => {
		type Input = {
			a: number
			b: string | number
		}
		type Result = ValueEventIntersection<Input>
		expectTypeOf<Result>().toEqualTypeOf<number>()
	})

	it('handles optional fields', () => {
		type Input = {
			a: { x: number; y?: string }
			b: { x: number; y: string }
		}
		type Result = ValueEventIntersection<Input>
		// string | undefined & string = string
		type Expected = { x: number; y: string }

		expectTypeOf<Result>().toEqualTypeOf<Expected>()
	})
})
