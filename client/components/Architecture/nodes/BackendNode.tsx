import BaseArchitectureNode from './BaseArchitectureNode';

export default function BackendNode(props: any) {
  return (
    <div className="rounded-lg border border-purple-200 bg-purple-50">
      <BaseArchitectureNode {...props} />
    </div>
  );
}