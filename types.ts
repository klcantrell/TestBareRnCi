/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootTabParamList {}
  }
}

export type RootTabParamList = {
  WriteNfc: undefined;
  ReadQr: undefined;
  StackedFormScreen: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  BottomTabScreenProps<RootTabParamList, Screen>;

export type FormScreenStackParamList = {
  FirstFormScreen: undefined;
  SecondFormScreen: undefined;
};

export type FormScreenProps<Screen extends keyof FormScreenStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<FormScreenStackParamList, Screen>,
    BottomTabScreenProps<RootTabParamList, 'StackedFormScreen'>
  >;
