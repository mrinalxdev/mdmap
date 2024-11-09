"use client";

import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Braces, Upload, Download } from "lucide-react";
import { toast } from "sonner";

interface MarkdownEditorProps {
  onMarkdownChange: (markdown: string) => void;
}

export function MarkdownEditor({ onMarkdownChange }: MarkdownEditorProps) {
  const [markdown, setMarkdown] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (value: string) => {
    setMarkdown(value);
    onMarkdownChange(value);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        handleChange(content);
        toast.success("File uploaded successfully!");
      };
      reader.onerror = () => {
        toast.error("Error reading file");
      };
      reader.readAsText(file);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "mindmap.md";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("File downloaded successfully!");
  };

  const sampleMarkdown = `# Project Roadmap
## Features
- Interactive visualization
- Real-time updates
- Dark mode support
### Core Components
- Markdown parser
- Layout engine
- Export tools
## Development
- Unit testing
- Documentation
### Timeline
- Sprint planning
- Weekly reviews
## Future Plans
- Mobile app
- Collaboration tools
- Cloud storage`;

  return (
    <Card className="p-4 h-full flex flex-col shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-primary/5 rounded-lg">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-lg font-semibold">Markdown Editor</h2>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload
          </Button>
          <Button
            variant="outline"
            onClick={handleDownload}
            className="flex items-center gap-2"
            disabled={!markdown}
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button
            variant="default"
            onClick={() => handleChange(sampleMarkdown)}
            className="flex items-center gap-2"
          >
            <Braces className="h-4 w-4" />
            Load Sample
          </Button>
        </div>
      </div>
      <Textarea
        value={markdown}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Enter your markdown here or upload a markdown file..."
        className="flex-1 min-h-[500px] font-mono resize-none"
      />
      <input
        type="file"
        ref={fileInputRef}
        accept=".md,.markdown"
        onChange={handleFileUpload}
        className="hidden"
      />
    </Card>
  );
}