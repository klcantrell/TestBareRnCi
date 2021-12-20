import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';

import App from './App';
import { store } from './state/store';
import { name as appName } from './app.json';
import { RealmProvider } from './state/realmContext';

const AppWithContext = () => (
  <Provider store={store}>
    <RealmProvider>
      <App />
    </RealmProvider>
  </Provider>
);

AppRegistry.registerComponent(appName, () => AppWithContext);
