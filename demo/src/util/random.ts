/**
 * Select a random element from a non-empty array.
 *
 * You use this function when you need to pick a random item from a list. The function ensures
 * type safety and throws an error if the array is empty, which helps you avoid subtle bugs
 * related to undefined values. This is especially useful in UI demos, randomized tests, or
 * anywhere you need a simple, reliable way to sample from a set.
 *
 * @template T The type of elements in the input array.
 * @param {T[]} array The array to select a random element from. Must not be empty.
 * @returns {T} A randomly selected element from the array.
 *
 * @throws {Error} If the array is empty.
 *
 * @example
 * ```ts
 * const fruits = ["apple", "banana", "cherry"];
 * const fruit = random(fruits);
 * // fruit is one of "apple", "banana", or "cherry"
 * ```
 *
 * @category Utility
 */
export const random = <T>(array: T[]): T => {
  if (array.length === 0) {
    throw new Error("cannot select a random element from an empty array");
  }
  const index = Math.floor(Math.random() * array.length);
  return array[index];
};
