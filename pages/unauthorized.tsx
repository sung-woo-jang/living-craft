import { createRoute, useNavigation } from '@granite-js/react-native';

import { UnauthorizedPage } from './ui/unauthorized';

export const Route = createRoute('/unauthorized', {
  component: Page,
});

function Page() {
  const navigation = useNavigation();
  return <UnauthorizedPage navigation={navigation} />;
}
