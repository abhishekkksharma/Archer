import React from 'react'
import BaseArchitectureNode from './BaseArchitectureNode';
import {} from "@/assets/tech-icons/tech-icons"

function ServiceNode(props: any) {
  
  return (
    <div className="rounded-lg border border-blue-200 max-w-80 bg-blue-50">
      <BaseArchitectureNode {...props} />
    </div>
  )
}

export default ServiceNode