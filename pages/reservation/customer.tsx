import { createRoute } from '@granite-js/react-native';
import { CustomerPage } from './ui/customer';

export const Route = createRoute('/reservation/customer', {
  component: Page,
});

function Page() {
  const navigation = Route.useNavigation();
  return <CustomerPage navigation={navigation} />;
}
