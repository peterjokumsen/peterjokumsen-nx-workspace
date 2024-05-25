export function pjFilterMap<T, U>(
  elements: U[],
  filter: (element: U) => boolean,
  map: (element: U) => T,
): T[] {
  const result: T[] = [];
  for (let i = 0; i < elements.length; i++) {
    if (filter(elements[i])) {
      result.push(map(elements[i]));
    }
  }

  return result;
}
