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

El servidor queda disponible en `http://localhost:3000`.

> Proyecto en desarrollo: la documentación completa de la API se agregará al finalizar la implementación.
