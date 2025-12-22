import { createRoute } from '@granite-js/react-native';
import { ServicePage } from './ui/service';

export const Route = createRoute('/reservation/service', {
  component: Page,
});

function Page() {
  const navigation = Route.useNavigation();
  return <ServicePage navigation={navigation} />;
}
