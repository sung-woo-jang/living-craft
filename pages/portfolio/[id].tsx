import { createRoute, useNavigation } from '@granite-js/react-native';

import { DetailPage } from './ui/detail';

export const Route = createRoute('/portfolio/:id', {
  validateParams: (params) => params as { id: string },
  component: Page,
});

function Page() {
  const params = Route.useParams();
  const navigation = useNavigation();
  return <DetailPage navigation={navigation} params={params} />;
}
