import Signal from './Signal'

test('A signal can be connected to and emitted', () => {
    const signal = new Signal<boolean>()
    const callbackMock = jest.fn()
    signal.connect(callbackMock)
    signal.emit(true)
    expect(callbackMock.mock.calls.length).toBe(1)
    expect(callbackMock.mock.calls[0][0]).toEqual(true)
})

test('A signal can take and emit a complex types', () => {
    const signal = new Signal<{a: string, b: number}>()
    const callbackMock = jest.fn()
    signal.connect(callbackMock)
    signal.emit({ a: 'hi!', b: 100 })
    expect(callbackMock.mock.calls.length).toBe(1)
    expect(callbackMock.mock.calls[0][0]).toEqual({ a: 'hi!', b: 100 })
})

test('A signal can be disconnected from', () => {
    const signal = new Signal<boolean>()
    const callbackMock = jest.fn()
    signal.connect(callbackMock)
    signal.disconnect(callbackMock)
    signal.emit(true)
    expect(callbackMock.mock.calls.length).toBe(0)
})
