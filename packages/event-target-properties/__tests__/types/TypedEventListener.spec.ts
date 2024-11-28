import { type TypedEventListener } from '../../src/index';

const _1: TypedEventListener<CustomEvent<'load'>> = (_event: CustomEvent<'load'>) => {};

// @ts-expect-error Type 'CustomEvent<"click">' is not assignable to type 'CustomEvent<"load">'.
const _2: TypedEventListener<CustomEvent<'click'>> = (_event: CustomEvent<'load'>) => {};
