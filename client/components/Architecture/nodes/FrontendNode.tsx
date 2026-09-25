import BaseArchitectureNode from './BaseArchitectureNode';

export default function FrontendNode(props: any) {
  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50">
      <BaseArchitectureNode {...props} />
    </div>
  );
}