export const transformPath =
  ([origin, target]: [string, string]) =>
  (path: string) => {
    if (path.startsWith(origin) || path.startsWith(`/${origin}`)) {
      return path.replace(origin, target);
    }
    if (path.startsWith("#")) {
      return path.replace(origin, target);
    }
    return path;
  };
