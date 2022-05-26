import G6 from '@antv/g6';
import { useEffect } from 'react';
import graphCreater from './graph';
import './index.less';
import { OperationPanel } from './components/index';
function GraphRelation() {
  useEffect(() => {
    let ele: HTMLElement = document.getElementById('container');
    graphCreater(ele);
    // 阻止默认动作
    document.addEventListener(
      'drop',
      (e) => {
        e.preventDefault();
      },
      false,
    );
  });
  return (
    <div id="container">
      <OperationPanel></OperationPanel>
    </div>
  );
}
export default GraphRelation;
