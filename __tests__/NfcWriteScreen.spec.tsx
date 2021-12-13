/**
 * @format
 */

import 'react-native';
import React from 'react';
import NfcWriteScreen from '../screens/NfcWriteScreen';

import { render, waitFor } from '@testing-library/react-native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../types';
import { RouteProp } from '@react-navigation/native';

const navigation = {} as BottomTabNavigationProp<RootTabParamList, 'WriteNfc'>;
const route = {} as RouteProp<RootTabParamList, 'WriteNfc'>;

it('Displays correct status when NFC is available', async () => {
  const { queryByText } = render(
    <NfcWriteScreen navigation={navigation} route={route} />
  );
  await waitFor(() => {
    const nfcStatus = queryByText(
      'NFC functionality is available! Use the form below to write to your tag.'
    );
    expect(nfcStatus).toBeOnTheScreen();
  });
});
