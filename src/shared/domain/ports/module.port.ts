export interface IHandlerPort {
    readonly prefix: string;
    getHandlers(): Record<string, Function>;
}

export interface IEventPort {
    readonly prefix: string;
    setupEvents(win: any): void;
}

export abstract class BaseModule implements IHandlerPort {
    abstract readonly prefix: string;
    abstract getHandlers(): Record<string, Function>;
}