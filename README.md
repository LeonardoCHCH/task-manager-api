# Task Manager API

Taller 3 — Tópicos de Programación (UCAB).

Servidor en **NestJS** que expone una **API GraphQL** para gestionar tareas de proyectos de desarrollo de software: crear tareas, consultar sus datos, cambiar su estado, etiquetas y usuario responsable, y eliminarlas.

## Tecnologías

- [NestJS](https://nestjs.com/) con TypeScript
- GraphQL con Apollo Server (`@nestjs/graphql` + `@nestjs/apollo`), enfoque *code-first*
- Almacenamiento en memoria (los datos se reinician al reiniciar el servidor)

## Instalación y ejecución

```bash
npm install
npm run start:dev
```

El servidor queda disponible en `http://localhost:3000/graphql`, donde también se puede abrir el **playground** de GraphQL para probar las operaciones desde el navegador.

## Modelo de datos

Cada tarea (`Task`) tiene los siguientes campos:

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `ID` | Identificador único (UUID generado por el servidor) |
| `title` | `String` | Título de la tarea |
| `description` | `String` | Descripción detallada |
| `status` | `TaskStatus` | Estado actual: `BACKLOG`, `TODO`, `IN_PROGRESS`, `DONE` |
| `tags` | `[String]` | Arreglo dinámico de etiquetas |
| `createdAt` | `DateTime` | Fecha de creación (asignada por el servidor) |
| `assignedUser` | `String` (nullable) | Usuario responsable de la tarea |
| `project` | `String` | Proyecto al que pertenece la tarea |

## Operaciones disponibles

### Consultar todas las tareas

```graphql
query {
  tasks {
    id
    title
    status
    tags
    createdAt
    assignedUser
    project
  }
}
```

### Consultar una tarea por id

```graphql
query {
  task(id: "AQUI-EL-ID") {
    id
    title
    description
    status
  }
}
```

### Crear una tarea

```graphql
mutation {
  createTask(
    input: {
      title: "Implementar login"
      description: "Agregar autenticación de usuarios"
      tags: ["backend", "seguridad"]
      assignedUser: "maria"
      project: "app-web"
    }
  ) {
    id
    title
    status
    createdAt
  }
}
```

Toda tarea nueva se crea en estado `BACKLOG`, con su `id` y `createdAt` asignados por el servidor.

### Editar una tarea (estado, etiquetas, usuario responsable, etc.)

Todos los campos del `input` son opcionales: solo se modifican los que se envíen.

```graphql
mutation {
  updateTask(
    id: "AQUI-EL-ID"
    input: { status: IN_PROGRESS, tags: ["backend", "urgente"], assignedUser: "pedro" }
  ) {
    id
    status
    tags
    assignedUser
  }
}
```

### Eliminar una tarea

```graphql
mutation {
  deleteTask(id: "AQUI-EL-ID") {
    id
    title
  }
}
```

## Programación Orientada a Aspectos (AOP)

El **logging** de las peticiones es una preocupación transversal (*cross-cutting concern*): aplica a todas las operaciones pero no forma parte de la lógica de negocio de ninguna.

Para no repetir código de logging en cada resolver, se implementó el aspecto en `src/common/logging.interceptor.ts` y se registró **globalmente** mediante el token `APP_INTERCEPTOR` en `src/app.module.ts`. Así, cada operación GraphQL queda envuelta automáticamente por el interceptor, que registra:

- La operación ejecutada (por ejemplo, `Mutation createTask`) y sus argumentos.
- La duración de la operación en milisegundos.
- Los errores, si la operación falla.

Los resolvers y el servicio no saben que están siendo interceptados: la lógica de negocio queda completamente desacoplada del aspecto de logging.

## Logs del servidor

Se usa el `Logger` integrado de NestJS en tres niveles:

- **Arranque** (`src/main.ts`): registra la URL en la que quedó escuchando el servidor.
- **Peticiones** (`src/common/logging.interceptor.ts`): registra cada operación GraphQL, su duración y sus errores.
- **Negocio** (`src/tasks/tasks.service.ts`): registra las operaciones sobre las tareas (creación, edición, eliminación) y las advertencias cuando se consulta un id inexistente.

## Estructura del proyecto

```
src/
├── main.ts                        # Punto de entrada del servidor
├── app.module.ts                  # Módulo raíz: GraphQL + interceptor global
├── common/
│   └── logging.interceptor.ts     # Aspecto de logging (AOP)
└── tasks/
    ├── models/task.model.ts       # Modelo Task y enum TaskStatus
    ├── dto/create-task.input.ts   # Input para crear tareas
    ├── dto/update-task.input.ts   # Input para editar tareas
    ├── tasks.service.ts           # Lógica de negocio (almacenamiento en memoria)
    ├── tasks.resolver.ts          # Queries y mutations de GraphQL
    └── tasks.module.ts            # Módulo de tareas
```

## Flujo de trabajo (GitFlow)

El proyecto se desarrolló usando GitFlow:

- `main`: rama principal, contiene las versiones estables.
- `develop`: rama de integración del trabajo del equipo.
- `feature/*`: una rama por funcionalidad, creada desde `develop` y unida de vuelta con *merge* sin *fast-forward*.
- `release/*`: rama de preparación de la versión final antes de unirla a `main`.
