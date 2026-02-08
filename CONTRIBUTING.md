# Guía de Contribución para MinimalStore

¡Gracias por tu interés en contribuir a MinimalStore, un proyecto de **ValBitStudio**! 🎉

Este documento establece las pautas para contribuir al proyecto. Al participar, ayudas a hacer de este e-commerce una mejor herramienta para todos.

## Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [¿Cómo puedo contribuir?](#cómo-puedo-contribuir)
  - [Reportando Errores (Bugs)](#reportando-errores-bugs)
  - [Sugiriendo Mejoras](#sugiriendo-mejoras)
  - [Desarrollo Local](#desarrollo-local)
  - [Envío de Pull Requests](#envío-de-pull-requests)
- [Estándares de Código](#estándares-de-código)
  - [Estructura y Tecnologías](#estructura-y-tecnologías)
  - [Estilos y Linting](#estilos-y-linting)
  - [Commits](#commits)

## Código de Conducta

Este proyecto se adhiere a un código de conducta estándar. Se espera que todos los contribuyentes sean respetuosos, colaborativos y profesionales en todas las interacciones.

## ¿Cómo puedo contribuir?

### Reportando Errores (Bugs)

Si encuentras un error, por favor crea un "Issue" en GitHub detallando:
1.  **Descripción clara** del problema.
2.  **Pasos para reproducir** el error.
3.  **Comportamiento esperado** vs. comportamiento real.
4.  Capturas de pantalla o logs si es aplicable.

### Sugiriendo Mejoras

¡Las ideas son bienvenidas! Abre un "Issue" con la etiqueta `enhancement` o `feature request` explicando tu idea y el valor que aporta al proyecto.

### Desarrollo Local

1.  **Fork y Clonar:**
    Haz un fork del repositorio y clónalo en tu máquina local.
    ```bash
    git clone https://github.com/TU_USUARIO/minimal-store.git
    cd minimal-store
    ```

2.  **Instalar Dependencias:**
    Asegúrate de tener Node.js instalado.
    ```bash
    npm install
    ```

3.  **Variables de Entorno:**
    Configura tu archivo `.env` basándote en `.env.example`.

4.  **Ejecutar:**
    ```bash
    npm run dev
    ```

### Envío de Pull Requests

1.  Crea una nueva rama para tu funcionalidad o corrección:
    ```bash
    git checkout -b feature/mi-nueva-funcionalidad
    ```
2.  Realiza tus cambios.
3.  Asegúrate de que el proyecto compila correctamente:
    ```bash
    npm run build
    ```
4.  Haz commit de tus cambios (ver sección de Commits).
5.  Haz push a tu rama y abre un Pull Request (PR) hacia la rama `main` de este repositorio.
6.  Describe tus cambios en el PR y vincula cualquier Issue relacionado.

## Estándares de Código

### Estructura y Tecnologías

- **React + TypeScript:** Utilizamos componentes funcionales y hooks. Evita el uso de `any` en TypeScript siempre que sea posible.
- **Zustand:** Para el estado global. Mantén la lógica de negocio separada de la UI cuando sea posible.
- **Tailwind CSS:** Utilizamos clases de utilidad para los estilos. Intenta mantener el HTML limpio y extrae componentes reutilizables si las clases se vuelven repetitivas.

### Commits

Recomendamos seguir la convención de **Conventional Commits**:

- `feat:` Para nuevas funcionalidades.
- `fix:` Para corrección de errores.
- `docs:` Para cambios en la documentación.
- `style:` Para cambios de formato o UI.
- `refactor:` Para refactorización de código sin cambios de funcionalidad.

## Licencia

Al contribuir a este proyecto, aceptas que tus contribuciones se licencian bajo la licencia MIT definida en el archivo `LICENSE` (Copyright ValBitStudio).