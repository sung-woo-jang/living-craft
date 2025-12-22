import { createRoute, useNavigation } from '@granite-js/react-native';
import { ReservationsPage } from './ui/reservations';

export const Route = createRoute('/my/reservations', {
  component: Page,
});

function Page() {
  const navigation = useNavigation();
  return <ReservationsPage navigation={navigation} />;
}
