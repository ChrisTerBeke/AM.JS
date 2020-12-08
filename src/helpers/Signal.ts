/**
 * Interface for the Signal class.
 */
export interface ISignalInterface<T> {
    connect(handler: (data?: T) => void): void
    disconnect(handler: (data?: T) => void): void
    emit(data?: T): void
}

/**
 * Event based callback handler.
 */
class Signal<T> implements ISignalInterface<T> {

    // registered callback handlers
    private _handlers: ((data?: T) => void)[] = []

	/**
	 * Connect a callback method to fire when the event occurs.
	 * @param handler The callback.
	 */
    public connect(handler: (data?: T) => void): void {
        this._handlers.push(handler)
    }

	/**
	 * Disconnect a callback method.
	 * @param handler The callback.
	 */
    public disconnect(handler: (data?: T) => void): void {
        this._handlers = this._handlers.filter((h) => h !== handler)
    }

	/**
	 * Emit the event to the registered callback handlers.
	 * @param data The data to emit.
	 */
    public emit(data?: T): void {
        this._handlers.forEach((h) => h(data))
    }
}

export default Signal
