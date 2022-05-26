import { nodeIcons } from './getNodeIcons';
import {
  refreshDragedNodePosition,
  clearAllStats,
  getSingleNodePath,
  moveNodeToPosition,
  fitPathCenter,
  highlightPath,
  deLightPath,
} from './tools';

interface highlightPathType {
  nodes: Array<any>;
  edges: Array<any>;
}

export function setPathHighlight(
  graph: any,
  htpath: highlightPathType,
  nodeId: string,
) {
  // 清除高亮
  deLightPath(graph, htpath);

  // 获取目标节点，通过id
  const target = graph.findById(nodeId); // 移动节点至中心位置

  // 获取所有边
  const edges = graph.getEdges();

  // #加入第一个节点
  htpath.nodes.push(target);

  // 根据第一个节点,开始建立高亮节点集合
  getSingleNodePath(nodeId, edges, htpath);

  // #移动路径到中心点位置：第一种方式移动到目标节点
  moveNodeToPosition(graph, target);

  // 高亮路径
  highlightPath(graph, htpath, 'highlight');
}
