import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from './badge';

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  type: 'core' | 'service' | 'storage' | 'external';
  connections: string[]; // IDs of targets
}

interface CircuitDiagramProps {
  nodes: Node[];
  onNodeClick: (id: string) => void;
  selectedNodeId: string | null;
}

export function CircuitDiagram({ nodes, onNodeClick, selectedNodeId }: CircuitDiagramProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Calculate paths
  const getPath = (start: Node, end: Node) => {
    // Simple Manhattan routing or direct cubic bezier
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const controlX = start.x + dx * 0.5;
    
    return `M ${start.x} ${start.y} C ${controlX} ${start.y}, ${controlX} ${end.y}, ${end.x} ${end.y}`;
  };

  return (
    <div className="relative w-full h-[600px] bg-[var(--surface-1)] border border-[var(--border-default)] rounded-lg overflow-hidden group">
      
      {/* Grid Background Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ 
             backgroundImage: 'linear-gradient(var(--border-default) 1px, transparent 1px), linear-gradient(90deg, var(--border-default) 1px, transparent 1px)', 
             backgroundSize: '40px 40px' 
           }}>
      </div>

      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <defs>
          <filter id="glow-line" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Connections */}
        {nodes.map(node => 
          node.connections.map(targetId => {
            const target = nodes.find(n => n.id === targetId);
            if (!target) return null;
            
            const isHighlighted = hoveredNode === node.id || hoveredNode === targetId || selectedNodeId === node.id || selectedNodeId === targetId;
            const pathData = getPath(node, target);

            return (
              <g key={`${node.id}-${targetId}`}>
                {/* Base Line */}
                <path 
                  d={pathData}
                  fill="none"
                  stroke="var(--border-default)"
                  strokeWidth="2"
                  className="transition-colors duration-300"
                />
                
                {/* Active Flow Animation */}
                <path 
                  d={pathData}
                  fill="none"
                  stroke={isHighlighted ? "var(--electric-blue)" : "var(--terminal-muted)"}
                  strokeWidth={isHighlighted ? "2" : "1"}
                  strokeOpacity={isHighlighted ? 1 : 0.3}
                  filter={isHighlighted ? "url(#glow-line)" : undefined}
                />

                {/* Data Packet */}
                <circle r="3" fill="var(--electric-blue)">
                  <animateMotion 
                    dur={`${Math.random() * 2 + 2}s`} 
                    repeatCount="indefinite"
                    path={pathData}
                  />
                </circle>
              </g>
            );
          })
        )}
      </svg>

      {/* Nodes Layer */}
      <div className="absolute inset-0 z-10">
        {nodes.map(node => (
          <motion.button
            key={node.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center p-4 rounded-lg border backdrop-blur-md transition-all duration-300
              ${selectedNodeId === node.id 
                ? 'border-[var(--electric-blue)] bg-[var(--surface-2)] shadow-[0_0_30px_rgba(0,217,255,0.2)]' 
                : 'border-[var(--border-default)] bg-[var(--surface-1)] hover:border-[var(--terminal-text)]'
              }
            `}
            style={{ 
              left: node.x, 
              top: node.y,
              width: 160,
              minHeight: 80
            }}
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
            onClick={() => onNodeClick(node.id)}
          >
            {/* Logic for icons could go here */}
            <div className={`w-3 h-3 rounded-full mb-3 
              ${node.type === 'core' ? 'bg-[var(--electric-blue)]' : 
                node.type === 'storage' ? 'bg-[var(--electric-green)]' : 
                'bg-[var(--terminal-muted)]'}
            `}/>
            
            <span className="font-mono text-xs font-bold text-center leading-tight" style={{ color: selectedNodeId === node.id ? 'var(--electric-blue)' : 'var(--terminal-text)' }}>
              {node.label}
            </span>
            
            {selectedNodeId === node.id && (
              <motion.div 
                layoutId="outline" 
                className="absolute inset-0 border-2 border-[var(--electric-blue)] rounded-lg" 
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
