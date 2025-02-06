export default {
  testEnvironment: "node",
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  moduleFileExtensions: ["js"],
  setupFilesAfterEnv: [
    "/Users/barkinrl/Desktop/dashboard-app/server/tests/setup.js",
  ],
};
