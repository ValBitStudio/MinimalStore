import { lazy, ComponentType } from 'react';

// Helper para reintentar la carga de componentes lazy (Robustez ante fallos de red)
// Si la carga falla, espera 1 segundo y vuelve a intentar antes de lanzar el error.
export const lazyRetry = (
  componentImport: () => Promise<{ default: ComponentType<any> }>,
  retries = 2, // Número de reintentos
  delay = 1500 // Tiempo de espera en ms
) => {
  return lazy(async () => {
    for (let i = 0; i < retries; i++) {
      try {
        return await componentImport();
      } catch (error) {
        if (i < retries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
    return await componentImport(); // Lanza el error en el último intento si todos fallan
  });
};