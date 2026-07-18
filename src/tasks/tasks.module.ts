import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';

/**
 * Módulo que agrupa todo lo relacionado con la gestión de tareas:
 * el modelo, el servicio con la lógica de negocio y, próximamente,
 * el resolver GraphQL.
 */
@Module({
  providers: [TasksService],
})
export class TasksModule {}
