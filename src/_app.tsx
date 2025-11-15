import React from 'react';
import type { PropsWithChildren } from 'react';
import type { InitialProps } from "@granite-js/react-native";
import { AppsInToss } from '@apps-in-toss/framework';
import { context } from '../require.context';
import { TDSProvider } from '@toss/tds-react-native';
import { PublicLayout } from './widgets/layouts';

function AppContainer({ children }: PropsWithChildren<InitialProps>) {
  return (
    <TDSProvider>
      <PublicLayout>{children}</PublicLayout>
    </TDSProvider>
  );
}

export default AppsInToss.registerApp(AppContainer, { context });