import { PhoneNumberDisplayPipe } from './phone-number-display.pipe';

describe('PhoneNumberDisplayPipe', () => {
  it('create an instance', () => {
    const pipe = new PhoneNumberDisplayPipe();
    expect(pipe).toBeTruthy();
  });
});
