// Backend-safe exports (no React/JSX dependencies)
export type { BackendModuleRegistration } from './types'
export { backendModules } from './modules.backend'

// Frontend exports (React/JSX — only import in renderer process)
export type { ModuleRegistration } from './types.frontend'
export { BaseFrontendConfig } from './types.frontend'
export { registeredModules, frontendModules } from './modules.tsx'
