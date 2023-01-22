import { NestFactory } from '@nestjs/core';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { AppModule } from './app.module';
import { API_GATEWAY_PORT, API_PREFIX, APIS_HASH_MAP } from '../config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const apisHashMap = JSON.parse(APIS_HASH_MAP);
  const apisEntries = Object.entries(apisHashMap);

  const getServiceUrl = (hostPort: string) => `http://${hostPort}`;
  const getRoute = (route: string) => `/${API_PREFIX}/${route}`;

  app.setGlobalPrefix(API_PREFIX);

  apisEntries.forEach(([route, hostPort]) => {
    app.use(
      createProxyMiddleware(getRoute(route),{
        target: getServiceUrl(hostPort as string),
        changeOrigin: true,
      }),
      createProxyMiddleware('/socket.io',{
        ws: true,
        target: getServiceUrl(hostPort as string),
        changeOrigin: true,
      })
    )
  })

  await app.listen(API_GATEWAY_PORT);
}
bootstrap();
