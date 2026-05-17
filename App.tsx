/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { AppProviders } from '@app/providers/AppProviders';
import { RootNavigator } from '@app/navigation/RootNavigator';
import { OnlineGate } from '@app/providers/OnlineGate';


function App() {
  return (
    <AppProviders>
      <OnlineGate>
        <RootNavigator />
      </OnlineGate>
    </AppProviders>
  );
}

export default App;
