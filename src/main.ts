import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * Punto de entrada del servidor.
 *
 * Crea la aplicación de NestJS a partir del módulo raíz y la deja
 * escuchando en el puerto 3000 (o el definido en la variable PORT).
 */
async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000;

  await app.listen(port);
  logger.log(`Servidor iniciado en http://localhost:${port}`);
}

void bootstrap();
