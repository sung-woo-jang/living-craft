import { createRoute } from '@granite-js/react-native';

import { PortfolioIndexPage } from './ui/index/Index';

export const Route = createRoute('/portfolio', {
  component: Page,
});

function Page() {
  const navigation = Route.useNavigation();
  return <PortfolioIndexPage navigation={navigation} />;
}
