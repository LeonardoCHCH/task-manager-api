import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';

/**
 * Estados posibles de una tarea dentro del flujo de trabajo del proyecto.
 */
export enum TaskStatus {
  /** La tarea está registrada pero aún no se planifica. */
  BACKLOG = 'BACKLOG',
  /** La tarea está planificada y lista para comenzarse. */
  TODO = 'TODO',
  /** La tarea se encuentra en desarrollo. */
  IN_PROGRESS = 'IN_PROGRESS',
  /** La tarea fue completada. */
  DONE = 'DONE',
}

// Registra el enum en el esquema de GraphQL para poder usarlo en los campos.
registerEnumType(TaskStatus, {
  name: 'TaskStatus',
  description: 'Estado actual de una tarea (Backlog, To Do, In Progress, Done)',
});

/**
 * Modelo que representa una tarea de un proyecto de desarrollo de software.
 *
 * Con el enfoque "code-first", los decoradores de esta clase generan
 * automáticamente el tipo `Task` en el esquema de GraphQL.
 */
@ObjectType({ description: 'Tarea de un proyecto de desarrollo de software' })
export class Task {
  /** Identificador único de la tarea (UUID). */
  @Field(() => ID, { description: 'Identificador único de la tarea' })
  id: string;

  /** Título corto que resume la tarea. */
  @Field({ description: 'Título de la tarea' })
  title: string;

  /** Descripción detallada del trabajo a realizar. */
  @Field({ description: 'Descripción detallada de la tarea' })
  description: string;

  /** Estado actual de la tarea dentro del flujo de trabajo. */
  @Field(() => TaskStatus, { description: 'Estado actual de la tarea' })
  status: TaskStatus;

  /** Etiquetas que clasifican la tarea (por ejemplo: "backend", "bug"). */
  @Field(() => [String], { description: 'Etiquetas de la tarea' })
  tags: string[];

  /** Fecha y hora en que se creó la tarea. */
  @Field({ description: 'Fecha de creación de la tarea' })
  createdAt: Date;

  /** Usuario responsable de la tarea. Puede no estar asignado todavía. */
  @Field({ nullable: true, description: 'Usuario asignado a la tarea' })
  assignedUser?: string;

  /** Nombre del proyecto al que pertenece la tarea. */
  @Field({ description: 'Proyecto al que pertenece la tarea' })
  project: string;
}
