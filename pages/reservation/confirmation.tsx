import { createRoute } from '@granite-js/react-native';

import { ConfirmationPage } from './ui/confirmation';

export const Route = createRoute('/reservation/confirmation', {
  component: Page,
});

function Page() {
  const navigation = Route.useNavigation();
  return <ConfirmationPage navigation={navigation} />;
}
