import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { publications } from './editorial-publications';

const indexSource = readFileSync(
  new URL('../../../editorial-shell/publication-src/pages/index.astro', import.meta.url),
  'utf8',
);
const articleSource = readFileSync(
  new URL('../../../editorial-shell/publication-src/pages/[...slug].astro', import.meta.url),
  'utf8',
);
const layoutSource = readFileSync(
  new URL('../../../editorial-shell/publication-src/layouts/PublicationLayout.astro', import.meta.url),
  'utf8',
);
const indexStyles = readFileSync(
  new URL('../../../editorial-shell/publication-src/styles/editorial-index.css', import.meta.url),
  'utf8',
);
const articleStyles = readFileSync(
  new URL('../../../editorial-shell/publication-src/styles/editorial-essay.css', import.meta.url),
  'utf8',
);
const packageJson = JSON.parse(readFileSync(new URL('../../../package.json', import.meta.url), 'utf8')) as {
  scripts: Record<string, string>;
};
const vercel = JSON.parse(readFileSync(new URL('../../../vercel.json', import.meta.url), 'utf8')) as {
  buildCommand: string;
  outputDirectory: string;
  rewrites: Array<{ source: string; destination: string }>;
};

describe('R3 editorial redesign acceptance', () => {
  it('renders the investigation-first section order', () => {
    const now = indexSource.indexOf('id="agora"');
    const essays = indexSource.indexOf('id="ensaios"');
    const inquiries = indexSource.indexOf('id="em-investigacao"');
    const categories = indexSource.indexOf('id="categorias"');

    expect(now).toBeGreaterThan(-1);
    expect(essays).toBeGreaterThan(now);
    expect(inquiries).toBeGreaterThan(essays);
    expect(categories).toBeGreaterThan(inquiries);
  });

  it('uses the canonical Portfolio typography hierarchy and scale', () => {
    expect(layoutSource).toContain('family=Inter');
    expect(layoutSource).toContain('JetBrains+Mono');
    expect(layoutSource).toContain("--font-mono:'JetBrains Mono'");
    expect(layoutSource).toContain("--font-sans:'Inter'");
    expect(layoutSource).toContain('body {');
    expect(layoutSource).toContain('font-family:var(--font-sans);');
    expect(layoutSource).toContain('h1, h2, h3 { font-family:var(--font-mono); }');
    expect(indexStyles).toContain('.editorial-masthead h1');
    expect(indexStyles).toContain('var(--font-mono)');
    expect(articleStyles).toContain('.essay-hero h1');
    expect(articleStyles).toContain('var(--font-mono)');
    expect(indexStyles).not.toContain('108px');
    expect(indexStyles).not.toContain('82px');
    expect(indexStyles).not.toContain('min-height: 62vh');
    expect(articleStyles).not.toContain('104px');
    expect(articleStyles).not.toContain('min-height: 66vh');
  });

  it('does not regress to the generation-one card/list or repeated section-heading grammar', () => {
    expect(indexSource).not.toContain('study-grid');
    expect(indexSource).not.toContain('study-card');
    expect(indexSource).not.toContain('publication-list');
    expect(indexSource).not.toContain('publication-row');
    expect(indexSource).not.toContain('EditorialSectionHeading');
    expect(layoutSource).not.toContain('.publication-list');
    expect(layoutSource).not.toContain('.index-header');
  });

  it('gives the primary inquiry one surface instead of repeating it in the queue', () => {
    expect(indexSource).toContain(
      'const queuedInquiries = activeInquiries.filter((inquiry) => inquiry.id !== primaryInquiry.id);',
    );
    expect(indexSource).toContain('queuedInquiries.map((inquiry, index) =>');
    expect(indexSource).not.toContain('activeInquiries.map((inquiry, index) =>');
    expect(indexSource).not.toContain('O que estou tentando entender agora.');
    expect(indexSource).not.toContain('IR PARA A PERGUNTA');
    expect(indexSource).toContain('<strong>OUTRAS PERGUNTAS</strong>');
    expect(indexSource).toContain('id={primaryInquiry.anchor}');
  });

  it('models investigation lines as category filters rather than links to the first inquiry', () => {
    expect(indexSource).toContain('<strong>CATEGORIAS</strong>');
    expect(indexSource).toContain('data-category-control');
    expect(indexSource).toContain('data-categories');
    expect(indexSource).toContain("url.searchParams.set('categoria', selectedCategory)");
    expect(indexSource).toContain('getCategoryInquiries');
    expect(indexSource).not.toContain('LINHAS DE INVESTIGAÇÃO');
    expect(indexSource).not.toContain('getThreadInquiries');
    expect(indexSource).not.toContain('data-thread');
    expect(indexStyles).toContain('.category-band');
    expect(indexStyles).toContain('.category-filtering');
    expect(indexStyles).not.toContain('.thread-band');
  });

  it('makes real destinations interactive at the surface level instead of requiring small CTA buttons', () => {
    expect(indexSource).toContain('class="now-question-link"');
    expect(indexSource).toContain("['essay-tile', `essay-tile-${index + 1}`]");
    expect(indexSource).toContain('class="inquiry-row inquiry-row-link"');
    expect(indexSource).toContain('<details class="inquiry-row inquiry-row-open"');
    expect(indexSource).toContain('class="category-band"');
  });

  it('replaces the Medium-like article grid with an instrumented reading surface', () => {
    expect(articleSource).toContain('class="essay-hero"');
    expect(articleSource).toContain('class="reading-progress"');
    expect(articleSource).toContain('class="essay-toc"');
    expect(articleSource).toContain('data-essay-section');
    expect(articleSource).toContain('IntersectionObserver');
    expect(articleSource).toContain('class="essay-exit"');
    expect(layoutSource).not.toContain('.article-grid');
    expect(layoutSource).not.toContain('.share-actions');
    expect(articleStyles).toContain('.essay-rail');
  });

  it('preserves every published essay route and legacy study anchors', () => {
    expect(publications.map((publication) => `/editorial/${publication.slug}/`)).toEqual([
      '/editorial/quando-um-navegador-deixa-de-ser-uma-ferramenta/',
      '/editorial/onde-existe-uma-rede/',
      '/editorial/o-passado-de-um-sistema-nao-existe/',
    ]);
    expect(indexSource).toContain('id="estudos-atuais"');
    expect(indexSource).toContain('id={primaryInquiry.anchor}');
    expect(indexSource).toContain('id={inquiry.anchor}');
  });

  it('keeps article metadata and sharing while embedding investigation and category context', () => {
    expect(articleSource).toContain('getPublicationEditorialContext');
    expect(articleSource).toContain('NASCEU DESTA INVESTIGAÇÃO');
    expect(articleSource).toContain('editorialContext.categories');
    expect(articleSource).toContain('www.linkedin.com/sharing/share-offsite');
    expect(articleSource).toContain('ogImagePath');
    expect(layoutSource).toContain('article:published_time');
    expect(layoutSource).toContain('twitter:card');
  });

  it('keeps the composed Vite + Astro runtime contract intact', () => {
    expect(packageJson.scripts.build).toBe('vite build');
    expect(packageJson.scripts['build:composed']).toBe(
      'npm run build && npm run build:editorial && npm run generate:social',
    );
    expect(vercel.buildCommand).toBe('npm run build:composed');
    expect(vercel.outputDirectory).toBe('dist');
    expect(vercel.rewrites).toEqual([
      { source: '/((?!editorial(?:/|$)|.*\\.).*)', destination: '/index.html' },
    ]);
  });

  it('does not introduce project-documentation routes under Editorial', () => {
    expect(indexSource).not.toContain('/editorial/systems/');
    expect(articleSource).not.toContain('/editorial/systems/');
  });
});
