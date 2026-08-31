import { useLanguage } from '../context/language-context';

export function AboutSection() {
  const { language } = useLanguage();
  const isEnglish = language === 'en';
  const copy = isEnglish
    ? {
        label: 'ABOUT',
        subtitle: 'Software, product and computing',
        paragraphs: [
          'I started in design and reached computing through the urge to understand what exists underneath the interface. Building software became the most direct way I found to turn an abstract question into something I could inspect, break and improve.',
          'Today I build software end to end — product, services, infrastructure and experiments with AI. Some projects become products, others become tools or research. I am less interested in staying inside one technical layer than in understanding how the layers affect each other.',
          'The Editorial is where I try to explain the ideas that remain after the implementation: questions about technology, machines, software and the abstractions we use to make complex things understandable.',
        ],
        what: 'WHAT I DO',
        whatItems: ['Software and product', 'AI applied to real work', 'Infrastructure and distributed systems', 'Experimental computing'],
        how: 'HOW I WORK',
        howText: 'Ask → build → test → explain',
        editorial: 'READ EDITORIAL',
      }
    : {
        label: 'SOBRE',
        subtitle: 'Software, produto e computação',
        paragraphs: [
          'Comecei no design e cheguei à computação pela vontade de entender o que existe por baixo das interfaces. Construir software virou a forma mais direta que encontrei de transformar uma pergunta abstrata em algo que eu pudesse observar, quebrar e melhorar.',
          'Hoje construo software de ponta a ponta — produto, serviços, infraestrutura e experiências com IA. Alguns projetos viram produtos, outros viram ferramentas ou pesquisa. Tenho menos interesse em ficar preso a uma camada técnica do que em entender como as camadas afetam umas às outras.',
          'O Editorial é onde tento explicar as ideias que ficam depois da implementação: perguntas sobre tecnologia, máquinas, software e as abstrações que usamos para tornar coisas complexas compreensíveis.',
        ],
        what: 'O QUE FAÇO',
        whatItems: ['Software e produto', 'IA aplicada ao trabalho real', 'Infraestrutura e sistemas distribuídos', 'Computação experimental'],
        how: 'COMO TRABALHO',
        howText: 'Perguntar → construir → testar → explicar',
        editorial: 'LER EDITORIAL',
      };

  return (
    <section className="mx-auto max-w-[1600px] border-t border-[var(--border-subtle)] px-6 py-16 lg:py-24" id="about">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,.6fr)]">
        <div>
          <div className="mb-8 flex items-center gap-5">
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border-2 border-[var(--border-default)]">
              <img src="/docs/EDIT RENAN 1.png" alt="Renan Melo" className="h-full w-full object-cover object-top" />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--terminal-muted)]">{copy.label}</div>
              <h2 className="mt-2 font-mono text-2xl font-bold text-[var(--electric-blue)]">RENAN MELO</h2>
              <div className="mt-1 text-sm text-[var(--terminal-muted)]">{copy.subtitle}</div>
            </div>
          </div>

          <div className="max-w-3xl space-y-5 text-base leading-relaxed text-[var(--terminal-text)]">
            {copy.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </div>

        <aside className="border border-[var(--border-default)] bg-[var(--surface-1)]">
          <div className="p-6">
            <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--terminal-muted)]">{copy.what}</div>
            <ul className="mt-5 space-y-3 text-sm text-[var(--terminal-text)]">
              {copy.whatItems.map((item) => (
                <li key={item} className="flex gap-3"><span className="text-[var(--electric-blue)]">→</span><span>{item}</span></li>
              ))}
            </ul>
          </div>
          <div className="border-t border-[var(--border-default)] p-6">
            <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--terminal-muted)]">{copy.how}</div>
            <p className="mt-4 font-mono text-sm text-[var(--electric-green)]">{copy.howText}</p>
          </div>
          <a href="/editorial/" className="flex min-h-12 items-center justify-between border-t border-[var(--border-default)] px-6 font-mono text-xs text-[var(--electric-blue)] transition-colors hover:bg-[var(--surface-2)]">
            <span>{copy.editorial}</span><span>→</span>
          </a>
        </aside>
      </div>
    </section>
  );
}
