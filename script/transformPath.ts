export const transformPath =
  ([origin, target]: [string, string]) =>
  (path: string) => {
    if (path.startsWith(origin)) {
      return path.replace(origin, target);
    }
    return path;
  };
