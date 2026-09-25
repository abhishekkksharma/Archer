import React, { useMemo } from "react";
import { useNodes, useViewport, useStore } from "@xyflow/react";

interface MiniMapCustomProps {
  className?: string;
  width?: number;
  height?: number;
}

const MiniMapCustom: React.FC<MiniMapCustomProps> = ({
  className = "",
  width = 180,
  height = 110,
}) => {
  const nodes = useNodes();
  const { x: vpX, y: vpY, zoom } = useViewport();
  const { width: containerW, height: containerH } = useStore((state) => ({
    width: state.width || 1000,
    height: state.height || 700,
  }));

  const effectiveZoom = zoom || 1;
  const padding = 40;

  const vpMinX = -vpX / effectiveZoom;
  const vpMinY = -vpY / effectiveZoom;
  const vpMaxX = vpMinX + containerW / effectiveZoom;
  const vpMaxY = vpMinY + containerH / effectiveZoom;

  const bounds = useMemo(() => {
    let minX = vpMinX;
    let minY = vpMinY;
    let maxX = vpMaxX;
    let maxY = vpMaxY;

    if (nodes.length) {
      nodes.forEach((n) => {
        const nw = n.measured?.width ?? 150;
        const nh = n.measured?.height ?? 60;
        const nx = n.position.x;
        const ny = n.position.y;

        if (nx < minX) minX = nx;
        if (ny < minY) minY = ny;
        if (nx + nw > maxX) maxX = nx + nw;
        if (ny + nh > maxY) maxY = ny + nh;
      });
    }

    minX -= padding;
    minY -= padding;
    maxX += padding;
    maxY += padding;

    const bWidth = Math.max(maxX - minX, 100);
    const bHeight = Math.max(maxY - minY, 100);

    return {
      x: minX,
      y: minY,
      width: bWidth,
      height: bHeight,
    };
  }, [nodes, vpMinX, vpMinY, vpMaxX, vpMaxY]);

  const scale = Math.min(
    width / bounds.width,
    height / bounds.height
  );

  const vpLeft = (vpMinX - bounds.x) * scale;
  const vpTop = (vpMinY - bounds.y) * scale;
  const vpBoxWidth = (containerW / effectiveZoom) * scale;
  const vpBoxHeight = (containerH / effectiveZoom) * scale;

  return (
    <div
      className={`
        relative overflow-hidden rounded
        border border-zinc-200 dark:border-zinc-800
        bg-zinc-100/90 dark:bg-zinc-900/90
        backdrop-blur-sm shadow-sm
        transition-colors duration-200
        select-none pointer-events-none
        ${className}
      `}
      style={{
        width,
        height,
      }}
    >
      {/* Node Indicators */}
      {nodes.map((node) => {
        const nWidth = (node.measured?.width ?? 150) * scale;
        const nHeight = (node.measured?.height ?? 60) * scale;
        const left = (node.position.x - bounds.x) * scale;
        const top = (node.position.y - bounds.y) * scale;

        return (
          <div
            key={node.id}
            className="absolute rounded-xs bg-zinc-400  dark:bg-zinc-300 dark:border-zinc-100 transition-all duration-75"
            style={{
              left: `${left}px`,
              top: `${top}px`,
              width: `${Math.max(nWidth, 4)}px`,
              height: `${Math.max(nHeight, 3)}px`,
            }}
          />
        );
      })}

      {/* Viewport Indicator Rect */}
      <div
        className="absolute rounded-[2px] border border-zinc-300/60 bg-zinc-500/15 dark:border-zinc-300/60 dark:bg-zinc-300/15 pointer-events-none transition-all duration-75"
        style={{
          left: `${vpLeft}px`,
          top: `${vpTop}px`,
          width: `${Math.max(vpBoxWidth, 8)}px`,
          height: `${Math.max(vpBoxHeight, 6)}px`,
        }}
      />
    </div>
  );
};

export default MiniMapCustom;