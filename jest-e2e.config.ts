import { Config } from 'jest';
import jestConfig from './jest.config';

const configE2E: Config = {
  ...jestConfig,
  testEnvironment: './test/setup-e2e.ts',
  testRegex: '.*\\.e2e-spec\\.ts$',
};

export default configE2E;
