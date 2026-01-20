/**
 * 轻量级全局事件工具，基于 window CustomEvent
 */
export type EventHandler<T = any> = (detail: T) => void

export const emitGlobalEvent = <T = any>(eventName: string, detail?: T): void => {
    window.dispatchEvent(new CustomEvent(eventName, { detail }))
}

export const onGlobalEvent = <T = any>(eventName: string, handler: EventHandler<T>): (() => void) => {
    const wrapped = (event: Event) => {
        handler((event as CustomEvent<T>).detail)
    }
    window.addEventListener(eventName, wrapped)
    // 返回卸载函数
    return () => window.removeEventListener(eventName, wrapped)
}
