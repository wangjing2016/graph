import data from '../../datas';
import { formatNodes } from '../../nodes';
import { notification } from 'antd';

function addNode(graph: any, model: any, e: any) {
  //graph.addItem('node',model)
  /*该方法弊端，数据量大时，不能直观看到新增的节点
    let datas:any = data;
    let findnode = datas.nodes.find( item => item.nodeType == model.nodeType)
    console.log(findnode)
    datas.nodes.push(Object.assign({...findnode},{...model}))
    console.log('datas',datas)
    graph.read(datas)*/
  /*let datas:any = data;
    let findnode = datas.nodes.find( item => item.nodeType == model.nodeType)
    let nodes = graph.findById(findnode.id);
    let {x,y} = graph.getViewPortCenterPoint()
    console.log(nodes.getModel())
    let nodeModel = Object.assign({...nodes.getModel()},{...model,x,y})
    let nodeItem = graph.addItem('node',nodeModel)
    graph.setItemState(nodeItem, 'highlight', true);*/
  console.log('model', model);
  let modelObj = JSON.parse(model);
  formatNodes([modelObj], 'image-nodes');
  let { x, y } = e;
  let nodeModel = Object.assign({ ...modelObj }, { x, y });
  graph.addItem('node', nodeModel);

  let nodeItem = graph.findById(nodeModel.id) || {};
  setTimeout(() => {
    graph.setItemState(nodeItem, 'selected', true);
    graph.layout();
  });
}
function addEdge(graph: any) {
  //获取选中状态下的节点进行连线
  let selectedNodes = graph.findAllByState('node', 'selected');

  if (selectedNodes.length !== 2) {
    notification.open({
      message: '提示',
      description: '进行连线时，只能选择两个节点进行操作',
      className: 'custom-class',
      style: {
        width: 300,
      },
    });
  } else {
    let sourceNode = selectedNodes[0];
    let targetNode = selectedNodes[1];
    let test = graph.addItem('edge', {
      source: sourceNode.getModel().id,
      target: targetNode.getModel().id,
    });
  }
}
function removeEdges(graph: any) {
  let selectedNodes = graph.findAllByState('node', 'selected');
  getEdgeFromNodes(graph, selectedNodes);
}
function getEdgeFromNodes(graph: any, nodes: Array<any>) {
  console.log('nodes:', nodes);
  let allEdges = graph.getEdges();
  console.log('allEdges', allEdges);
  allEdges.forEach(function (edge: any) {
    if (nodes.includes(edge.getSource()) && nodes.includes(edge.getTarget())) {
      setTimeout(() => {
        graph.removeItem(edge);
      }, 200);
    }
  });
  console.log('graph.getEdges();', graph.getEdges());
}
export { addNode, addEdge, removeEdges };
