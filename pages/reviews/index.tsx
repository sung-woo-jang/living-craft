import { createRoute, useNavigation } from '@granite-js/react-native';

import { ReviewsIndexPage } from './ui/index/Index';

export const Route = createRoute('/reviews', {
  component: Page,
});

function Page() {
  const navigation = useNavigation();
  return <ReviewsIndexPage navigation={navigation} />;
}
