import { rm } from 'fs/promises';
import { join } from 'path';

// test.sqlite 테스트 시작전에 항상 삭제
global.beforeEach(async () => {
  try {
    await rm(join(__dirname, '..', 'test.sqlite'));
  } catch (err) {}
});
