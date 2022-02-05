/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from '@react-navigation/native';
import { Linking } from 'react-native';

import { RootTabParamList } from '../types';

const linking: LinkingOptions<RootTabParamList> = {
  prefixes: ['https://kalalau.page.link'],
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    if (url) {
      return url;
    }
    return 'https://kalalau.page.link';
  },
  subscribe(listener) {
    const onReceiveUrl = ({ url }: { url: string }) => {
      listener(url);
    };
    const unsubscribeFromLinking = Linking.addEventListener(
      'url',
      onReceiveUrl
    );
    const cleanUpSubscriptions = () => unsubscribeFromLinking.remove();
    return cleanUpSubscriptions;
  },
  config: {
    screens: {
      WriteNfc: 'writenfc',
      ReadQr: 'readqr',
    },
  },
};

export default linking;
