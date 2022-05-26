import { G6 } from '@antv/graphin';
import { clearAllStats, hasStates } from './tools';
// #无条件设置高亮
export function setHoverHighlight(e: any, graph: any, highlight: string) {
  // console.log(e);
  const item = e.item;
  graph.setAutoPaint(false);
  graph.getNodes().forEach(function (node: any) {
    graph.clearItemStates(node);
    graph.setItemState(node, 'dark', true);
  });
  graph.setItemState(item, 'dark', false);
  graph.setItemState(item, highlight, true);
  graph.getEdges().forEach(function (edge: any) {
    if (edge.getSource() === item) {
      graph.setItemState(edge.getTarget(), 'dark', false);
      graph.setItemState(edge.getTarget(), highlight, true);
      graph.setItemState(edge, highlight, true);
      edge.toFront();
    } else if (edge.getTarget() === item) {
      graph.setItemState(edge.getSource(), 'dark', false);
      graph.setItemState(edge.getSource(), highlight, true);
      graph.setItemState(edge, highlight, true);
      edge.toFront();
    } else {
      graph.setItemState(edge, highlight, false);
    }
  });
  graph.paint();
  graph.setAutoPaint(true);
}
// #带条件设置高亮
// #使用情景：如果已经存在多个状态，并且在hover的时候，针对特定状态不进行处理时使用
export function setHoverHighlightWithExclueds(
  e: any, //#节点
  graph: any, //#图形实例
  highlight: string, //#高亮状态
  excludes: Array<string>, //#需要排除的状态
) {
  const item = e.item;
  graph.setAutoPaint(false);

  // #重置所有节点状态为dark
  graph.getNodes().forEach(function (node: any) {
    if (!hasStates(node, excludes)) {
      graph.clearItemStates(node);
      graph.setItemState(node, 'dark', true);
    }
  });

  // #处理节点
  if (!hasStates(item, excludes)) {
    graph.setItemState(item, 'dark', false);
    graph.setItemState(item, highlight, true);
  }

  // #节点前置
  item.toFront();

  // #处理边
  graph.getEdges().forEach(function (edge: any) {
    // #节点为边的source
    if (edge.getSource() === item) {
      // #处理节点高亮
      if (!hasStates(edge.getTarget(), excludes)) {
        graph.setItemState(edge.getTarget(), 'dark', false);
        graph.setItemState(edge.getTarget(), highlight, true);
      }

      // #处理边的高亮
      if (!hasStates(edge, excludes)) {
        graph.setItemState(edge, highlight, true);
      }

      // #前置边
      edge.toFront();

      // #节点为边的target
    } else if (edge.getTarget() === item) {
      // #处理节点高亮
      if (!hasStates(edge.getSource(), excludes)) {
        graph.setItemState(edge.getSource(), 'dark', false);
        graph.setItemState(edge.getSource(), highlight, true);
      }

      // #处理边的高亮
      if (!hasStates(edge, excludes)) {
        graph.setItemState(edge, highlight, true);
      }

      // #前置边
      edge.toFront();
    } else {
      // #处理从节点移开
      graph.setItemState(edge, highlight, false);
    }
  });
  graph.paint();
  graph.setAutoPaint(true);
}
