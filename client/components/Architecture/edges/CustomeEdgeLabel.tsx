'use client';

import React, { useState } from 'react';

type CustomEdgeLabelProps = {
  labelColor?: string;
  labelName: string;
  description?: string;
  direction?: 'none' | 'uni' | 'bi';
  dataFlow?: boolean;
  labelX?: number;
  labelY?: number;
  data?: {
    edgeData?: {
      protocol?: string;
      method?: string;
      dataType?: string;
      description?: string;
      direction?: string;
    };
    [key: string]: any;
  };
};

function CustomEdgeLabel({
  labelColor = '#94a3b8',
  labelName,
  description,
  direction = 'uni',
  dataFlow = false,
  labelX,
  labelY,
  data,
}: CustomEdgeLabelProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
      style={{
        left: labelX,
        top: labelY,
        zIndex: hovered ? 99999 : 10,
      }}
    >
      <div
        className="relative pointer-events-auto"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          className="cursor-default rounded-md border px-2 py-1 text-xs font-medium backdrop-blur-sm transition-all duration-150 hover:scale-105"
          style={{
            color: labelColor,
            borderColor: `${labelColor}55`,
            backgroundColor: `${labelColor}12`,
          }}
        >
          {labelName}
        </div>

        {hovered && (
          <div
            className="absolute left-1/2 top-full z-99 mt-2 w-64 -translate-x-1/2 rounded-lg border bg-white p-3 shadow-2xl dark:bg-zinc-900"
            style={{
              borderColor: `${labelColor}55`,
            }}
          >
          <div className="mb-2 flex items-center justify-between">
            <span
              className="text-sm font-semibold"
              style={{ color: labelColor }}
            >
              {labelName}
            </span>
          </div>

          {(description || data?.edgeData?.description) && (
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 mb-2">
              {description || data?.edgeData?.description}
            </p>
          )}

          <div className="space-y-1 border-t pt-2 text-xs text-slate-500 dark:border-zinc-700 dark:text-slate-400">
            <div className="flex justify-between gap-4">
              <span>Direction</span>

              <span className="font-medium text-slate-700 dark:text-slate-200">
                {direction === 'bi'
                  ? 'Bidirectional'
                  : direction === 'uni'
                    ? 'One way'
                    : 'None'}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span>Data Flow</span>

              <span className="font-medium text-slate-700 dark:text-slate-200">
                {dataFlow ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          {data?.edgeData && (
            <div className="mt-3 space-y-1 border-t pt-2 text-xs text-slate-500 dark:border-zinc-700 dark:text-slate-400">
              {data.edgeData.protocol && (
                <div className="flex justify-between gap-4">
                  <span>Protocol</span>
                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    {data.edgeData.protocol}
                  </span>
                </div>
              )}
              {data.edgeData.method && (
                <div className="flex justify-between gap-4">
                  <span>Method</span>
                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    {data.edgeData.method}
                  </span>
                </div>
              )}
              {data.edgeData.dataType && (
                <div className="flex justify-between gap-4">
                  <span>Data Type</span>
                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    {data.edgeData.dataType}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  </div>
);
}

export default CustomEdgeLabel;