import { AppsInToss } from '@apps-in-toss/framework';
import type { InitialProps } from '@granite-js/react-native';
import { TDSProvider } from '@toss/tds-react-native';
import { PublicLayout } from '@widgets/layouts';
import type { PropsWithChildren } from 'react';

import { context } from '../require.context';

function AppContainer({ children }: PropsWithChildren<InitialProps>) {
  return (
    <TDSProvider>
      <PublicLayout>{children}</PublicLayout>
    </TDSProvider>
  );
}

export default AppsInToss.registerApp(AppContainer, { context });
