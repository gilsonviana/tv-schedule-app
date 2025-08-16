/** @type {import('jest').Config} */
const config = {
  preset: "jest-expo",
  setupFiles: ["<rootDir>/jest.setup.js"],
  setupFilesAfterEnv: [
    // "@testing-library/jest-native/extend-expect"
  ],
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!react-native|expo(nent)?|@expo(nent)?/.*|@react-native/.*|react-redux)",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testPathIgnorePatterns: ["/node_modules/", "/android/", "/ios/"],
  watchPathIgnorePatterns: ["/node_modules/", "/android/", "/ios/"],
};

module.exports = config;
