import { featuredPublications } from '../../../editorial-shell/publication-src/data/publications';
import { useLanguage } from '../context/language-context';

export function EditorialSection() {
  const { language } = useLanguage();
  const isEnglish = language === 'en';

  return (
    <section id="editorial" className="border-y border-[var(--border-default)] bg-[var(--surface-1)]">
      <div className="mx-auto max-w-[1600px] px-6 py-14 lg:py-20">
        <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--terminal-muted)]">
              02 // EDITORIAL
            </div>
            <h2 className="max-w-3xl font-mono text-2xl font-bold tracking-tight text-[var(--terminal-text)] lg:text-3xl">
              {isEnglish ? 'Systems, research and notes from current work.' : 'Sistemas, pesquisas e notas do trabalho atual.'}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--terminal-muted)]">
              {isEnglish
                ? 'Shareable static publications generated as durable links, with canonical metadata for reading, search and social sharing.'
                : 'Publicações estáticas compartilháveis, geradas como links duráveis com metadata canônica para leitura, busca e compartilhamento social.'}
            </p>
          </div>
          <a
            href="/editorial/"
            className="inline-flex min-h-11 items-center justify-center border border-[var(--electric-blue)] px-4 font-mono text-xs tracking-wider text-[var(--electric-blue)] transition-colors hover:bg-[var(--electric-blue)] hover:text-[var(--terminal-bg)]"
          >
            {isEnglish ? 'OPEN EDITORIAL →' : 'ABRIR EDITORIAL →'}
          </a>
        </div>

        <div className="grid gap-px border border-[var(--border-default)] bg-[var(--border-default)] lg:grid-cols-3">
          {featuredPublications.slice(0, 3).map((publication) => {
            const copy = isEnglish ? publication.copy.en : publication.copy.pt;
            return (
              <a
                key={publication.slug}
                href={`/editorial/${publication.slug}/`}
                className="group min-h-[220px] bg-[var(--terminal-bg)] p-6 transition-colors hover:bg-[var(--surface-2)]"
              >
                <div className="mb-8 flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-wider text-[var(--terminal-muted)]">
                  <span>{publication.kind}</span>
                  <span>{publication.updatedAt}</span>
                </div>
                <h3 className="font-mono text-xl font-bold text-[var(--terminal-text)] group-hover:text-[var(--electric-blue)]">
                  {publication.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--terminal-muted)]">{copy.summary}</p>
                <div className="mt-6 font-mono text-xs text-[var(--electric-blue)]">READ →</div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
