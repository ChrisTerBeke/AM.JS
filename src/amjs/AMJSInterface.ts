import Config from './Config'

// interfaces
import { SignalInterface } from '../helpers/Signal'

interface AMJSInterface {
	// signals
	onReady: SignalInterface<{}>
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
