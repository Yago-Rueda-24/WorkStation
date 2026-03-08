import type { BaseModule } from '../../shared/domain/ports/module.port'

/**
 * Representa la fábrica de un módulo del backend.
 * 
 * Se utiliza exclusivamente en el Main Process (Node.js) de Electron.
 * Al estar separada de los tipos del frontend, garantiza que el backend
 * nunca intente importar accidentalmente componentes de React o APIs del DOM,
 * lo cual causaría un error "window is not defined".
 */
export interface BackendModuleRegistration {
    /** Identificador único del módulo (ej. 'tasks'). Debe coincidir con el ID del frontend. */
    id: string
    /** 
     * Función fábrica que instancia la clase del módulo backend. 
     * Se llama durante el arranque de la aplicación en `main.ts`.
     */
    create: () => BaseModule
}
