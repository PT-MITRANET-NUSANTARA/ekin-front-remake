import stringsData from '@/data/strings';

export function upperFirst(str: string): string {
  const strings = str.split(/\W/g);
  return strings.map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join(' ');
}

export default function strings<T extends keyof typeof stringsData>(key: T, ...args: any[]): (typeof stringsData)[T] {
  const string = stringsData[key];
  const variables = Array.from(string.matchAll(/\$[0-9]+/g)).map((match) => match[0]);
  return variables.reduce((acc, variable) => acc.replace(variable, args[parseInt(variable.slice(1)) - 1]), string) as (typeof stringsData)[T];
}
