/**
 * Generates a Unique ID.
 */
function generateUUID(): string {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c: string) => {
        /* tslint:disable:no-bitwise */
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
        /* tslint:enable:no-bitwise */
		      return v.toString(16)
	})
}

export default generateUUID
