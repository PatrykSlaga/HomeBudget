import { SecureStoreService } from '../services/secureStoreService';


test('pin save/load', async () => {
  await SecureStoreService.setPin('1234');
  const pin = await SecureStoreService.getPin();
  expect(pin).toBe('1234');
});