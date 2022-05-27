import React, { useState } from 'react';
import './operationPanel.less';
import IconFont from '../common/IconFont';
import { addNode, addEdge, removeEdges } from './operation';
import { graph } from '../../graph';
import { Alert } from 'antd';

/**
 * 
 * @returns x: ev.canvasX,
      y: ev.canvasY,
 */
/**
 * 
 * @returns id: '100989',
                    label: 'switch',
                    nodeType: 'switch',
                    x: e.clientX - 30,
                    y: e.clientY + 40
 */
const nodeTypeList = [
  {
    type: 'ins',
    label: '机构',
  },
  {
    type: 'person',
    label: '人员',
  },
  {
    type: 'ip',
    label: 'IP',
  },
  {
    type: 'printer',
    label: '打印机',
  },
  {
    type: 'switch',
    label: '交换机',
  },
  {
    type: 'router',
    label: '路由器',
  },
];
function OperationPanel() {
  let [addContainer, setAddContainer] = useState(false);
  let [lockState, setLockState] = useState(false);
  function addNodeHandler(nodeType: string) {
    let nodeItemModelData = {
      id: Date.now().toString(),
      label: nodeType,
      nodeType: nodeType,
    };
    //addNode(graph, nodeItemModelData);
    setAddContainer(false);
  }
  function addEdgeHandler() {
    addEdge(graph);
  }
  function removeEdgeHandler() {
    removeEdges(graph);
  }
  function dragStartHandler(e: any, nodeType: string) {
    console.log('拖拽开始');

    /* 设置拖拽传输数据 */
    e.dataTransfer.setData(
      'dragComponent',
      JSON.stringify({
        id: Date.now().toString(),
        label: nodeType,
        nodeType: nodeType,
      }),
    );
    //setAddContainer(false);
  }
  function imgSrc(type: string) {
    return require(`@/icons/node-icons/${type}.png`);
  }
  return (
    <div className="panel-wrapper">
      <span
        className={lockState ? 'icon-wrapper lock' : 'icon-wrapper'}
        onClick={() => {
          lockState ? null : setAddContainer(!addContainer);
        }}
      >
        <IconFont type={`icon-tianjia1`} />
      </span>
      <span
        className="icon-wrapper"
        onClick={() => {
          setLockState(true);
          console.log(lockState);
        }}
      >
        <IconFont type={`icon-suoding`} />
      </span>
      <span
        className="icon-wrapper"
        onClick={() => {
          setLockState(false);
        }}
      >
        <IconFont type={`icon-34_kaisuo`} />
      </span>
      <span
        className={lockState ? 'icon-wrapper lock' : 'icon-wrapper'}
        onClick={() => {
          lockState ? null : addEdgeHandler();
        }}
      >
        <IconFont type={`icon-lianjie`} />
      </span>
      <span
        className={lockState ? 'icon-wrapper lock' : 'icon-wrapper'}
        onClick={() => {
          lockState ? null : removeEdgeHandler();
        }}
      >
        <IconFont type={`icon-icon-duankailianjie`} />
      </span>
      <span className={lockState ? 'icon-wrapper lock' : 'icon-wrapper'}>
        <IconFont type={`icon-beizhu`} />
      </span>
      <span className={lockState ? 'icon-wrapper lock' : 'icon-wrapper'}>
        <IconFont type={`icon-kuaizhao`} />
      </span>
      <span className={lockState ? 'icon-wrapper lock' : 'icon-wrapper'}>
        <IconFont type={`icon-fenxiang01`} />
      </span>
      {addContainer && (
        <>
          <div className="trangle-wrapper">
            <div className="trangle"></div>
          </div>
          <div className="add-node-wrapper">
            {nodeTypeList.map((type) => (
              //   <span
              //     className="add-node"
              //     draggable="true"
              //     onDragStart={(e) => {
              //       dragStartHandler(e, type.type);
              //     }}
              //     key={type.type}
              //     onClick={() => {
              //       addNodeHandler(type.type);
              //     }}
              //   >
              //     {type.label}
              //   </span>
              <span className="add-node" key={type.type}>
                <img
                  src={imgSrc(type.type)}
                  width={40}
                  height={40}
                  draggable="true"
                  onDragStart={(e) => {
                    dragStartHandler(e, type.type);
                  }}
                />
                <span>{type.label}</span>
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export { OperationPanel };
