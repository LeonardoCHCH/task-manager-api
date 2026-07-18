import { Module } from '@nestjs/common';
import { TasksResolver } from './tasks.resolver';
import { TasksService } from './tasks.service';

/**
 * Módulo que agrupa todo lo relacionado con la gestión de tareas:
 * el modelo, el servicio con la lógica de negocio y el resolver GraphQL.
 */
@Module({
  providers: [TasksService, TasksResolver],
})
export class TasksModule {}
