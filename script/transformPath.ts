export const transformPath =
  ([origin, target]: [string, string]) =>
  (path: string) => {
    if (path.startsWith(origin) || path.startsWith(`/${origin}`)) {
      target = `${target}/`;
      return path.replace(origin, target);
    }
    return path;
  };
