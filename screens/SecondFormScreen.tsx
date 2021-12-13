import React from 'react';
import { Button, StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
import { FormScreenProps } from '../types';

export default function SecondFormScreen({
  navigation,
}: FormScreenProps<'SecondFormScreen'>) {
  return (
    <View style={styles.container}>
      <Text>Second Form Screen</Text>
      <Button
        title="Done"
        onPress={() => {
          navigation.reset({
            type: 'tab',
            routes: [{ name: 'WriteNfc' }],
          });
        }}
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
