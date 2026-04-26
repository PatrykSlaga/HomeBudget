import * as SecureStore from 'expo-secure-store';

const PIN_KEY = 'pin';

export const SecureStorageService = {
  async setPin(pin: string) {
    await SecureStore.setItemAsync(PIN_KEY, pin);
  },

  async getPin() {
    return await SecureStore.getItemAsync(PIN_KEY);
  },

  async deletePin() {
    await SecureStore.deleteItemAsync(PIN_KEY);
  },
};