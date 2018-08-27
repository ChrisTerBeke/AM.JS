// Copyright (c) 2018 Chris ter Beke
// am.js is open source under the terms of LGPLv3 or higher
import Config from './Config'

// interfaces
import { SignalInterface } from '../helpers/Signal'

interface AMJSInterface {
	// signals
	onReady: SignalInterface<{success: boolean}>
	// initialize application
	init(): void
	// application config
	getConfig(): Config
	// application UUID
	getUUID(): string
	// get canvas target element
	getCanvas(): HTMLCanvasElement
	// set canvas target element
	setCanvas(canvas: HTMLCanvasElement): void
}

export default AMJSInterface
