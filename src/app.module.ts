import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TasksModule } from './tasks/tasks.module';

/**
 * Módulo raíz de la aplicación.
 *
 * Configura la API GraphQL con enfoque "code-first" (el esquema se genera
 * automáticamente a partir de los decoradores de los modelos y resolvers)
 * y registra el módulo de tareas.
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
})
export class AppModule {}
