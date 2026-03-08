import type { ModuleRegistration } from './types.frontend'

/**
 * Registro dinámico de módulos para el Frontend (Dashboard, Rutas, Menús).
 * 
 * Utiliza la funcionalidad `import.meta.glob` de Vite para buscar y registrar 
 * automáticamente todos los archivos que terminen en `.module.config.tsx` 
 * dentro de la carpeta `src/modules/`.
 * 
 * **Beneficios:**
 * 1. Cero configuración manual: Las tarjetas del Dashboard se generan automáticamente al crear el archivo config.
 * 2. Aislamiento seguro: Evita importar las clases pesadas del backend (con TypeORM/SQLite),
 *    previniendo que Node.js crashee el entorno del navegador web.
 */
const configFiles = import.meta.glob('../../modules/**/*.module.config.tsx', { eager: true });

export const registeredModules: ModuleRegistration[] = Object.values(configFiles).map((module: any) => {
    // La configuración suele ser la primera exportación del archivo (ej. SysInfoConfig)
    const config = Object.values(module)[0] as any;

    return {
        frontend: config,
        // El backend tirará error si el frontend intenta tocarlo para forzar la separación
        backend: { id: config.id, create: () => { throw new Error('Use backendModules for backend instantiation') } }
    };
});

/** 
 * Extrae y exporta solo la metadata visual.
 * Lo ordena según la propiedad `order` (si existe, asume 99 para enviarlo al final).
 * Se utiliza mapeando este array en `App.tsx` para generar las rutas y en el `Dashboard` para dibujar las tarjetas. 
 */
export const frontendModules = registeredModules
    .map(m => m.frontend)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
