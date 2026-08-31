import { Badge } from './badge';
import { useLanguage } from '../context/language-context';

export function AboutSection() {
  const { language } = useLanguage();
  const isEnglish = language === 'en';

  const skills = [
    'PRODUCT ENGINEERING',
    'SYSTEMS DESIGN',
    'AI TOOLS',
    'WEB INFRASTRUCTURE',
    'DISTRIBUTED SYSTEMS',
    'SECURITY',
    'FRONTEND + BACKEND',
  ];

  return (
    <section className="max-w-[1600px] mx-auto px-6 py-16 lg:py-24 border-t border-[var(--border-subtle)]" id="about">
      <div className="flex items-center gap-5 mb-10">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[var(--border-default)] flex-shrink-0">
          <img
            src="/docs/EDIT RENAN 1.png"
            alt="Renan Melo"
            className="w-full h-full object-cover object-top"
          />
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider mb-2" style={{ color: 'var(--terminal-muted)' }}>
            {isEnglish ? 'ABOUT' : 'SOBRE'}
          </div>
          <h2 className="font-mono font-bold" style={{ color: 'var(--electric-blue)' }}>
            RENAN MELO
          </h2>
          <div className="font-mono text-xs mt-1" style={{ color: 'var(--terminal-muted)' }}>
            {isEnglish ? 'Computing Systems Engineer' : 'Engenheiro de Sistemas Computacionais'}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3 space-y-4 text-base leading-relaxed" style={{ color: 'var(--terminal-text)' }}>
          <p>
            {isEnglish
              ? 'I started in design and moved into software by building products end to end. That background still shapes how I work: I care about how a system is structured, how it behaves when things fail and how it feels to use.'
              : 'Comecei no design e cheguei ao software construindo produtos de ponta a ponta. Esse background ainda define como trabalho: me importo com a estrutura do sistema, com o que acontece quando algo falha e com a experiência de quem usa.'}
          </p>
          <p>
            {isEnglish
              ? 'My current work spans web products, infrastructure, tools for working with AI and experimental browser systems. I usually work across product, architecture and implementation instead of staying inside a single layer.'
              : 'Hoje meu trabalho passa por produtos web, infraestrutura, ferramentas para trabalhar com IA e sistemas experimentais para navegador. Costumo atuar entre produto, arquitetura e implementação, em vez de ficar restrito a uma única camada.'}
          </p>
          <p>
            {isEnglish
              ? 'Through SNE Labs I also develop and publish selected research, prototypes and technical notes when they are useful to share.'
              : 'Na SNE Labs também desenvolvo e publico pesquisas, protótipos e notas técnicas selecionadas quando faz sentido compartilhá-las.'}
          </p>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-3">
            <div className="font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--terminal-muted)' }}>
              {isEnglish ? 'WORKING ACROSS' : 'ÁREAS DE TRABALHO'}
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="default">{skill}</Badge>
              ))}
            </div>
          </div>

          <div className="border-t border-[var(--border-subtle)] pt-5 space-y-3 font-mono text-xs">
            <a href="/editorial/" className="flex items-center justify-between gap-4 text-[var(--terminal-muted)] hover:text-[var(--electric-blue)]">
              <span>{isEnglish ? 'READ EDITORIAL' : 'LER EDITORIAL'}</span>
              <span aria-hidden="true">→</span>
            </a>
            <a href="https://github.com/4LFR3Dv1" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-4 text-[var(--terminal-muted)] hover:text-[var(--electric-blue)]">
              <span>GITHUB</span>
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
