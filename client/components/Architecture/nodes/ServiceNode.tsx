import React from 'react'
import BaseArchitectureNode from './BaseArchitectureNode';

function ServiceNode(props: any) {
  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50">
      <BaseArchitectureNode {...props} />
    </div>
  )
}

export default ServiceNode