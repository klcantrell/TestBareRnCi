/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import dynamicLinks, {
  FirebaseDynamicLinksTypes,
} from '@react-native-firebase/dynamic-links';
import { LinkingOptions } from '@react-navigation/native';

import { RootTabParamList } from '../types';

type DynamicLink = FirebaseDynamicLinksTypes.DynamicLink;

const linking: LinkingOptions<RootTabParamList> = {
  prefixes: ['https://kalalau.page.link'],
  async getInitialURL() {
    const dynamicLinkUrl = await dynamicLinks().getInitialLink();
    if (dynamicLinkUrl) {
      return dynamicLinkUrl.url;
    }
    return 'https://kalalau.page.link/writenfc';
  },
  subscribe(listener) {
    const handleDynamicLink = (link: DynamicLink) => {
      listener(link.url);
    };
    return dynamicLinks().onLink(handleDynamicLink);
  },
  config: {
    screens: {
      WriteNfc: 'writenfc',
      ReadQr: 'readqr',
    },
  },
};

export default linking;
