import { createRoute, useNavigation } from '@granite-js/react-native';

import { NotFoundPage } from './ui/not-found';

export const Route = createRoute('/_404', {
  component: Page,
});

function Page() {
  const navigation = useNavigation();
  return <NotFoundPage navigation={navigation} />;
}
