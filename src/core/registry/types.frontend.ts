import type { ComponentType, JSX } from 'react'
import type { BackendModuleRegistration } from './types'

/**
 * Clase base abstracta para la configuración del Frontend de un Módulo.
 * 
 * Al heredar de esta clase (`class MiConfig extends BaseFrontendConfig`), 
 * TypeScript obligará a definir los campos críticos (id, title, etc) y 
 * proveerá valores por defecto para los estilos visuales (order, color, shadow),
 * evitando tener que recordarlos todos.
 */
export abstract class BaseFrontendConfig {
    /** Identificador único del módulo (ej. 'tasks'). */
    abstract id: string;

    /** Título que se mostrará en las tarjetas del Dashboard y menús. */
    abstract title: string;

    /** Descripción corta de la funcionalidad del módulo. */
    abstract description: string;

    /** Ruta base del módulo en React Router (ej. '/tasks'). */
    abstract route: string;

    /** Elemento JSX que representa el icono vectorial del módulo. */
    abstract icon: JSX.Element;

    /** Componente principal de React que se renderizará al navegar a la ruta. */
    abstract component: ComponentType;

    // --- Valores por Defecto (Opcionales de Sobrescribir) ---

    /** Define el orden en el Dashboard. (Por defecto 99 para ir al final) */
    order = 99;

    /** Clase de Tailwind para el color principal. (Por defecto gris) */
    color = 'text-slate-400';

    /** Clase de Tailwind para la sombra de hover. (Por defecto gris oscuro) */
    shadow = 'hover:shadow-slate-500/10';
}

/** 
 * Definición completa de un módulo híbrido tal como la ve el Frontend.
 * Combina la información visual con un placeholder de seguridad para el Backend.
 */
export interface ModuleRegistration {
    /** Información visual utilizada por el Dashboard, rutas y menús laterales. */
    frontend: BaseFrontendConfig
    /** 
     * Registro de seguridad del backend. 
     * En el contexto del frontend, lanzar un error asegura que React no intente
     * instanciar clases de Node.js accidentalmente.
     */
    backend?: BackendModuleRegistration
}
