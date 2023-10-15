export const handleWiki = (tuple: any, transformer: any) => (node: any) => {
  const path = node.data.hChildren[0].value;
  if (path.startsWith(tuple[0])) {
    const pathAndPlaceHolder = node.data.hChildren[0].value.split("|");
    if (pathAndPlaceHolder[1]) {
      pathAndPlaceHolder[0] = transformer(pathAndPlaceHolder[0]);
      node.data.hChildren[0].value = pathAndPlaceHolder.join("|");
      node.value = pathAndPlaceHolder.join("|");
      node.data.alias = pathAndPlaceHolder.join("|");
      node.data.permalink = pathAndPlaceHolder.join("|").toLowerCase();
      node.data.hProperties.href = transformer(node.data.hProperties.href);
      return node;
    }
  }
};
