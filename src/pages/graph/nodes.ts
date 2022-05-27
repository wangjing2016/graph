import { G6 } from '@antv/graphin';
import { nodeIcons } from './getNodeIcons';
// https://g6.antv.vision/zh/docs/manual/middle/elements/nodes/custom-node/#gatsby-focus-wrapper
export const formatNodes = (datas: Array<any>, nodeType: any) => {
  for (let v of datas) {
    v.img = nodeIcons[v.nodeType];
    v.imgHoverlight = nodeIcons[v.nodeType + '-hoverlight'];
    v.imgHighlight = nodeIcons[v.nodeType + '-highlight'];
    v.type = nodeType;
    // v.styles = {
    //   // 默认样式
    //   img: v.img,
    // };
    // v.stateStyles = {
    //   hover: {
    //     img: v.imgHover,
    //   },
    //   selected: {
    //     img: v.imgHover,
    //   },
    // };
  }
};
// #定义节点大小
const nodeSize = [35, 35];
export const drawNodes = (cfg: any, group: any) => {
  var size = cfg.size || nodeSize; // 如果没有 size 时的默认大小
  let [width, height] = size;
  const defaultIcon = group.addShape('image', {
    attrs: {
      x: -width / 2,
      y: -height / 2,
      width: width,
      height: height,
      img: cfg.img,
      clipCfg: {
        type: 'circle',
        show: true,
        r: width / 2,
        width: width,
        height: height,
      },
    },
    name: 'icon-shape',
  });
  return defaultIcon;
};

// #设置节点状态及样式
function setHighlightState(
  name: string | undefined,
  value: string | undefined | boolean,
  model: any,
  shape: any,
) {
  if (name === 'dark') {
    if (value) {
      shape.attr({
        img: model?.img,
        opacity: 0.4,
      });
    } else {
      shape.attr({
        img: model?.img,
        opacity: 1,
      });
    }
  }
  if (name === 'hoverlight') {
    console.log('shape', shape);
    if (value === true) {
      shape.attr({
        img: model?.imgHoverlight,
        opacity: 1,
        width: 40,
        height: 40,
      });
    } else {
      shape.attr({
        img: model?.img,
        opacity: 1,
        width: 35,
        height: 35,
      });
    }
  }
  if (name === 'highlight') {
    if (value === true) {
      shape.attr({
        img: model?.imgHighlight,
        opacity: 1,
        width: 40,
        height: 40,
      });
    } else {
      shape.attr({
        img: model?.img,
        opacity: 1,
        width: 35,
        height: 35,
      });
    }
  }
  /**选中状态样式 */
  if (name === 'selected') {
    if (value === true) {
      shape.attr({
        img: model?.imgHighlight,
        opacity: 1,
      });
    } else {
      shape.attr({
        img: model?.img,
        opacity: 1,
      });
    }
  }
}

const lineDash = [4, 2, 1, 2];
export const registerEdge = () => {
  G6.registerEdge(
    'can-running',
    {
      setState(name, value, item) {
        const shape = item?.get('keyShape');
        if (name === 'hoverlight') {
          if (value) {
            shape.attr('stroke', '#a16027');
          } else {
            shape.attr('stroke', '#223b74');
          }
        }
        if (name === 'dark') {
          if (value) {
            shape.attr('stroke', '#0c1f4c');
          } else {
            shape.attr('stroke', '#223b74');
          }
        }
        if (name === 'highlight') {
          if (value) {
            let index = 0;
            shape.attr('stroke', 'green');
            shape.animate(
              () => {
                index++;
                if (index > 9) {
                  index = 0;
                }
                const res = {
                  lineDash,
                  lineDashOffset: -index,
                };
                // return the params for this frame
                return res;
              },
              {
                repeat: true,
                duration: 3000,
              },
            );
          } else {
            shape.stopAnimate();
            shape.attr('lineDash', null);
            shape.attr('stroke', '#223b74');
          }
        }
      },
    },
    'line',
  );
};
export const registerNode = () => {
  G6.registerNode(
    'image-nodes',
    {
      // options: {
      //   size: nodeSize,
      //   style: {
      //     lineWidth: 1,
      //   },
      //   stateStyles: {
      //     highlight: {
      //       attrs: { opacity: 1 },
      //     },
      //     dark: {
      //       attrs: { opacity: 0.2 },
      //     },
      //   },
      // },
      // #画节点样式
      draw: drawNodes,
      // 响应状态变化
      setState(name, value, item) {
        // console.log(name, value, item);
        const model = item?.getModel();
        const group = item?.getContainer();
        const [shape] = group?.get('children'); // 顺序根据 draw 时确定
        setHighlightState(name, value, model, shape);
      },
    },
    'circle',
  );
};
