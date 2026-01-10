import React from 'react';
import { Badge } from './badge';

export function AboutSection() {
  const skills = [
    'PLATFORM UX', 'DESIGN SYSTEMS', 'DESKTOP DISTRIBUTION', 'API DESIGN',
    'SECURITY MODELING', 'WEB3 AUTH', 'OPS/DIAGNOSTICS'
  ];
  
  return (
    <section className="max-w-[1600px] mx-auto px-6 py-16 lg:py-24 border-t border-[var(--border-subtle)]" id="about">
      {/* Section Header */}
      <div className="mb-12">
        <h2 className="font-mono font-bold mb-4" style={{ color: 'var(--electric-blue)' }}>
          ABOUT // OPERATOR NOTES
        </h2>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-4 text-base leading-relaxed" style={{ color: 'var(--terminal-text)' }}>
          <p>
            Eu construo produtos como ferramentas: interfaces que dão clareza, controle e performance.
          </p>
          <p>
            Gosto de sistemas distribuídos que precisam funcionar no mundo real: rede falha, APIs mudam, usuários abandonam se a UX quebra.
          </p>
          <p>
            Meu foco é end-to-end ownership: arquitetura, UX, integração, deploy, diagnósticos e evolução contínua.
          </p>
          <p>
            Tenho preferência por alto sinal: menos promessa, mais evidência.
          </p>
        </div>
        
        {/* Skills */}
        <div className="space-y-6">
          <div className="font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--terminal-muted)' }}>
            SKILLS
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, idx) => (
              <Badge key={idx} variant="default">{skill}</Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
