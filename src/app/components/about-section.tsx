import { useLanguage } from '../context/language-context';

export function AboutSection() {
  const { language } = useLanguage();
  const copy = language === 'en'
    ? {
        label: 'ABOUT',
        title: 'I BUILD SOFTWARE TO UNDERSTAND SYSTEMS.',
        paragraphs: [
          'I build products and software systems across interface, services, infrastructure and AI. I like working end to end because some of the most important decisions only become visible where those layers meet.',
          'My work usually starts with a concrete question. I build enough of the system to confront the question with reality, then keep following what the implementation reveals — technical limits, product consequences and sometimes a different problem than the one I started with.',
          'Some of those answers become products. Others become tools, experiments or new questions. The Editorial is where I turn part of that experience into writing about technology, computing, software, hardware and the abstractions we use to understand complex systems.',
        ],
        interests: 'CURRENT INTERESTS',
        interestItems: [
          'Software and product',
          'AI and human-computer interaction',
          'Infrastructure and distributed systems',
          'Experimental computing',
        ],
      }
    : {
        label: 'SOBRE',
        title: 'CONSTRUO SOFTWARE PARA ENTENDER SISTEMAS.',
        paragraphs: [
          'Construo produtos e sistemas de software atravessando interface, serviços, infraestrutura e IA. Gosto de trabalhar de ponta a ponta porque algumas das decisões mais importantes só aparecem quando essas camadas se encontram.',
          'Meu trabalho normalmente começa com uma pergunta concreta. Construo o suficiente do sistema para confrontar essa pergunta com a realidade e sigo o que a implementação revela — limites técnicos, consequências de produto e, às vezes, um problema diferente daquele que iniciou a investigação.',
          'Algumas dessas respostas viram produtos. Outras viram ferramentas, experimentos ou novas perguntas. O Editorial é onde transformo parte dessa experiência em textos sobre tecnologia, computação, software, hardware e as abstrações que usamos para compreender sistemas complexos.',
        ],
        interests: 'INTERESSES ATUAIS',
        interestItems: [
          'Software e produto',
          'IA e interação humano-computador',
          'Infraestrutura e sistemas distribuídos',
          'Computação experimental',
        ],
      };

  return (
    <section className="mx-auto max-w-[1600px] border-t border-[var(--border-subtle)] px-6 py-16 lg:py-24" id="about">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,.55fr)] lg:gap-20">
        <div className="max-w-4xl">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--electric-blue)]">{copy.label}</p>
          <h2 className="mt-5 max-w-4xl font-mono text-3xl font-bold leading-tight tracking-tight text-[var(--terminal-text)] sm:text-4xl lg:text-5xl">
            {copy.title}
          </h2>

          <div className="mt-9 max-w-3xl space-y-6 text-base leading-relaxed text-[var(--terminal-text)] sm:text-lg">
            {copy.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </div>

        <aside className="self-end border-t border-[var(--border-default)] pt-6 lg:mb-1">
          <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--terminal-muted)]">{copy.interests}</p>
          <ul className="mt-5 space-y-0">
            {copy.interestItems.map((item, index) => (
              <li key={item} className="grid grid-cols-[2rem_1fr] border-t border-[var(--border-default)] py-4 text-sm leading-relaxed text-[var(--terminal-text)] first:border-t-0">
                <span className="font-mono text-[10px] text-[var(--electric-blue)]">{String(index + 1).padStart(2, '0')}</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
