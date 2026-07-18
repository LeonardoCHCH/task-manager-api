import { Field, InputType } from '@nestjs/graphql';

/**
 * Datos necesarios para crear una nueva tarea.
 *
 * El identificador, la fecha de creación y el estado inicial (BACKLOG)
 * los asigna automáticamente el servidor, por lo que no se piden aquí.
 */
@InputType({ description: 'Datos para crear una nueva tarea' })
export class CreateTaskInput {
  /** Título corto que resume la tarea. */
  @Field({ description: 'Título de la tarea' })
  title: string;

  /** Descripción detallada del trabajo a realizar. */
  @Field({ description: 'Descripción detallada de la tarea' })
  description: string;

  /** Etiquetas iniciales de la tarea. Si no se envían, queda vacío. */
  @Field(() => [String], {
    nullable: true,
    description: 'Etiquetas de la tarea (opcional)',
  })
  tags?: string[];

  /** Usuario responsable de la tarea (opcional al crearla). */
  @Field({ nullable: true, description: 'Usuario asignado (opcional)' })
  assignedUser?: string;

  /** Nombre del proyecto al que pertenece la tarea. */
  @Field({ description: 'Proyecto al que pertenece la tarea' })
  project: string;
}
