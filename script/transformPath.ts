export const transformPath =
  ([origin, target]: [string, string]) =>
  (path: string) => {
    if (path.startsWith(origin) || path.startsWith(`/${origin}`)) {
      if (path.startsWith(`/${origin}`)) {
        path = path.replace("/", "");
        origin = origin.slice(0, -1);
        console.log(origin);

        return path.replace(origin, target);
      } else return path.replace(origin, target);
    }
    return path;
  };
