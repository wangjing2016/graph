import { G6, Graph } from '@antv/graphin';
import datas from './datas';
import { setHoverHighlight, setHoverHighlightWithExclueds } from './hoverlight';
import { registerNode, formatNodes } from './nodes';
import {
  refreshDragedNodePosition,
  clearAllStats,
  clearAllStatsWithExcludes,
  deLightPath,
} from './tools';
import { setPathHighlight } from './setPathHighlight';
import { addNode } from './components/OperationPanel/operation';
// 元素增加图标
// 高亮元素
// 移动画布到具体位置：focusItem
// 查找元素graph.findAll(type, fn)
// 改变元素状态graph.setItemState('node1', 'selected', true);
// 清除元素状态graph.clearItemStates(item, states)
let graph: Graph;
function graphCreater(container: HTMLElement) {
  const width = container.scrollWidth;
  const height = container.scrollHeight || 500;

  // #关系图配置
  graph = new G6.Graph({
    container: 'container',
    width,
    height,
    groupByTypes: false, // #决定层级是否可以被改变toFront toBack
    layout: {
      type: 'force',
      preventOverlap: true,
      // kr: 80, //斥力
      // kg: 2, //收缩力
      // tao: 0.3,
      // barnesHut: true,
      // dissuadeHubs: false,
      nodeSize: (d: any) => {
        // console.log('nodeSize', d);
        return 10;
      },
      nodeSpacing: (d: any) => {
        // console.log('nodeSpacing', d);
        return 15;
      },
      // getMass: (d) => {
      //   console.log('getMass', d);
      //   return 0;
      // },
      // coulombDisScale: (d) => {
      //   console.log('coulombDisScale', d);
      //   return 500;
      // },
      gravity: (d: any) => {
        // console.log('gravity', d);
        return 5;
      },
      // getCenter() {
      //   return [50, 50, 50];
      // },
      nodeStrength: (d) => {
        // if (d.isLeaf) {
        //   return -50;
        // }
        return -200; // 调整节点之间的距离，簇和簇之间距离越大
      },
    },
    defaultNode: {
      style: {
        fill: '#213b57',
      },
    },
    defaultEdge: {
      style: {
        stroke: '#223b74',
        lineWidth: 1,
      },
    },
    /*modes: {
      default: ['zoom-canvas', 'drag-canvas'],
    },*/
    modes: {
      default: ['zoom-canvas', 'drag-canvas', 'click-select'],
      altSelect: [
        {
          type: 'click-select',
          trigger: 'alt',
        },
        'drag-node',
      ],
    },

    // #设置边状态及样式
    edgeStateStyles: {
      hoverlight: {
        stroke: '#a16027',
      },
      highlight: {
        stroke: 'green',
      },
      dark: {
        stroke: '#0c1f4c',
      },
    },
  });

  // #自定义节点类型
  registerNode();

  // #初始化节点数据
  let { nodes, edges } = datas;
  formatNodes(nodes, 'image-nodes');

  // #加载数据
  graph.data({
    nodes,
    edges: edges.map(function (edge: any, i) {
      edge.id = 'edge' + i;
      return Object.assign({}, edge);
    }),
  });

  // #渲染
  graph.render();

  // 高亮路径
  interface highlightPathType {
    nodes: Array<any>;
    edges: Array<any>;
  }
  let htpath: highlightPathType = {
    nodes: [],
    edges: [],
  };
  setTimeout(() => {
    setPathHighlight(graph, htpath, '10138');
    setTimeout(() => {
      setPathHighlight(graph, htpath, '10029');
      // deLightPath(graph, htpath);
      setTimeout(() => {
        setPathHighlight(graph, htpath, '219');
        setTimeout(() => {
          deLightPath(graph, htpath);
        }, 12000);
      }, 6000);
    }, 6000);
  }, 8000);
  // 被拖拽的元素在目标元素上同时鼠标放开触发的事件
  graph.on('drop', function (e: any) {
    const { originalEvent } = e;

    if (originalEvent.dataTransfer) {
      const transferData = originalEvent.dataTransfer.getData('dragComponent');

      if (transferData) {
        console.log('transferData', transferData);
        addNode(graph, transferData, e);
      }
    }
  });
  // #鼠标悬浮事件
  graph.on('node:mouseenter', function (e: any) {
    // #战法命中高亮存在时，鼠标hover对节点的改动被禁用
    // if (htpath.nodes.length === 0) {
    // setHoverHighlight(e, graph, 'hoverlight');
    // }
    setHoverHighlightWithExclueds(e, graph, 'hoverlight', [
      'highlight',
      'selected',
    ]);
  });
  graph.on('node:mouseleave', () => {
    // #战法命中高亮存在时，鼠标hover对节点的改动被禁用
    // if (htpath.nodes.length === 0) {
    // clearAllStats(graph);
    // }
    console.log(htpath);
    clearAllStatsWithExcludes(graph, ['highlight', 'selected'], htpath);
  });
  // #边点击事件
  graph.on('edge:click', (e) => {
    console.log('edge:click', e);
  });
  // #节点点击事件
  graph.on('node:click', (e) => {
    console.log('node:click', e);
  });
  // #画布点击事件
  graph.on('canvas:click', () => {});
  // #拖拽事件
  graph.on('node:dragstart', function (e) {
    graph.layout();
    refreshDragedNodePosition(e);
  });
  graph.on('node:drag', function (e) {
    refreshDragedNodePosition(e);
  });
  graph.on('node:dragend', function (e: any) {
    e.item.get('model').fx = null;
    e.item.get('model').fy = null;
  });

  // #窗口自适应
  if (typeof window !== 'undefined')
    window.onresize = () => {
      if (!graph || graph.get('destroyed')) return;
      if (!container || !container.scrollWidth || !container.scrollHeight)
        return;
      graph.changeSize(container.scrollWidth, container.scrollHeight);
    };
}

export default graphCreater;

export { graph };
