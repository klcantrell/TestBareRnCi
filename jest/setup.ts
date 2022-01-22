import { ReactTestInstance } from 'react-test-renderer';

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
