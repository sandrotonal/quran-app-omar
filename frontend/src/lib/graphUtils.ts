import { Node, Edge } from '@xyflow/react';
import { SimilarResponse } from './api';

export function transformToGraphData(data: SimilarResponse): { nodes: Node[]; edges: Edge[] } {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    const centerNode: Node = {
        id: `${data.center.sure}-${data.center.ayet}`,
        type: 'ayetNode',
        position: { x: 400, y: 300 },
        data: {
            label: `${data.center.sure}:${data.center.ayet}`,
            text: data.center.text,
            arabic: data.center.arabic,
            isCenter: true
        }
    };

    nodes.push(centerNode);

    const angleStep = (2 * Math.PI) / data.similar.length;
    const radius = 250;

    data.similar.forEach((ayet, index) => {
        const angle = index * angleStep;
        const x = 400 + radius * Math.cos(angle);
        const y = 300 + radius * Math.sin(angle);

        const nodeId = `${ayet.sure}-${ayet.ayet}`;

        nodes.push({
            id: nodeId,
            type: 'ayetNode',
            position: { x, y },
            data: {
                label: `${ayet.sure}:${ayet.ayet}`,
                text: ayet.text,
                arabic: ayet.arabic,
                similarityScore: ayet.similarityScore,
                isCenter: false
            }
        });

        edges.push({
            id: `${centerNode.id}-${nodeId}`,
            source: centerNode.id,
            target: nodeId,
            style: {
                stroke: '#8b5cf6',
                strokeWidth: 1 + ayet.similarityScore * 3
            },
            label: `${(ayet.similarityScore * 100).toFixed(0)}%`,
            labelStyle: { fill: '#6b7280', fontSize: '10px' }
        });
    });

    return { nodes, edges };
}
