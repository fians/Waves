type ElementSelector = string | HTMLElement | HTMLElement[];

export function init(config?: { duration?: number, delay?: number });

export function attach(elements: ElementSelector, classes?: string | string[]);

export function ripple(elements: ElementSelector, option?: { wait?: number, position?: { x: number, y: number }});

export function calm(elements: ElementSelector);
