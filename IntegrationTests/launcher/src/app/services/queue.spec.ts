import { CircularQueue } from './queue';

describe('CircularQueue', () => {
  it('should create an instance', () => {
    expect(new CircularQueue(100)).toBeTruthy();
  });
});
