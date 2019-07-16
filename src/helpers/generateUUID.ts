// Copyright (c) 2019 Chris ter Beke
// am.js is open source under the terms of LGPLv3 or higher

/**
 * Generates a Unique ID.
 */
const generateUUID = (): string => {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
		return v.toString(16)
	})
}

export default generateUUID
