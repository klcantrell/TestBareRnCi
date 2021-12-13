import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

export default function QrReadScreen(_props: RootTabScreenProps<'ReadQr'>) {
  return (
    <View style={styles.container}>
      <Text>HI HI HI</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  resultContainer: {
    width: '100%',
    alignItems: 'center',
  },
});
