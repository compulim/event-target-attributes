test('assume EventTarget do not natively support property-based event listener', () => {
  const eventTarget = new EventTarget();
  const onload = jest.fn();

  (eventTarget as any).onload = onload;
  eventTarget.dispatchEvent(new CustomEvent('load'));

  expect(onload).toHaveBeenCalledTimes(0);
});
