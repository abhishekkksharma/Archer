'use client';

import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  MarkerType,
  type EdgeProps,
  type Edge,
} from '@xyflow/react';

export type EdgeDirection = 'none' | 'uni' | 'bi';
import CustomEdgeLabel from './CustomeEdgeLabel';

export type ArchitectureEdgeData = {
  label?: string;
  color?: string;
  direction?: EdgeDirection;
  dataFlow?: boolean;
  description?: string;
  edgeData?: {
    protocol?: string;
    method?: string;
    dataType?: string;
    description?: string;
    direction?: string;
  };
};

export type ArchitectureEdgeType = Edge<
  ArchitectureEdgeData,
  'architecture'
>;

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  sourcePosition,
  targetX,
  targetY,
  targetPosition,
  data,
  style,
}: EdgeProps<ArchitectureEdgeType>) {
  const color = data?.color ?? '#94a3b8';
  const direction = data?.direction ?? 'uni';
  const dataFlow = data?.dataFlow ?? false;
  const label = data?.label;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    curvature: 0.25,
  });

  const markerStyle = {
    type: MarkerType.ArrowClosed,
    color,
    width: 20,
    height: 20,
  };

  const markerStart =
    direction === 'bi' ? markerStyle : undefined;

  const markerEnd =
    direction === 'uni' || direction === 'bi'
      ? markerStyle
      : undefined;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: color,
          strokeWidth: 1.2,
          opacity: 0.7,
          ...style,
        }}
        interactionWidth={20}
      />

      {dataFlow && (
        <path
          d={edgePath}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          strokeDasharray="5 8"
          className="pointer-events-none"
          style={{
            opacity: 0.85,
            animation: 'architecture-edge-flow 1s linear infinite',
          }}
        />
      )}

      {label && (
        <EdgeLabelRenderer>
          <CustomEdgeLabel
            labelName={label}
            labelColor={color}
            direction={direction}
            dataFlow={dataFlow}
            data={data}
            labelX={labelX}
            labelY={labelY}
          />
        </EdgeLabelRenderer>
      )}
    </>
  );
}