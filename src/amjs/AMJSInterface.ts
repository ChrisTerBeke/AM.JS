import CIonfig from './Config'

// interfaces
import { ISignalInterface } from '../helpers/Signal'

interface IAMJSInterface {
	// signals
	onReady: ISignalInterface<{}>
	// initialize application
	init(): void
	// application config
	getConfig(): CIonfig
	// application UUID
	getUUID(): string
	// get canvas target element
	getCanvas(): HTMLCanvasElement
	// set canvas target element
	setCanvas(canvas: HTMLCanvasElement): void
}

export default IAMJSInterface
