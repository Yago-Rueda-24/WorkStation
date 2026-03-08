export interface IHandlerPort {
    readonly prefix: string;
    getHandlers(): Record<string, Function>;
}

export interface IEventPort {
    readonly prefix: string;
    setupEvents(win: any): void;
}

export interface ModuleStaticConfig {
    readonly prefix: string;
    readonly description: string;
    readonly router: string;
}

export abstract class BaseModule implements IHandlerPort {
    // We keep these abstract properties on the instance for backwards compatibility
    // but the actual values will be defined statically to allow frontend registry without instantiation.
    abstract readonly prefix: string;
    abstract readonly description: string;
    abstract readonly router: string;

    abstract getHandlers(): Record<string, Function>;

}