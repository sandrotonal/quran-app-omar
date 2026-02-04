import { useCallback } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    Node,
    Edge,
    NodeMouseHandler,
    NodeTypes
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CustomAyetNode } from './CustomAyetNode';

interface SemanticGraphProps {
    nodes: Node[];
    edges: Edge[];
    onNodeClick?: (nodeData: any) => void;
}

const nodeTypes: NodeTypes = {
    ayetNode: CustomAyetNode
};

export function SemanticGraph({ nodes, edges, onNodeClick }: SemanticGraphProps) {
    const handleNodeClick: NodeMouseHandler = useCallback((_event, node) => {
        if (onNodeClick) {
            onNodeClick(node.data);
        }
    }, [onNodeClick]);

    return (
        <div className="h-[400px] md:h-[600px] w-full bg-theme-surface rounded-lg shadow-lg overflow-hidden border border-theme-border/20">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodeClick={handleNodeClick}
                fitView
                attributionPosition="bottom-left"
                minZoom={0.2}
                maxZoom={2}
                defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
            >
                <Background />
                <Controls className="!bottom-4 !left-4" />
                <MiniMap
                    nodeColor="#3b82f6"
                    maskColor="rgba(0, 0, 0, 0.1)"
                    className="!bottom-4 !right-4 hidden md:block"
                />
            </ReactFlow>
        </div>
    );
}
