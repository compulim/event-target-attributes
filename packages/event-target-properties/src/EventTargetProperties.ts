import type { TypedEventListener } from './TypedEventListener';

export default class EventTargetProperties<
  Type extends string = string,
  Map extends { [type in Type]: Event } = { [type in Type]: Event }
> {
  constructor(eventTarget: EventTarget) {
    this.#eventTarget = eventTarget;
  }

  #attributes: { [Key in keyof Map]?: TypedEventListener<Map[Key]> | undefined } = {};
  #defaultListeners: { [Key in keyof Map]?: TypedEventListener<Map[Key]> | undefined } = {};
  #eventTarget: EventTarget;

  getProperty<T extends Type>(type: T): TypedEventListener<Map[T]> | undefined {
    return this.#attributes[type];
  }

  setProperty<T extends Type>(type: T, eventListener: TypedEventListener<Map[T]> | null | undefined) {
    let handler: TypedEventListener<Map[T]> | undefined = this.#defaultListeners[type];

    if (!handler) {
      handler = event => this.#attributes[type]?.(event);
      this.#defaultListeners[type] = handler;
    }

    if (eventListener) {
      this.#eventTarget.addEventListener(type, handler as (event: Event) => void);
      this.#attributes[type] = eventListener;
    } else {
      this.#eventTarget.removeEventListener(type, handler as (event: Event) => void);
      delete this.#attributes[type];
    }
  }
}
