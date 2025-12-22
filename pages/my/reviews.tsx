import { createRoute, useNavigation } from '@granite-js/react-native';
import { ReviewsPage } from './ui/reviews';

export const Route = createRoute('/my/reviews', {
  component: Page,
});

function Page() {
  const navigation = useNavigation();
  return <ReviewsPage navigation={navigation} />;
}
