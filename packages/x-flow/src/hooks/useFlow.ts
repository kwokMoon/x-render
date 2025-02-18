import { Edge, useReactFlow } from '@xyflow/react';
import { useMemoizedFn } from 'ahooks';
import { useMemo } from 'react';
import { FlowNode } from '../models/store';
import { useStoreApi } from './useStore';
import autoLayoutNodes from '../utils/autoLayoutNodes';

// useFlow 维护原则
// 1. 尽量复用 reactflow 已有的方法，不要重复造轮子
// 2. 非必要不暴露新的方法和状态
export const useFlow = () => {
  const storeApi = useStoreApi();
  const instance = storeApi.getState();
  const {
    zoomIn,
    zoomOut,
    zoomTo,
    getZoom,
    setViewport,
    getViewport,
    fitView,
    setCenter,
    fitBounds,
    toObject,
    getNodes,
    getEdges,
    screenToFlowPosition,
    flowToScreenPosition
  } = useReactFlow();
  const setNodes = useMemoizedFn((nodes: FlowNode[], isTransform = true) => {
    storeApi.getState().setNodes(nodes, isTransform);
  });
  const addNodes = useMemoizedFn((nodes: FlowNode[], isTransform = true) => {
    storeApi.getState().addNodes(nodes, isTransform);
  });
  const setEdges = useMemoizedFn((edges: Edge[]) => {
    storeApi.getState().setEdges(edges);
  });
  const addEdges = useMemoizedFn((edges: Edge[]) => {
    storeApi.getState().addEdges(edges);
  });
  const runAutoLayout = useMemoizedFn(() => {
    const newNodes: any = autoLayoutNodes(storeApi.getState().nodes, storeApi.getState().edges, storeApi.getState().layout);
    setNodes(newNodes, false);
  });

  return useMemo(
    () => ({
      setNodes,
      addNodes,
      setEdges,
      addEdges,
      getNodes,
      getEdges,
      toObject,
      zoomIn,
      zoomOut,
      zoomTo,
      getZoom,
      setViewport,
      getViewport,
      fitView,
      setCenter,
      fitBounds,
      screenToFlowPosition,
      flowToScreenPosition,
      runAutoLayout
    }),
    [instance]
  );
};
