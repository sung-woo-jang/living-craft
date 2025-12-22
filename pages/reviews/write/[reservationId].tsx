import { createRoute, useNavigation } from '@granite-js/react-native';
import { ReviewWritePage } from './ui/write';

export const Route = createRoute('/reviews/write/:reservationId', {
  validateParams: (params) => params as { reservationId: string },
  component: Page,
});

function Page() {
  const params = Route.useParams();
  const navigation = useNavigation();
  return <ReviewWritePage navigation={navigation} params={params} />;
}
