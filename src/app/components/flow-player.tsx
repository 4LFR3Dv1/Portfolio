import React, { useState } from 'react';
import { Badge } from './badge';
import { Button } from './button';

interface FlowStep {
  number: number;
  title: string;
  description: string;
}

interface FlowPlayerProps {
  flows: {
    id: string;
    label: string;
    steps: FlowStep[];
    guarantee?: string;
  }[];
}

export function FlowPlayer({ flows }: FlowPlayerProps) {
  const [activeFlow, setActiveFlow] = useState(flows[0]?.id || '');

  const currentFlow = flows.find(f => f.id === activeFlow);

  return (
    <div className="border border-[var(--border-default)] bg-[var(--surface-1)]">
      {/* Tabs */}
      <div className="flex border-b border-[var(--border-default)] bg-[var(--surface-2)]">
        {flows.map((flow) => (
          <button
            key={flow.id}
            onClick={() => setActiveFlow(flow.id)}
            className={`px-6 py-3 font-mono text-xs uppercase tracking-wider transition-colors border-b-2 ${
              activeFlow === flow.id
                ? 'border-[var(--electric-blue)] text-[var(--electric-blue)]'
                : 'border-transparent text-[var(--terminal-muted)] hover:text-[var(--terminal-text)]'
            }`}
          >
            {flow.label}
          </button>
        ))}
      </div>

      {/* Flow Steps */}
      {currentFlow && (
        <div className="p-6">
          <div className="space-y-6">
            {currentFlow.steps.map((step) => (
              <div key={step.number} className="flex gap-4">
                {/* Step Number */}
                <div 
                  className="flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-mono text-sm font-semibold"
                  style={{ 
                    borderColor: 'var(--electric-blue)',
                    color: 'var(--electric-blue)'
                  }}
                >
                  {step.number}
                </div>
                
                {/* Step Content */}
                <div className="flex-1">
                  <div className="font-mono text-sm font-semibold mb-2" style={{ color: 'var(--terminal-text)' }}>
                    {step.title}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--terminal-muted)' }}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Guarantee Footer */}
          {currentFlow.guarantee && (
            <div className="mt-8 pt-6 border-t border-[var(--border-subtle)]">
              <div className="flex items-start gap-3 p-4 bg-[rgba(0,255,136,0.05)] border border-[var(--electric-green)]">
                <div className="flex-shrink-0 mt-1">
                  <Badge variant="green">GUARANTEE</Badge>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--terminal-text)' }}>
                  {currentFlow.guarantee}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
