/// <reference types="jest" />

import EventTargetProperties from './EventTargetProperties';
import { type TypedEventListener } from './TypedEventListener';

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

let onload: jest.Mocked<(event: CustomEvent) => void>;
let myEventTarget: MyEventTarget;

beforeEach(() => {
  onload = jest.fn();
  myEventTarget = new MyEventTarget();
});

describe('after assign', () => {
  beforeEach(() => {
    myEventTarget.onload = onload;
  });

  test('dispatchEvent should call onload', () => {
    const event = new CustomEvent('load');

    myEventTarget.dispatchEvent(event);

    expect(onload).toHaveBeenCalledTimes(1);
    expect(onload).toHaveBeenNthCalledWith(1, event);
  });

  describe('and unassign', () => {
    beforeEach(() => {
      myEventTarget.onload = undefined;
    });

    test('dispatchEvent should not call onload', () => {
      const event = new CustomEvent('load');

      myEventTarget.dispatchEvent(event);

      expect(onload).toHaveBeenCalledTimes(0);
    });
  });
});

describe('check dispatch order with assignment only', () => {
  let order: number[];

  beforeEach(() => {
    order = [];

    myEventTarget.addEventListener('load', () => order.push(1));
    myEventTarget.onload = () => order.push(2);
    myEventTarget.addEventListener('load', () => order.push(3));
    myEventTarget.addEventListener('load', () => order.push(4));
  });

  test('should dispatch in correct order', () => {
    myEventTarget.dispatchEvent(new CustomEvent('load'));

    expect(order).toEqual([1, 2, 3, 4]);
  });
});

describe('check dispatch order with assignment and unassignment', () => {
  let order: number[];

  beforeEach(() => {
    order = [];

    myEventTarget.addEventListener('load', () => order.push(1));
    myEventTarget.onload = () => order.push(-1);
    myEventTarget.addEventListener('load', () => order.push(2));
    myEventTarget.onload = undefined;
    myEventTarget.addEventListener('load', () => order.push(3));
    myEventTarget.onload = () => order.push(4);
  });

  test('should dispatch in correct order', () => {
    myEventTarget.dispatchEvent(new CustomEvent('load'));

    expect(order).toEqual([1, 2, 3, 4]);
  });
});

describe('check stopImmediatePropagation', () => {
  let order: number[];

  beforeEach(() => {
    order = [];

    myEventTarget.addEventListener('load', event => {
      event.stopImmediatePropagation();
      order.push(1);
    });
    myEventTarget.onload = () => order.push(-1);
    myEventTarget.addEventListener('load', () => order.push(-2));
  });

  test('should not call after stopImmediatePropagation', () => {
    myEventTarget.dispatchEvent(new CustomEvent('load'));

    expect(order).toEqual([1]);
  });
});

describe('check preventDefault', () => {
  beforeEach(() => {
    myEventTarget.onload = event => event.preventDefault();
  });

  test('should return false', () => {
    const result = myEventTarget.dispatchEvent(new CustomEvent('load', { cancelable: true }));

    expect(result).toBe(false);
  });
});
