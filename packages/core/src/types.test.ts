import { expectTypeOf } from 'vitest'
import { ValueIntersection, KeywiseIntersection, KeywiseUnion } from './types'

describe('KeywiseUnion', () => {
	it('unions object values', () => {
		type Input = {
			a: { x: number }
			b: { x: boolean; y: string }
		}
		type Result = KeywiseUnion<Input>
		type Expected = { x: number | boolean; y: string }

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

describe('KeywiseIntersection', () => {
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
			a: { a: 1; x: number | string; y: string }
			b: { a: 2; x: number; z: boolean }
		}
		type Result = KeywiseIntersection<Input>
		type Expected = { x: number; y: string; z: boolean }

		expectTypeOf<Result>().toEqualTypeOf<Expected>()
	})

	it('intersects fields present in both', () => {
		type Input = {
			a: { x: 1; b: true }
			b: { x: 2 }
		}
		type Result = KeywiseIntersection<Input>
		type Expected = { b: true }

		expectTypeOf<Result>().toEqualTypeOf<Expected>()
	})

	it('handles optional fields', () => {
		type Input = {
			a: { x: number; y?: string }
			b: { x: number; y: string }
		}
		type Result = KeywiseIntersection<Input>
		// string | undefined & string = string
		type Expected = { x: number; y: string }

		expectTypeOf<Result>().toEqualTypeOf<Expected>()
	})
})
