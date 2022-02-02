import React, { useCallback, useState } from 'react';
import {
  View,
  Linking,
  Vibration,
  ViewStyle,
  ViewProps,
  Text,
  Button,
} from 'react-native';
import {
  BarCodeScannedCallback,
  BarCodeScanner,
  PermissionStatus,
} from 'expo-barcode-scanner';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { RootTabScreenProps } from '../types';

export default function QrReadScreen(_props: RootTabScreenProps<'ReadQr'>) {
  const [activate, setActivate] = useState(false);
  const [cameraPermission, requestCameraPermissions] =
    BarCodeScanner.usePermissions();
  const [dataScanned, setDataScanned] = useState(false);

  const insets = useSafeAreaInsets();

  const handleBarCodeScanned: BarCodeScannedCallback = async ({ data }) => {
    setDataScanned(true);
    if (
      data.startsWith('kalalau.page.link') &&
      (await Linking.canOpenURL(data))
    ) {
      Vibration.vibrate();
      await Linking.openURL(data);
    } else {
      setDataScanned(false);
    }
  };

  async function activateScanning() {
    setActivate(true);
    await requestCameraPermissions();
  }

  useFocusEffect(
    useCallback(() => {
      const unmountCameraOnBlur = () => {
        setDataScanned(false);
        setActivate(false);
      };
      return unmountCameraOnBlur;
    }, [setActivate, setDataScanned])
  );

  useFocusEffect(
    useCallback(() => {
      if (cameraPermission?.status === PermissionStatus.GRANTED && !activate) {
        setActivate(true);
      }
    }, [cameraPermission?.status, activate])
  );

  const containerStyle: ViewStyle = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: insets.top,
    paddingLeft: insets.left,
    paddingRight: insets.right,
    paddingBottom: insets.bottom,
  };

  if (
    cameraPermission === null ||
    cameraPermission.status === PermissionStatus.UNDETERMINED
  ) {
    return (
      <PermissionsInstructions
        style={containerStyle}
        instructionText="...or let use use your camera to scan the QR code from this tab"
        actionButtonText="Allow Camera Permissions"
        onActionButtonPressed={activateScanning}
      />
    );
  }

  if (cameraPermission.status === PermissionStatus.GRANTED && !activate) {
    return null;
  }

  if (cameraPermission.status === PermissionStatus.DENIED) {
    return (
      <PermissionsInstructions
        style={containerStyle}
        instructionText="...or give us camera permissions to scan the QR code from this tab"
        actionButtonText="Go to Permission Settings"
        onActionButtonPressed={Linking.openSettings}
      />
    );
  }

  return (
    <View style={containerStyle}>
      <Text>QR scan</Text>
      <Text
        style={{
          textAlign: 'center',
        }}>
        Scan the QR code on the screen
      </Text>
      <View
        style={{
          width: '90%',
          flex: 1,
          overflow: 'hidden',
        }}>
        <BarCodeScanner
          onBarCodeScanned={dataScanned ? undefined : handleBarCodeScanned}
          style={{ width: '100%', flex: 1 }}
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        />
      </View>
    </View>
  );
}

function PermissionsInstructions({
  instructionText,
  actionButtonText,
  onActionButtonPressed,
  style,
}: {
  instructionText: string;
  actionButtonText: string;
  onActionButtonPressed: () => void;
} & ViewProps) {
  return (
    <View style={style}>
      <Text>QR scan</Text>
      <Text
        style={{
          textAlign: 'center',
        }}>
        {instructionText}
      </Text>
      <Button onPress={onActionButtonPressed} title={actionButtonText} />
    </View>
  );
}
