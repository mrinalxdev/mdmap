"use client";

import { useCallback, useState } from "react";
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  ConnectionMode,
  Panel,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import { Card } from "@/components/ui/card";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MindmapViewerProps {
  nodes: Node[];
  edges: Edge[];
}

const NodeDetails = ({ data, isOpen, onClose }: { 
  data: { label: string; isRoot?: boolean }; 
  isOpen: boolean; 
  onClose: () => void 
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold">
          {data.isRoot ? "Root: " : ""}{data.label}
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-3">
        <div className="text-sm text-muted-foreground">
          This node represents a key concept in your mindmap. You can explore its connections
          through the visible links to other nodes.
        </div>
        <div className="p-3 bg-muted rounded-lg">
          <code className="text-sm">{data.label}</code>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

const CustomNode = ({ data, isConnectable }: { 
  data: { label: string; isRoot?: boolean }; 
  isConnectable: boolean 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div 
        className={`mindmap-node ${data.isRoot ? 'root' : ''}`}
        onClick={() => setIsOpen(true)}
      >
        {data.label}
      </div>
      <NodeDetails 
        data={data} 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
};

const nodeTypes = {
  default: CustomNode,
};

export function MindmapViewer({ nodes, edges }: MindmapViewerProps) {
  const onDownload = useCallback(() => {
    const svg = document.querySelector(".react-flow") as HTMLElement;
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "mindmap.svg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Mindmap downloaded as SVG");
    }
  }, []);

  const defaultEdgeOptions = {
    style: { 
      strokeWidth: 2,
      stroke: 'hsl(var(--primary))',
    },
    type: 'smoothstep',
    animated: true,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: 'hsl(var(--primary))',
      width: 20,
      height: 20,
    },
  };

  return (
    <Card className="p-4 h-full">
      <div className="h-[600px]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Loose}
          defaultEdgeOptions={defaultEdgeOptions}
          fitView
          className="bg-background"
          minZoom={0.2}
          maxZoom={1.5}
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
          elementsSelectable={true}
          selectNodesOnDrag={false}
        >
          <Background 
            color="hsl(var(--muted-foreground))" 
            gap={16} 
            size={1}
            style={{ opacity: 0.1 }}
          />
          <Controls 
            showInteractive={false}
            className="!bg-background !shadow-lg"
          />
          <Panel position="top-right">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={onDownload}
              className="shadow-lg text-white"
            >
              <Download className="h-4 w-4" />
            </Button>
          </Panel>
        </ReactFlow>
      </div>
    </Card>
  );
}