type ElementSelector = string | HTMLElement | HTMLElement[];

export function init(config?: { duration?: number, delay?: number }): void;

export function attach(elements: ElementSelector, classes?: string | string[]): void;

export function ripple(elements: ElementSelector, option?: { wait?: number, position?: { x: number, y: number }}): void;

export function calm(elements: ElementSelector): void;
