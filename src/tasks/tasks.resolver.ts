import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { Task } from './models/task.model';
import { TasksService } from './tasks.service';

/**
 * Resolver que expone las operaciones de tareas en la API GraphQL.
 *
 * Solo traduce las queries y mutations a llamadas al servicio, que es
 * quien contiene la lógica de negocio.
 */
@Resolver(() => Task)
export class TasksResolver {
  constructor(private readonly tasksService: TasksService) {}

  /**
   * Query que devuelve todas las tareas registradas.
   *
   * @returns El listado completo de tareas.
   */
  @Query(() => [Task], {
    name: 'tasks',
    description: 'Devuelve todas las tareas registradas',
  })
  findAll(): Task[] {
    return this.tasksService.findAll();
  }

  /**
   * Query que devuelve una tarea por su identificador.
   *
   * @param id - Identificador único de la tarea.
   * @returns La tarea encontrada.
   */
  @Query(() => Task, {
    name: 'task',
    description: 'Devuelve una tarea por su id',
  })
  findOne(@Args('id', { type: () => ID }) id: string): Task {
    return this.tasksService.findOne(id);
  }

  /**
   * Mutation que crea una nueva tarea.
   *
   * @param input - Datos de la tarea a crear.
   * @returns La tarea creada.
   */
  @Mutation(() => Task, { description: 'Crea una nueva tarea' })
  createTask(@Args('input') input: CreateTaskInput): Task {
    return this.tasksService.create(input);
  }

  /**
   * Mutation que edita una tarea existente. Permite cambiar el título, la
   * descripción, el estado, las etiquetas, el usuario asignado o el proyecto.
   *
   * @param id - Identificador único de la tarea a editar.
   * @param input - Campos a modificar (todos opcionales).
   * @returns La tarea ya actualizada.
   */
  @Mutation(() => Task, { description: 'Edita una tarea existente' })
  updateTask(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateTaskInput,
  ): Task {
    return this.tasksService.update(id, input);
  }

  /**
   * Mutation que elimina una tarea.
   *
   * @param id - Identificador único de la tarea a eliminar.
   * @returns La tarea que fue eliminada.
   */
  @Mutation(() => Task, { description: 'Elimina una tarea' })
  deleteTask(@Args('id', { type: () => ID }) id: string): Task {
    return this.tasksService.remove(id);
  }
}
