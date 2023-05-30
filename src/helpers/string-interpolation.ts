type Replacement = { [key: string]: string };

export function stringInterpolate(
  input: string,
  replacement: Replacement,
): string {
  Object.keys(replacement).forEach((key: string) => {
    const regex = new RegExp(key, 'g');
    input = input.replace(regex, replacement[key]);
  });
  return input;
}
