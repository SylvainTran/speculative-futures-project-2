import { Friend } from './friend';

describe('Friend', () => {
  it('should create an instance', () => {
    expect(new Friend("Test", "Online")).toBeTruthy();
  });
});
