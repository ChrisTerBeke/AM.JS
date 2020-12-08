module.exports = {
    collectCoverage: true,
    // coverageThreshold: {
    //     global: {
    //         branches: 100,
    //         functions: 100,
    //         lines: 100,
    //         statements: 100
    //     },
    // },
    setupFiles: ["jest-canvas-mock"],
    testEnvironment: "jsdom",
    transformIgnorePatterns: [],
    transform: {
        "^.+\\.stl$": "<rootDir>/src/jest-stl-transformer.js",
        "^.+\\.[t|j]sx?$": "babel-jest"
    },
}
