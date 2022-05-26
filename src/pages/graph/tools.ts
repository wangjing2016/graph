// #刷新姐点位置
export function refreshDragedNodePosition(e: any) {
  const model = e.item.get('model');
  model.fx = e.x;
  model.fy = e.y;
}

// #清除所有几点状态
export function clearAllStats(graph: any) {
  graph.setAutoPaint(false);
  graph.getNodes().forEach(function (node: any) {
    graph.clearItemStates(node);
  });
  graph.getEdges().forEach(function (edge: any) {
    graph.clearItemStates(edge);
  });
  graph.paint();
  graph.setAutoPaint(true);
}

// #清除所有几点状态
export function clearAllStatsWithExcludes(
  graph: any,
  excludes: Array<string>,
  htpath: highlightPathType,
) {
  graph.setAutoPaint(false);
  // console.log(htpath);

  graph.getNodes().forEach(function (node: any) {
    if (!hasStates(node, excludes)) {
      graph.clearItemStates(node);
      if (htpath.nodes.length > 0) {
        graph.setItemState(node, 'dark', true);
      } else {
        graph.setItemState(node, 'dark', false);
      }
    }
  });
  graph.getEdges().forEach(function (edge: any) {
    if (!hasStates(edge, excludes)) {
      graph.clearItemStates(edge);
      if (htpath.nodes.length > 0) {
        graph.setItemState(edge, 'dark', true);
      } else {
        graph.setItemState(edge, 'dark', false);
      }
    }
  });
  graph.paint();
  graph.setAutoPaint(true);
}

// #延时执行函数
let debounceId: any = undefined;
export function debounce(cb: Function, delay: number, params?: any): void {
  if (debounceId) {
    window.clearTimeout(debounceId);
  }
  debounceId = setTimeout(() => {
    cb(params);
    window.clearTimeout(debounceId);
    debounceId = null;
  }, delay);
}

// #获取单链路节点
// #通过传入节点id,找到target与节点id匹配的边，找到边后将边的source节点id，作为下一次查找过程的参数传入，继续与所有边的target节点id进行匹配，匹配成功同时将该次的边节点和source节点存储到结果集中，然后再次进行递归查找，直到找出所有符合条件的边
export function getSingleNodePath(
  sourceId: string,
  edges: Array<any>,
  res: any,
) {
  // #遍历边找到符合条件的边，条件是：前次的source作为这次的target
  const edge = edges.find((e) => {
    const { target } = e.getModel();
    // #验证target节点
    if (target === sourceId) {
      return true;
    } else {
      return false;
    }
  });
  // #遍历边找到target与传入的source节点id匹配的点
  if (edge) {
    res.edges.push(edge);
    const { source } = edge.getModel();
    // res.nodes.push(edge.getTarget());
    res.nodes.push(edge.getSource());
    getSingleNodePath(source, edges, res);
  }
}
// #移动节点位置
interface nodePostion {
  x: number;
  y: number;
}
export function moveNodeToPosition(
  graph: any,
  node: any,
  position: nodePostion,
): void;
export function moveNodeToPosition(graph: any, node: any): void;
export function moveNodeToPosition(
  graph: any,
  node: any,
  position?: nodePostion,
): void {
  // #未传入position视为，移动到中心点
  if (typeof position === 'undefined') {
    console.log(node.getBBox());
    let { centerX, centerY } = node.getBBox();
    graph.focusItem(node, true, {
      easing: 'easeCubic',
      duration: 1000,
      callback() {
        console.log(graph.getZoom());
        graph.zoomTo(0.5, { x: centerX, y: centerX }, true, {
          duration: 800,
        });
      },
    });
  } else {
    let { x, y } = position;
    graph.moveTo(x, y, true, {
      easing: 'easeCubic',
      duration: 1000,
      callback() {
        console.log(graph.getZoom());
        graph.zoomTo(0.5, { x, y }, true, {
          duration: 800,
        });
      },
    });
  }
}

// #设置节点和边高亮
interface highlightPathType {
  nodes: Array<any>;
  edges: Array<any>;
}
export function deLightPath(graph: any, htpath: highlightPathType) {
  clearAllStats(graph);
  htpath.nodes = [];
  htpath.edges = [];

  // htpath = {
  //   nodes: [],
  //   edges: [],
  // };
}
export function highlightPath(
  graph: any,
  path: highlightPathType,
  highlight: string,
) {
  console.log(path.nodes);
  graph.setAutoPaint(false);
  graph.getNodes().forEach(function (node: any) {
    graph.clearItemStates(node);
    graph.setItemState(node, 'dark', true);
  });
  graph.getEdges().forEach(function (edge: any) {
    graph.clearItemStates(edge);
    graph.setItemState(edge, 'dark', true);
  });
  path.nodes.forEach((n) => {
    graph.setItemState(n, 'dark', false);
    graph.setItemState(n, highlight, true);
    n.toFront();
  });
  path.edges.forEach((e) => {
    graph.setItemState(e, 'dark', false);
    graph.setItemState(e, highlight, true);
    e.toFront();
  });
  graph.paint();
  graph.setAutoPaint(true);
}

// #判断state是否存在与节点上
export function hasStates(node: any, states: Array<string>) {
  return states.some((e) => node.hasState(e));
}

// #将路径剧中显示
export function fitPathCenter(graph: any, path: highlightPathType) {
  let { nodes } = path;
  let x = nodes.map((v) => v.getBBox());
  let y = nodes.map((v) => v.getBBox());
  let xCenter = (Math.max(...x) - Math.min(...x)) / 2;
  let yCenter = (Math.max(...y) - Math.min(...y)) / 2;
  console.log(x, y);

  let pathExtend: Array<number> = [
    Math.min(...x),
    Math.min(...y),
    Math.max(...x),
    Math.max(...y),
  ];
  console.log(pathExtend);
  graph.fitView(-20);
}

// 精准IP定位（设备名称、类型、边界、地理位置）
// IP地理定位功能（详细、大洲国家）
// IP所属运营商拓扑信息
// IP、域名、开放服务及版本网络空间指纹
// 外部查询、导出
