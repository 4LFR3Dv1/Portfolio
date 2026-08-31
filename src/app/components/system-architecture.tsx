import { Button } from './button';
import { useLanguage } from '../context/language-context';

export function SystemArchitecture({ onOpen }: { onOpen: () => void }) {
  const { language } = useLanguage();
  const isEnglish = language === 'en';
  const layers = isEnglish
    ? [
        { name: 'PRODUCT', description: 'Interfaces, interactions and the part of a system people actually experience.' },
        { name: 'SERVICES', description: 'Data, business rules and integrations that turn an interface into a working product.' },
        { name: 'RUNTIME', description: 'Browsers, workers and local software where the work is actually executed.' },
        { name: 'INFRASTRUCTURE', description: 'Networks, machines and deployment choices that make the rest possible.' },
      ]
    : [
        { name: 'PRODUTO', description: 'Interfaces, interações e a parte de um sistema que as pessoas realmente experimentam.' },
        { name: 'SERVIÇOS', description: 'Dados, regras de negócio e integrações que transformam uma interface em um produto funcionando.' },
        { name: 'EXECUÇÃO', description: 'Navegadores, workers e software local onde o trabalho realmente acontece.' },
        { name: 'INFRAESTRUTURA', description: 'Redes, máquinas e escolhas de deploy que tornam o restante possível.' },
      ];

  return (
    <section className="mx-auto max-w-[1600px] border-t border-[var(--border-subtle)] px-6 py-16 lg:py-24" id="architecture">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] lg:items-start">
        <div className="max-w-xl">
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--terminal-muted)]">
            03 // {isEnglish ? 'ARCHITECTURE' : 'ARQUITETURA'}
          </div>
          <h2 className="mt-4 font-mono text-2xl font-bold tracking-tight text-[var(--electric-blue)] lg:text-3xl">
            {isEnglish ? 'I tend to work across the whole path.' : 'Costumo trabalhar atravessando o caminho inteiro.'}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--terminal-muted)]">
            {isEnglish
              ? 'I do not see frontend, backend and infrastructure as separate identities. They are different views of the same product, and many of the interesting problems appear where one layer meets another.'
              : 'Não vejo frontend, backend e infraestrutura como identidades separadas. São visões diferentes do mesmo produto, e muitos dos problemas interessantes aparecem justamente quando uma camada encontra a outra.'}
          </p>
          <Button variant="secondary" onClick={onOpen} className="mt-7">
            {isEnglish ? 'EXPLORE ARCHITECTURE →' : 'EXPLORAR ARQUITETURA →'}
          </Button>
        </div>

        <div className="grid border border-[var(--border-default)] sm:grid-cols-2">
          {layers.map((layer, index) => (
            <div key={layer.name} className={`min-h-[180px] bg-[var(--surface-1)] p-6 ${index % 2 === 0 ? 'sm:border-r sm:border-[var(--border-default)]' : ''} ${index < 2 ? 'border-b border-[var(--border-default)]' : ''}`}>
              <div className="font-mono text-[10px] text-[var(--terminal-muted)]">{String(index + 1).padStart(2, '0')}</div>
              <h3 className="mt-5 font-mono text-sm font-bold text-[var(--terminal-text)]">{layer.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--terminal-muted)]">{layer.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
