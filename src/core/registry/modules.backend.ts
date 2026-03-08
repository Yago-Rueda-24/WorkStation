import type { BackendModuleRegistration } from './types'

/**
 * Registro dinámico de módulos para el Backend (Main Process).
 * 
 * Utiliza la funcionalidad `import.meta.glob` de Vite para buscar y registrar 
 * automáticamente todas las clases que terminen en `.module.ts` dentro de `src/modules/`.
 * 
 * **Beneficios:**
 * 1. Cero configuración manual: Al crear un nuevo módulo backend, solo necesitas crear su archivo `.module.ts`.
 * 2. Aislamiento seguro: Al no compartir archivos de registro con el frontend, se garantiza
 *    que las dependencias nativas (como TypeORM, SQLite, fs) nunca contaminen el bundle de React.
 */
const moduleFiles = import.meta.glob('../../modules/**/*.module.ts', { eager: true });

export const backendModules: BackendModuleRegistration[] = Object.values(moduleFiles).map((module: any) => {
    // Se asume que la exportación principal (o la primera exportación) es la clase del módulo
    const ModuleClass = Object.values(module)[0] as any;
    const instance = new ModuleClass();

    return {
        id: instance.prefix,
        create: () => instance
    };
});
