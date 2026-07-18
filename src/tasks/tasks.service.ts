import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { Task, TaskStatus } from './models/task.model';

/**
 * Servicio con la lógica de negocio de las tareas.
 *
 * Las tareas se almacenan en un arreglo en memoria, por lo que los datos
 * se reinician cada vez que se reinicia el servidor.
 */
@Injectable()
export class TasksService {
  /** Logger propio del servicio para registrar las operaciones de negocio. */
  private readonly logger = new Logger(TasksService.name);

  /** Arreglo en memoria que funciona como almacenamiento de las tareas. */
  private readonly tasks: Task[] = [
    {
      id: randomUUID(),
      title: 'Configurar el proyecto',
      description: 'Crear el proyecto de NestJS y configurar GraphQL',
      status: TaskStatus.DONE,
      tags: ['configuracion', 'backend'],
      createdAt: new Date(),
      assignedUser: 'leonardo',
      project: 'task-manager-api',
    },
    {
      id: randomUUID(),
      title: 'Implementar el CRUD de tareas',
      description: 'Crear las queries y mutations para gestionar tareas',
      status: TaskStatus.IN_PROGRESS,
      tags: ['graphql', 'backend'],
      createdAt: new Date(),
      assignedUser: undefined,
      project: 'task-manager-api',
    },
  ];

  /**
   * Devuelve todas las tareas registradas.
   *
   * @returns El arreglo completo de tareas.
   */
  findAll(): Task[] {
    this.logger.log(`Consultando todas las tareas (${this.tasks.length})`);
    return this.tasks;
  }

  /**
   * Busca una tarea por su identificador.
   *
   * @param id - Identificador único de la tarea.
   * @returns La tarea encontrada.
   * @throws {NotFoundException} Si no existe una tarea con ese id.
   */
  findOne(id: string): Task {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) {
      this.logger.warn(`No se encontró la tarea con id ${id}`);
      throw new NotFoundException(`No existe una tarea con el id "${id}"`);
    }
    return task;
  }

  /**
   * Crea una nueva tarea.
   *
   * El servidor asigna el identificador, la fecha de creación y el
   * estado inicial BACKLOG.
   *
   * @param input - Datos de la tarea a crear.
   * @returns La tarea creada.
   */
  create(input: CreateTaskInput): Task {
    const task: Task = {
      id: randomUUID(),
      title: input.title,
      description: input.description,
      status: TaskStatus.BACKLOG,
      tags: input.tags ?? [],
      createdAt: new Date(),
      assignedUser: input.assignedUser,
      project: input.project,
    };

    this.tasks.push(task);
    this.logger.log(`Tarea creada con id ${task.id}`);
    return task;
  }

  /**
   * Edita una tarea existente.
   *
   * Solo se modifican los campos que vengan definidos en el input, lo que
   * permite cambiar únicamente el estado, las etiquetas o el usuario
   * responsable sin afectar el resto de los datos.
   *
   * @param id - Identificador único de la tarea a editar.
   * @param input - Campos a modificar.
   * @returns La tarea ya actualizada.
   * @throws {NotFoundException} Si no existe una tarea con ese id.
   */
  update(id: string, input: UpdateTaskInput): Task {
    const task = this.findOne(id);

    if (input.title !== undefined) task.title = input.title;
    if (input.description !== undefined) task.description = input.description;
    if (input.status !== undefined) task.status = input.status;
    if (input.tags !== undefined) task.tags = input.tags;
    if (input.assignedUser !== undefined)
      task.assignedUser = input.assignedUser;
    if (input.project !== undefined) task.project = input.project;

    this.logger.log(`Tarea ${id} actualizada`);
    return task;
  }

  /**
   * Elimina una tarea.
   *
   * @param id - Identificador único de la tarea a eliminar.
   * @returns La tarea que fue eliminada.
   * @throws {NotFoundException} Si no existe una tarea con ese id.
   */
  remove(id: string): Task {
    const task = this.findOne(id);
    const index = this.tasks.indexOf(task);

    this.tasks.splice(index, 1);
    this.logger.log(`Tarea ${id} eliminada`);
    return task;
  }
}
