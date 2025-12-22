import { createRoute, useNavigation } from '@granite-js/react-native';

import { MyPage } from './ui/index/Index';

export const Route = createRoute('/my', {
  component: Page,
});

function Page() {
  const navigation = useNavigation();
  return <MyPage navigation={navigation} />;
}
