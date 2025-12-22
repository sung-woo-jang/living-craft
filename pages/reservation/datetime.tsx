import { createRoute } from '@granite-js/react-native';

import { DateTimePage } from './ui/datetime';

export const Route = createRoute('/reservation/datetime', {
  component: Page,
});

function Page() {
  const navigation = Route.useNavigation();
  return <DateTimePage navigation={navigation} />;
}
