import React from 'react';
import { Button, StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
import { FormScreenProps } from '../types';

export default function FirstFormScreen({
  navigation,
}: FormScreenProps<'FirstFormScreen'>) {
  return (
    <View style={styles.container}>
      <Text>First Form Screen</Text>
      <Button
        title="Go to next screen"
        onPress={() => navigation.push('SecondFormScreen')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
