"use client"
import { useState } from "react";
import { MarkdownEditor } from "@/components/markdown-editor";
import { MindmapViewer } from "@/components/mindmap-viewer";
import { parseMarkdownToMindmap } from "@/lib/markdown-to-mindmap";
import { BrainCircuit, BrainCog } from "lucide-react";
import { Edge, Node as ReactFlowNode } from "reactflow";

export default function Home() {
  const [nodes, setNodes] = useState<ReactFlowNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const handleMarkdownChange = (markdown: string) => {
    const { nodes: newNodes, edges: newEdges } = parseMarkdownToMindmap(markdown);
    setNodes(newNodes);
    setEdges(newEdges);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <div className="flex flex-col items-center justify-center mb-8 pt-8 space-y-2">
          <div className="flex items-center justify-center p-3 bg-primary/5 rounded-full">
            <BrainCog className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-6xl font-bold text-center font-title">
            MdxMap
          </h1>
          <p className="text-muted-foreground text-center max-w-md">
            Transform your markdown files into beautiful, interactive mindmaps with ease
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <MarkdownEditor onMarkdownChange={handleMarkdownChange} />
          <MindmapViewer nodes={nodes} edges={edges} />
        </div>
      </div>
    </main>
  );
}