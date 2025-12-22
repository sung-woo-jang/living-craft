import { createRoute } from '@granite-js/react-native';

import { HomePage } from './ui/index/Index';

export const Route = createRoute('/', {
  component: Page,
});

function Page() {
  return <HomePage />;
}
