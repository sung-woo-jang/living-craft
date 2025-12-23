import { createRoute } from '@granite-js/react-native';

import { ServicePage } from './ui/service';

export interface ServicePageParams {
  serviceId?: string;
}

export const Route = createRoute('/reservation/service', {
  validateParams: (params): ServicePageParams => {
    const rawParams = params as Record<string, unknown> | undefined;
    return {
      serviceId:
        typeof rawParams?.serviceId === 'string'
          ? rawParams.serviceId
          : typeof rawParams?.serviceId === 'number'
            ? String(rawParams.serviceId)
            : undefined,
    };
  },
  component: Page,
});

function Page() {
  const navigation = Route.useNavigation();
  const params = Route.useParams();
  return <ServicePage navigation={navigation} params={params} />;
}
