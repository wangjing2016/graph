const nodeIconsRequire = require.context(
  '../../icons/node-icons',
  true,
  /^\.\/.*\.png$/,
);
let nodeIcons: any = {};
for (let v of nodeIconsRequire.keys()) {
  let key = v.slice(2, -4);
  const src = require('@/icons/node-icons/' + v.slice(2));
  const img = new Image();
  img.src = src;
  nodeIcons[key] = img;
}
export { nodeIcons };
