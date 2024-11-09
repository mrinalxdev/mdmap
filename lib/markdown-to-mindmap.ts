import { Node, Edge } from 'reactflow';
import { marked, Tokens } from 'marked';

interface MindmapNode {
  id: string;
  text: string;
  level: number;
  children: string[];
}

function calculateNodePosition(nodes: MindmapNode[], nodeId: string, levelSpacing = 250, nodeSpacing = 120) {
  const node = nodes.find(n => n.id === nodeId);
  if (!node) return { x: 0, y: 0 };
  const x = node.level * levelSpacing;
  const siblings = nodes.filter(n => n.level === node.level);
  const index = siblings.findIndex(n => n.id === nodeId);
  const y = index * nodeSpacing - (siblings.length - 1) * nodeSpacing / 2;
  return { x, y };
}

export function parseMarkdownToMindmap(markdown: string): { nodes: Node[]; edges: Edge[] } {
  const tokens = marked.lexer(markdown);
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const mindmapNodes: { [key: string]: MindmapNode } = {};
  let currentParentStack: string[] = [];
  let nodeCounter = 0;

  function createNodeId(): string {
    return `node-${nodeCounter++}`;
  }

  function processToken(token: Tokens.Generic, level: number) {
    if (token.type === 'heading') {
      const headingToken = token as Tokens.Heading;
      const nodeId = createNodeId();
      const parentId = currentParentStack[level - 1];

      mindmapNodes[nodeId] = {
        id: nodeId,
        text: headingToken.text,
        level,
        children: [],
      };

      if (parentId) {
        mindmapNodes[parentId].children.push(nodeId);
        edges.push({
          id: `edge-${parentId}-${nodeId}`,
          source: parentId,
          target: nodeId,
          type: 'smoothstep',
        });
      }

      currentParentStack[level] = nodeId;
      currentParentStack.splice(level + 1);
    } else if (token.type === 'list') {
      const listToken = token as Tokens.List;
      listToken.items.forEach((item) => {
        const nodeId = createNodeId();
        const parentId = currentParentStack[currentParentStack.length - 1];

        mindmapNodes[nodeId] = {
          id: nodeId,
          text: item.text,
          level: currentParentStack.length,
          children: [],
        };

        if (parentId) {
          mindmapNodes[parentId].children.push(nodeId);
          edges.push({
            id: `edge-${parentId}-${nodeId}`,
            source: parentId,
            target: nodeId,
            type: 'smoothstep',
          });
        }
      });
    }
  }

  tokens.forEach((token) => {
    if (token.type === 'heading') {
      processToken(token, (token as Tokens.Heading).depth);
    } else if (token.type === 'list') {
      processToken(token, currentParentStack.length);
    }
  });

  const mindmapNodesArray = Object.values(mindmapNodes);
  mindmapNodesArray.forEach((node) => {
    const position = calculateNodePosition(mindmapNodesArray, node.id);
    nodes.push({
      id: node.id,
      position,
      data: { 
        label: node.text,
        isRoot: node.level === 1 
      },
      type: 'default',
    });
  });

  return { nodes, edges };
}