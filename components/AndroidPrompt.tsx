import React, { useState } from 'react';
import { Text, View, Animated, StyleSheet, Modal, Button } from 'react-native';
import NfcManager from 'react-native-nfc-manager';

interface Props {
  show: boolean;
  message: string;
  onCancel: () => void;
}

function NfcPromptAndroid({ show, message, onCancel }: Props) {
  const [visible, setVisible] = useState(show);
  const animValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      setVisible(true);
      Animated.timing(animValue, {
        duration: 300,
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animValue, {
        duration: 200,
        toValue: 0,
        useNativeDriver: true,
      }).start(() => {
        setVisible(false);
      });
    }
  }, [visible, animValue]);

  function cancelNfcScan() {
    NfcManager.cancelTechnologyRequest();
    setVisible(false);
    onCancel();
  }

  const bgAnimStyle = {
    backgroundColor: 'rgba(0,0,0,0.3)',
    opacity: animValue,
  };

  const promptAnimStyle = {
    transform: [
      {
        translateY: animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [300, 0],
        }),
      },
    ],
  };

  return (
    <Modal transparent={true} visible={visible}>
      <View style={[styles.wrapper]}>
        <View style={{ flex: 1 }} />
        <Animated.View style={[styles.prompt, promptAnimStyle]}>
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>{message}</Text>
          </View>
          <Button onPress={cancelNfcScan} title="Cancel" />
        </Animated.View>
        <Animated.View style={[styles.promptBg, bgAnimStyle]} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  promptBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  prompt: {
    height: 300,
    alignSelf: 'stretch',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    margin: 20,
    zIndex: 2,
  },
});

export default NfcPromptAndroid;
