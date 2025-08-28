# FrontProyecto1basket

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.20.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

# 🏀 Frontend — Marcador de Baloncesto (Angular + PrimeNG)

Aplicación web que simula un **marcador de baloncesto en tiempo real**.  
Permite gestionar **puntos**, **faltas**, **tiempo por cuarto** (con avance **manual/automático**), **colores por equipo** y **guardar automáticamente** el resultado cuando finaliza el partido.

---

## 🧩 Descripción general

- **Marcador** por equipo con botones **+1 / +2 / +3 / −1** (nunca baja de 0).
- **Reloj por cuarto** con duración configurable (8, 10, 12 min), **iniciar / pausar / reiniciar** y **buzzer** al llegar a `00:00`.
- **Cuartos (Q1–Q4)** con **avance automático** opcional (Auto Q+) o **manual** (botón “Siguiente cuarto”).
- **Faltas por equipo** (+/−).
- **Colores por equipo** mediante **color picker** en *overlay*; el color se refleja en el card y el puntaje.
- **Fin del partido (Q4)**: el reloj **se detiene**, suena el buzzer, se muestra **toast** y se envía un **POST** a la API con el resultado final.
- **Reinicio general** para comenzar un nuevo juego (marcador, faltas, cuarto y reloj).

---
