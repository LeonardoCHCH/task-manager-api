import { Field, InputType } from '@nestjs/graphql';
import { TaskStatus } from '../models/task.model';

/**
 * Datos para editar una tarea existente.
 *
 * Todos los campos son opcionales: solo se modifican los que se envíen.
 * Esto permite, por ejemplo, cambiar únicamente el estado, las etiquetas
 * o el usuario responsable de la tarea.
 */
@InputType({ description: 'Datos para editar una tarea existente' })
export class UpdateTaskInput {
  /** Nuevo título de la tarea. */
  @Field({ nullable: true, description: 'Nuevo título' })
  title?: string;

  /** Nueva descripción de la tarea. */
  @Field({ nullable: true, description: 'Nueva descripción' })
  description?: string;

  /** Nuevo estado de la tarea dentro del flujo de trabajo. */
  @Field(() => TaskStatus, { nullable: true, description: 'Nuevo estado' })
  status?: TaskStatus;

  /** Nuevo arreglo de etiquetas (reemplaza al anterior). */
  @Field(() => [String], { nullable: true, description: 'Nuevas etiquetas' })
  tags?: string[];

  /** Nuevo usuario responsable de la tarea. */
  @Field({ nullable: true, description: 'Nuevo usuario asignado' })
  assignedUser?: string;

  /** Nuevo proyecto al que pertenece la tarea. */
  @Field({ nullable: true, description: 'Nuevo proyecto' })
  project?: string;
}
