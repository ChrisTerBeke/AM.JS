import generateUUID from './generateUUID'

test('A UUID can be generated', () => {
    const uuid = generateUUID()
    expect(uuid.length).toBe(36)
})
