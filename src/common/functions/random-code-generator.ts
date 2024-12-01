export function randomCodeGenerator(length?: number): number {
  if (!length) length = 5;
  let max = '9';
  let min = '1';
  for (let index = 1; index < length; index++) {
    max += '0';
    min += '0';
  }
  return Math.floor(Math.random() * parseInt(max)) + parseInt(min);
}
