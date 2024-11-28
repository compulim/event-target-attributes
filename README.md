# `event-target-properties`

Adds `onevent` property to [`EventTarget`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget) objects.

## Background

[`EventTarget`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget) is the official interface for objects which dispatch events and listeners to receive events.

Conventionally, in HTML, there are two types of event listeners:

- [`addEventListener`/`removeEventListener` functions](https://developer.mozilla.org/en-US/docs/Web/Events/Event_handlers#eventtarget.addeventlistener)
- [`onevent` properties](https://developer.mozilla.org/en-US/docs/Web/Events/Event_handlers#using_onevent_properties)

However, `EventTarget` only offers `addEventListener`/`removeEventListener` functions, but not `onevent` properties.

This package enables `onevent` properties for objects that extends `EventTarget`.

## How to use

The following code snippet adds `onload` property to an event target.

```ts
import { EventTargetProperties, type TypedEventListener } from 'event-target-properties';

class MyEventTarget extends EventTarget {
  constructor() {
    super();

    this.#eventTargetProperties = new EventTargetProperties(this);
  }

  #eventTargetProperties: EventTargetProperties<'load', { load: CustomEvent }>;

  get onload(): TypedEventListener<CustomEvent> | undefined {
    return this.#eventTargetProperties.getProperty('load');
  }

  set onload(value: TypedEventListener<CustomEvent> | null | undefined) {
    this.#eventTargetProperties.setProperty('load', value);
  }
}
```

## Behaviors

### The order of event listeners

> According to [HTML Living Standard](https://html.spec.whatwg.org/multipage/webappapis.html#event-handler-attributes).

The `onevent` property can be polyfilled via `addEventListener`/`removeEventListener` and follow the order designated by `EventTarget` class.

- When the property is currently unassigned and being assigned, the event listener will be registered via `addEventListener`
- When the property is currently assigned and being unassigned, it will be unregistered via `removeEventListener`
- When the property is currently assigned and being assigned to another value, the event listener will not be re-registered again. Thus, the order of property event listener will be preserved

## Contributions

Like us? [Star](https://github.com/compulim/event-target-properties/stargazers) us.

Want to make it better? [File](https://github.com/compulim/event-target-properties/issues) us an issue.

Don't like something you see? [Submit](https://github.com/compulim/event-target-properties/pulls) a pull request.
