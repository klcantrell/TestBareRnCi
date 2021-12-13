import 'react-native-gesture-handler/jestSetup';
import { ReactTestInstance } from 'react-test-renderer';

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};

  return Reanimated;
});

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

expect.extend({
  toBeOnTheScreen(received: ReactTestInstance | null) {
    const message = 'Expected element to be on the screen';
    if (received != null) {
      return {
        pass: true,
        message: () => message,
      };
    } else {
      return {
        pass: false,
        message: () => message,
      };
    }
  },
});

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeOnTheScreen(): R;
    }
  }
}
