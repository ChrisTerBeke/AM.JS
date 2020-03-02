module.exports = {
    collectCoverage: true,
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100
        },
    },
    preset: 'ts-jest',
    setupFiles: ['jest-canvas-mock'],
    testEnvironment: 'jest-environment-jsdom-fourteen'
}
