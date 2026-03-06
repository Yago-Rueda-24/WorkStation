import type { ComponentType, JSX } from 'react'

export interface ModuleDefinition {
    id: string
    title: string
    description: string
    route: string
    color: string
    shadow: string
    icon: JSX.Element
    component: ComponentType
}
