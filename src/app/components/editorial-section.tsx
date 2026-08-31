import { featuredPublications } from '../data/editorial-publications';
import { useLanguage } from '../context/language-context';

export function EditorialSection() {
  const { language } = useLanguage();
  const isEnglish = language === 'en';

  return (
    <section id="editorial" className="border-y border-[var(--border-default)] bg-[var(--surface-1)]">
      <div className="mx-auto max-w-[1600px] px-6 py-16 lg:py-24">
        <div className="mb-12 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="max-w-4xl">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--terminal-muted)]">
              02 // EDITORIAL
            </div>
            <h2 className="font-mono text-2xl font-bold tracking-tight text-[var(--terminal-text)] lg:text-3xl">
              {isEnglish ? 'Ideas that appear while building.' : 'Ideias que aparecem enquanto construo.'}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--terminal-muted)]">
              {isEnglish
                ? 'Essays about technology, computing, software, hardware and the abstractions that become visible when I try to build something from first principles.'
                : 'Ensaios sobre tecnologia, computação, software, hardware e as abstrações que ficam visíveis quando tento construir alguma coisa a partir dos primeiros princípios.'}
            </p>
          </div>
          <a
            href="/editorial/"
            className="inline-flex min-h-11 items-center justify-center border border-[var(--electric-blue)] px-4 font-mono text-xs tracking-wider text-[var(--electric-blue)] transition-colors hover:bg-[var(--electric-blue)] hover:text-[var(--terminal-bg)]"
          >
            {isEnglish ? 'READ EDITORIAL →' : 'LER EDITORIAL →'}
          </a>
        </div>

        <div className="grid gap-px border border-[var(--border-default)] bg-[var(--border-default)] lg:grid-cols-3">
          {featuredPublications.slice(0, 3).map((publication) => {
            const copy = isEnglish ? publication.copy.en : publication.copy.pt;
            const title = isEnglish ? publication.title.en : publication.title.pt;
            const date = isEnglish ? publication.dateLabel.en : publication.dateLabel.pt;
            const readTime = isEnglish ? publication.readTime.en : publication.readTime.pt;
            return (
              <a
                key={publication.slug}
                href={`/editorial/${publication.slug}/`}
                className="group flex min-h-[310px] flex-col bg-[var(--terminal-bg)] p-6 transition-colors hover:bg-[var(--surface-2)] lg:p-8"
              >
                <div className="flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-wider text-[var(--terminal-muted)]">
                  <span>{publication.kind}</span>
                  <span>{date}</span>
                </div>
                <h3 className="mt-10 font-mono text-xl font-bold leading-snug text-[var(--terminal-text)] transition-colors group-hover:text-[var(--electric-blue)] lg:text-2xl">
                  {title}
                </h3>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-[var(--terminal-muted)]">{copy.dek}</p>
                <div className="mt-8 flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-wider">
                  <span className="text-[var(--terminal-muted)]">{readTime}</span>
                  <span className="text-[var(--electric-blue)]">{isEnglish ? 'READ →' : 'LER →'}</span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
