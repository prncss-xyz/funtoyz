export function isEmpty(obj?: object) {
	if (!obj) return true
	for (const _ of Object.keys(obj)) {
		return false
	}
	return true
}
