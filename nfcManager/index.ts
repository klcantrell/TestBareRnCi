import { Alert, Platform } from 'react-native';
import NfcManager, {
  Ndef,
  NfcError,
  NfcEvents,
  NfcTech,
  TagEvent,
} from 'react-native-nfc-manager';

let nfcManagerInitialized = false;

export async function initializeNfcManager(): Promise<boolean> {
  if (!nfcManagerInitialized) {
    const isSupported = await NfcManager.isSupported();
    if (isSupported) {
      nfcManagerInitialized = true;
      await NfcManager.start();
    }
  }
  return nfcManagerInitialized;
}

export function readTag(): Promise<string> {
  const cleanUp = () => {
    NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
    NfcManager.setEventListener(NfcEvents.SessionClosed, null);
  };

  let tagMessage: string | null = null;

  return new Promise((resolve) => {
    NfcManager.setEventListener(
      NfcEvents.DiscoverTag,
      async (tag: TagEvent) => {
        tagMessage =
          Ndef.text.decodePayload(
            tag.ndefMessage[0]?.payload as unknown as Uint8Array
          ) ?? null;
        resolve(tagMessage);
        await NfcManager.setAlertMessage('NFC tag found');
      }
    );

    NfcManager.setEventListener(NfcEvents.SessionClosed, () => {
      cleanUp();
      if (tagMessage == null) {
        resolve('Could not extract payload from NFC tag');
      }
    });

    NfcManager.registerTagEvent();
  });
}

export async function writeTag(value: string) {
  const successMessage = 'Successfully wrote to tag!';
  const failureMessage = 'Writing to tag failed';

  try {
    await NfcManager.requestTechnology(NfcTech.Ndef, {
      alertMessage: 'Ready to write to a tag',
    });

    const bytes = Ndef.encodeMessage([Ndef.textRecord(value)]);

    if (bytes) {
      await NfcManager.ndefHandler.writeNdefMessage(bytes);
      await NfcManager.setAlertMessage(successMessage);
      return successMessage;
    } else {
      return failureMessage;
    }
  } catch (error) {
    if (error instanceof NfcError.UserCancel) {
      console.warn('User canceled NFC write');
      console.log(error);
    } else if (error instanceof NfcError.Timeout) {
      Alert.alert('NFC Session Timeout');
    } else {
      console.warn(error);
      if (Platform.OS === 'ios') {
        NfcManager.invalidateSessionWithErrorIOS(`${error}`);
      } else {
        Alert.alert('NFC Error', `${error}`);
      }
    }
    return failureMessage;
  } finally {
    NfcManager.cancelTechnologyRequest();
  }
}

export async function getBackgroundTag() {
  return NfcManager.getBackgroundTag();
}
