import BaseArchitectureNode from './BaseArchitectureNode';
import {UserRound} from "lucide-react"

import { BaseNodeData } from './BaseArchitectureNode';

export default function FrontendNode(props: any) {
  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50">
      <BaseArchitectureNode {...props} />
    </div>
  );
}