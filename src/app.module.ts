import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { LoggingInterceptor } from './common/logging.interceptor';
import { TasksModule } from './tasks/tasks.module';

/**
 * Módulo raíz de la aplicación.
 *
 * Configura la API GraphQL con enfoque "code-first" (el esquema se genera
 * automáticamente a partir de los decoradores de los modelos y resolvers)
 * y registra el interceptor de logging de forma global, aplicando así el
 * aspecto de logging a toda la aplicación (AOP).
 */
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // El esquema se genera en memoria a partir de los decoradores.
      autoSchemaFile: true,
      // Habilita el playground en http://localhost:3000/graphql
      playground: true,
    }),
    TasksModule,
  ],
  providers: [
    // APP_INTERCEPTOR registra el interceptor globalmente: toda operación
    // GraphQL pasa por el aspecto de logging sin acoplarlo a los resolvers.
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
