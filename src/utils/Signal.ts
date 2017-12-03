'use strict'

export interface ISignal<T> {
    connect (handler: { (data?: T): void }) : void
    disconnect (handler: { (data?: T): void }) : void
    emit (data?: T): void
}

export class Signal<T> implements ISignal<T> {

    private _handlers: { (data?: T): void }[] = []

    public connect (handler: { (data?: T): void }): void {
        this._handlers.push(handler)
    }

    public disconnect (handler: { (data?: T): void }): void {
        this._handlers = this._handlers.filter(h => h !== handler)
    }

    public emit (data?: T): void {
        this._handlers.slice(0).forEach(h => h(data))
    }
}
