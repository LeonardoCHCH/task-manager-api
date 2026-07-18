import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Interceptor que implementa el aspecto de logging (AOP).
 *
 * El logging de las peticiones es una preocupación transversal
 * (cross-cutting concern): no forma parte de la lógica de negocio, pero
 * aplica a todas las operaciones. En lugar de repetir el código de logging
 * en cada resolver, este interceptor se registra una sola vez de forma
 * global (ver `app.module.ts`) y envuelve automáticamente cada operación
 * GraphQL, registrando su inicio, sus argumentos, su duración y sus errores.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  /** Logger con el que se escriben los registros de cada operación. */
  private readonly logger = new Logger(LoggingInterceptor.name);

  /**
   * Envuelve la ejecución de cada operación GraphQL con logging.
   *
   * @param context - Contexto de ejecución de NestJS.
   * @param next - Manejador que continúa con la operación interceptada.
   * @returns El observable de la operación, con logging de éxito o error.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    // Este servidor solo expone GraphQL, pero por seguridad se ignoran
    // los contextos que no lo sean (por ejemplo, peticiones HTTP planas).
    if (context.getType<GqlContextType>() !== 'graphql') {
      return next.handle();
    }

    const gqlContext = GqlExecutionContext.create(context);
    const info = gqlContext.getInfo<GraphQLResolveInfo>();
    const args: Record<string, unknown> = gqlContext.getArgs();

    // Ejemplo: "Query tasks" o "Mutation createTask".
    const operation = `${info.parentType.name} ${info.fieldName}`;
    const startedAt = Date.now();

    this.logger.log(`${operation} | argumentos: ${JSON.stringify(args)}`);

    return next.handle().pipe(
      tap({
        next: () =>
          this.logger.log(
            `${operation} | completada en ${Date.now() - startedAt} ms`,
          ),
        error: (error: Error) =>
          this.logger.error(
            `${operation} | falló en ${Date.now() - startedAt} ms: ${error.message}`,
          ),
      }),
    );
  }
}
