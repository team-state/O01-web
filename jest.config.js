module.exports = {
  preset: 'ts-jest',
  moduleNameMapper: {
    '^@libs/server$': '<rootDir>/libs/server',
    '^@libs/client$': '<rootDir>/libs/client',
    '^@utils/(.*)$': '<rootDir>/utils/$1',
    '^@components/(.*)$': '<rootDir>/components/$1',
    '^@hooks/(.*)$': '<rootDir>/hooks/$1',
    '^@assets/(.*)$': '<rootDir>/public/assets/$1',
    '^@store$': '<rootDir>/store/index',
    '^@store/(.*)$': '<rootDir>/store/$1',
    '^@styles/(.*)$': '<rootDir>/styles/$1',
    '^@constants/(.*)$': '<rootDir>/constants/$1',
    '^@api/(.*)$': '<rootDir>/app/api/$1',
  },
};
