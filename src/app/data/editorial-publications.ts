export type PublicationKind = 'ESSAY' | 'NOTE';

interface LocalizedSection {
  heading: string;
  paragraphs: string[];
}

interface LocalizedCopy {
  dek: string;
  sections: LocalizedSection[];
}

interface LocalizedList {
  en: string[];
  pt: string[];
}

export interface EditorialPublication {
  slug: string;
  title: { en: string; pt: string };
  kind: PublicationKind;
  publishedAt: string;
  dateLabel: { en: string; pt: string };
  readTime: { en: string; pt: string };
  featured: boolean;
  topics: LocalizedList;
  copy: { en: LocalizedCopy; pt: LocalizedCopy };
}

export const publications: EditorialPublication[] = [
  {
    slug: 'quando-um-navegador-deixa-de-ser-uma-ferramenta',
    title: {
      en: 'When does a browser stop being a tool?',
      pt: 'Quando um navegador deixa de ser uma ferramenta?',
    },
    kind: 'ESSAY',
    publishedAt: '2026-08-31',
    dateLabel: { en: '31 AUG 2026', pt: '31 AGO 2026' },
    readTime: { en: '8 MIN READ', pt: '8 MIN DE LEITURA' },
    featured: true,
    topics: {
      en: ['browsers', 'AI', 'interfaces'],
      pt: ['navegadores', 'IA', 'interfaces'],
    },
    copy: {
      en: {
        dek: 'A reflection on the moment software stops merely operating an interface and starts needing a place inside the system it uses.',
        sections: [
          {
            heading: 'An interface assumes someone on the outside',
            paragraphs: [
              'Most software interfaces are designed around a simple picture: a person is outside the program, looking at a screen and deciding what to do next. The browser is especially clear about this. It offers tabs, buttons, forms and pages to a user who remains separate from the software being used.',
              'Traditional automation keeps that picture intact. A script may click faster than a person, but it is still imitating gestures that were designed for someone on the outside.',
            ],
          },
          {
            heading: 'Agents change the question',
            paragraphs: [
              'When software can read a page, interpret what it means, choose an action and continue from the result, the interesting question is no longer how to automate another click. The question becomes what relationship that software should have with the browser itself.',
              'If an agent can act for minutes or hours, recover after a failure and continue a task later, treating it as an invisible pair of hands becomes increasingly artificial. It starts to need permissions, memory, limits and a clear place from which its actions can be understood.',
            ],
          },
          {
            heading: 'Participation is not unlimited freedom',
            paragraphs: [
              'Giving software a real place inside a browser should not mean removing control. The opposite is more useful. Actions should be visible. Permissions should have boundaries. A person should be able to understand what happened, stop it and recover when the process goes wrong.',
              'The more capable an agent becomes, the less convincing it is to hide it behind the same mechanisms used for disposable automation.',
            ],
          },
          {
            heading: 'The browser as an environment',
            paragraphs: [
              'A tool is something we pick up from the outside. An environment is something within which activity takes place. Browsers were built as tools for people, but software agents make that distinction unstable.',
              'The interesting design problem may not be building better automation for the browser we already have. It may be deciding what a browser becomes when people and software can both participate in it without pretending to be each other.',
            ],
          },
        ],
      },
      pt: {
        dek: 'Uma reflexão sobre o momento em que um software deixa de apenas operar uma interface e passa a precisar de um lugar dentro do sistema que utiliza.',
        sections: [
          {
            heading: 'Uma interface pressupõe alguém do lado de fora',
            paragraphs: [
              'A maior parte das interfaces de software parte de uma imagem simples: existe uma pessoa do lado de fora do programa, olhando para uma tela e decidindo o que fazer em seguida. No navegador isso é especialmente claro. Abas, botões, formulários e páginas são oferecidos a um usuário que continua separado do software que utiliza.',
              'A automação tradicional mantém essa imagem intacta. Um script pode clicar mais rápido do que uma pessoa, mas ainda está imitando gestos criados para alguém que permanece do lado de fora.',
            ],
          },
          {
            heading: 'Agentes mudam a pergunta',
            paragraphs: [
              'Quando um software consegue ler uma página, interpretar o que ela significa, escolher uma ação e continuar a partir do resultado, a pergunta interessante deixa de ser como automatizar mais um clique. Passa a ser qual relação esse software deveria ter com o próprio navegador.',
              'Se um agente pode trabalhar por minutos ou horas, continuar uma tarefa depois de uma falha e retomar o que estava fazendo mais tarde, tratá-lo como um par invisível de mãos fica cada vez mais artificial. Ele começa a precisar de permissões, memória, limites e de um lugar claro a partir do qual suas ações possam ser compreendidas.',
            ],
          },
          {
            heading: 'Participar não significa liberdade irrestrita',
            paragraphs: [
              'Dar a um software um lugar real dentro do navegador não deveria significar retirar controle. O contrário é mais útil. As ações precisam ser visíveis. Permissões precisam ter limites. Uma pessoa deve conseguir entender o que aconteceu, interromper o processo e recuperar o trabalho quando algo der errado.',
              'Quanto mais capaz um agente se torna, menos convincente é escondê-lo atrás dos mesmos mecanismos usados para uma automação descartável.',
            ],
          },
          {
            heading: 'O navegador como ambiente',
            paragraphs: [
              'Uma ferramenta é algo que pegamos do lado de fora. Um ambiente é algo dentro do qual uma atividade acontece. Navegadores foram construídos como ferramentas para pessoas, mas agentes de software tornam essa distinção instável.',
              'Talvez o problema de design mais interessante não seja criar uma automação melhor para o navegador que já existe. Talvez seja decidir o que um navegador se torna quando pessoas e software podem participar dele sem precisar fingir que são a mesma coisa.',
            ],
          },
        ],
      },
    },
  },
  {
    slug: 'onde-existe-uma-rede',
    title: { en: 'Where does a network exist?', pt: 'Onde existe uma rede?' },
    kind: 'ESSAY',
    publishedAt: '2026-08-31',
    dateLabel: { en: '31 AUG 2026', pt: '31 AGO 2026' },
    readTime: { en: '7 MIN READ', pt: '7 MIN DE LEITURA' },
    featured: true,
    topics: {
      en: ['networks', 'hardware', 'abstraction'],
      pt: ['redes', 'hardware', 'abstração'],
    },
    copy: {
      en: {
        dek: 'Cables are physical, Wi-Fi is invisible and protocols are abstract. Yet all of them describe different parts of the same thing we call a network.',
        sections: [
          {
            heading: 'The network before the interface',
            paragraphs: [
              'A cable is easy to believe in. We can hold it, disconnect it and watch communication disappear. The physical link makes the existence of the network feel obvious.',
              'Move to Wi-Fi or the Internet and that certainty becomes less intuitive. The connection still depends on matter, energy and machines, but the part we interact with is mostly made of names, addresses, packets and conventions.',
            ],
          },
          {
            heading: 'Invisible does not mean immaterial',
            paragraphs: [
              'Software encourages us to describe a network as if it were a purely logical space. That description is useful, but it hides the fact that every message eventually has to become a physical event somewhere: a voltage changes, a radio signal is emitted, memory is written, a controller moves bytes.',
              'The abstraction is powerful precisely because we normally do not need to think about any of this. It becomes interesting again when we ask what remains after the abstraction is removed.',
            ],
          },
          {
            heading: 'A network is also a set of relations',
            paragraphs: [
              'The physical medium alone is not enough. Two machines can share the same air and still have no meaningful relationship. What makes a network useful is the ability to distinguish endpoints, exchange signals and interpret those signals as part of some shared convention.',
              'So the network is neither only the cable nor only the protocol. It appears in the relation between physical possibility and an agreement about what the exchanged states mean.',
            ],
          },
          {
            heading: 'Change the observer, change the network',
            paragraphs: [
              'From an application, the network may look like a URL and a response. From an operating system, it looks like sockets and interfaces. From a controller, it may look like frames, interrupts and buffers. None of these views is the whole network.',
              'Perhaps asking where a network exists has no single answer. The answer depends on which layer is doing the observing and which distinctions that layer is capable of making.',
            ],
          },
        ],
      },
      pt: {
        dek: 'Cabos são físicos, Wi-Fi é invisível e protocolos são abstratos. Ainda assim, todos descrevem partes diferentes da mesma coisa que chamamos de rede.',
        sections: [
          {
            heading: 'A rede antes da interface',
            paragraphs: [
              'É fácil acreditar em um cabo. Podemos segurá-lo, desconectá-lo e observar a comunicação desaparecer. A ligação física torna a existência da rede evidente.',
              'Quando passamos para Wi-Fi ou Internet, essa certeza fica menos intuitiva. A conexão continua dependendo de matéria, energia e máquinas, mas a parte com que interagimos é feita principalmente de nomes, endereços, pacotes e convenções.',
            ],
          },
          {
            heading: 'Invisível não significa imaterial',
            paragraphs: [
              'Software nos acostuma a descrever uma rede como se ela fosse um espaço puramente lógico. Essa descrição é útil, mas esconde que toda mensagem precisa eventualmente virar um acontecimento físico em algum lugar: uma tensão muda, um sinal de rádio é emitido, uma memória é escrita, um controlador move bytes.',
              'A abstração é poderosa justamente porque normalmente não precisamos pensar em nada disso. Ela volta a ficar interessante quando perguntamos o que sobra ao removê-la.',
            ],
          },
          {
            heading: 'Uma rede também é um conjunto de relações',
            paragraphs: [
              'O meio físico sozinho não basta. Duas máquinas podem compartilhar o mesmo ar e ainda assim não manter nenhuma relação significativa. Para que exista uma rede útil, é preciso distinguir pontos, trocar sinais e interpretar esses sinais dentro de alguma convenção comum.',
              'A rede, portanto, não é apenas o cabo nem apenas o protocolo. Ela aparece na relação entre uma possibilidade física e um acordo sobre o significado dos estados trocados.',
            ],
          },
          {
            heading: 'Mude o observador, mude a rede',
            paragraphs: [
              'Para uma aplicação, a rede pode parecer uma URL e uma resposta. Para um sistema operacional, ela aparece como sockets e interfaces. Para um controlador, pode aparecer como frames, interrupções e buffers. Nenhuma dessas visões é a rede inteira.',
              'Talvez perguntar onde uma rede existe não tenha uma única resposta. A resposta depende da camada que observa e das distinções que essa camada consegue fazer.',
            ],
          },
        ],
      },
    },
  },
  {
    slug: 'o-passado-de-um-sistema-nao-existe',
    title: { en: "A system's past does not exist", pt: 'O passado de um sistema não existe' },
    kind: 'ESSAY',
    publishedAt: '2026-08-31',
    dateLabel: { en: '31 AUG 2026', pt: '31 AGO 2026' },
    readTime: { en: '6 MIN READ', pt: '6 MIN DE LEITURA' },
    featured: true,
    topics: {
      en: ['state', 'time', 'software'],
      pt: ['estado', 'tempo', 'software'],
    },
    copy: {
      en: {
        dek: 'Software does not keep the past itself. It keeps traces from which a past can be reconstructed.',
        sections: [
          {
            heading: 'State only exists now',
            paragraphs: [
              'Open a program and the machine gives you a present state: bytes in memory, files on disk, rows in a database, processes that are running now. None of those objects contains yesterday as a place we can revisit.',
              'What we call the past of a system is usually a collection of surviving traces: logs, events, timestamps, commits, snapshots and records created while the system changed.',
            ],
          },
          {
            heading: 'Memory is a construction',
            paragraphs: [
              'A useful history appears when we arrange those traces into an order and infer what must have happened between them. The quality of the history depends on what was recorded, what disappeared and which assumptions we make while reading it.',
              'This is why two systems can remember the same event differently without either one literally storing the past. They stored different evidence about a state that no longer exists.',
            ],
          },
          {
            heading: 'Good software makes reconstruction possible',
            paragraphs: [
              'When a system needs auditability, recovery or debugging, recording only its latest state is often insufficient. We also need enough information to understand how that state became possible.',
              'That does not make the history perfectly true. It makes the history reproducible from a known set of traces, which is a much more useful property for engineering.',
            ],
          },
          {
            heading: 'The future is different',
            paragraphs: [
              'The past can be reconstructed because something already happened and left consequences. The future has no such traces. It exists only as possibilities that the present state may allow or prevent.',
              'Software lives in this asymmetry: it continuously reconstructs what happened from what remains, while using the present to decide which next states can become real.',
            ],
          },
        ],
      },
      pt: {
        dek: 'Software não guarda o passado em si. Guarda rastros a partir dos quais um passado pode ser reconstruído.',
        sections: [
          {
            heading: 'Estado só existe agora',
            paragraphs: [
              'Abra um programa e a máquina oferece um estado presente: bytes na memória, arquivos no disco, linhas em um banco de dados, processos que estão rodando agora. Nenhum desses objetos contém ontem como um lugar ao qual podemos voltar.',
              'Aquilo que chamamos de passado de um sistema costuma ser um conjunto de rastros que sobreviveram: logs, eventos, timestamps, commits, snapshots e registros criados enquanto o sistema mudava.',
            ],
          },
          {
            heading: 'Memória é uma construção',
            paragraphs: [
              'Uma história útil aparece quando organizamos esses rastros em uma ordem e inferimos o que deve ter acontecido entre eles. A qualidade dessa história depende do que foi registrado, do que desapareceu e das suposições que fazemos ao interpretá-la.',
              'É por isso que dois sistemas podem lembrar o mesmo acontecimento de maneiras diferentes sem que nenhum deles tenha literalmente armazenado o passado. Eles armazenaram evidências diferentes sobre um estado que já não existe.',
            ],
          },
          {
            heading: 'Bom software permite reconstrução',
            paragraphs: [
              'Quando um sistema precisa ser auditável, recuperável ou fácil de depurar, guardar apenas seu estado mais recente costuma ser insuficiente. Também precisamos de informação suficiente para entender como aquele estado se tornou possível.',
              'Isso não torna a história perfeitamente verdadeira. Torna a história reproduzível a partir de um conjunto conhecido de rastros, o que é uma propriedade muito mais útil para engenharia.',
            ],
          },
          {
            heading: 'O futuro é diferente',
            paragraphs: [
              'O passado pode ser reconstruído porque algo já aconteceu e deixou consequências. O futuro não possui esses rastros. Ele existe apenas como possibilidades que o estado presente pode permitir ou impedir.',
              'Software vive nessa assimetria: reconstrói continuamente o que aconteceu a partir do que restou, enquanto usa o presente para decidir quais próximos estados podem se tornar reais.',
            ],
          },
        ],
      },
    },
  },
];

export const featuredPublications = publications.filter((publication) => publication.featured);
