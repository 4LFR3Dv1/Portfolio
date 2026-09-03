import type { EditorialPublication } from './editorial-publications';

export const cohort003Publications: EditorialPublication[] = [
  {
    slug: 'onde-um-agente-existe',
    title: {
      en: 'Where does an agent exist?',
      pt: 'Onde um agente existe?',
    },
    kind: 'ESSAY',
    publishedAt: '2026-09-03',
    dateLabel: { en: '03 SEP 2026', pt: '03 SET 2026' },
    readTime: { en: '7 MIN READ', pt: '7 MIN DE LEITURA' },
    featured: false,
    topics: {
      en: ['agents', 'runtime', 'state'],
      pt: ['agentes', 'runtime', 'estado'],
    },
    copy: {
      en: {
        dek: 'A model may run in one service, tools in another, memory somewhere else and effects on external systems. Asking where an agent exists reveals that agency is distributed across several boundaries.',
        sections: [
          {
            heading: 'The model is not the whole agent',
            paragraphs: [
              'It is tempting to locate an agent wherever the language model is called. But the model may only receive a prompt and return a structured result. The process that decides when to call it, which tools are available and what happens next can live somewhere completely different.',
              'Once execution is distributed this way, saying that the agent is hosted in one place becomes imprecise. The model is a participant in a larger runtime rather than the complete operational object.',
            ],
          },
          {
            heading: 'State gives continuity a location',
            paragraphs: [
              'An agent that can continue work later needs durable identity beyond one inference. Tasks, permissions, journals, approvals and previous observations survive somewhere, and those surviving records are what allow a later process to continue the same work.',
              'This means persistence is not merely storage attached to the agent. It is part of what makes the agent recognizable across executions that may happen on different machines or through different model calls.',
            ],
          },
          {
            heading: 'Tools distribute agency further',
            paragraphs: [
              'A browser sandbox may run in one environment, a deployment worker in another and a payment signer behind a separate boundary. The agent can coordinate those capabilities without physically containing any of them.',
              'The useful unit is therefore not a single process. It is the relationship between identity, state, capabilities and the authority that connects them during an execution.',
            ],
          },
          {
            heading: 'Existence becomes an architectural question',
            paragraphs: [
              'For a simple chatbot, asking where the agent exists may not matter. For a system that can act, recover and accumulate consequences, the answer determines security, observability and responsibility.',
              'An agent may not exist at one address at all. It may exist as a durable operational identity reconstructed whenever the surrounding system gives that identity state, tools and a bounded right to continue.',
            ],
          },
        ],
      },
      pt: {
        dek: 'Um modelo pode rodar em um serviço, as ferramentas em outro, a memória em outro lugar e os efeitos em sistemas externos. Perguntar onde um agente existe revela que agência é distribuída entre várias fronteiras.',
        sections: [
          {
            heading: 'O modelo não é o agente inteiro',
            paragraphs: [
              'É tentador localizar um agente no lugar em que o modelo de linguagem é chamado. Mas o modelo pode apenas receber um prompt e devolver um resultado estruturado. O processo que decide quando chamá-lo, quais ferramentas estão disponíveis e o que acontece depois pode existir em outro lugar.',
              'Quando a execução é distribuída dessa forma, dizer que o agente está hospedado em um único ponto fica impreciso. O modelo é um participante de um runtime maior, não o objeto operacional inteiro.',
            ],
          },
          {
            heading: 'Estado dá uma localização para a continuidade',
            paragraphs: [
              'Um agente que consegue continuar o trabalho depois precisa de identidade durável além de uma inferência. Tarefas, permissões, journals, aprovações e observações anteriores sobrevivem em algum lugar, e são esses registros que permitem a outro processo continuar o mesmo trabalho.',
              'Persistência, portanto, não é apenas armazenamento anexado ao agente. Ela participa do que torna aquele agente reconhecível através de execuções que podem acontecer em máquinas diferentes ou por chamadas de modelo diferentes.',
            ],
          },
          {
            heading: 'Ferramentas distribuem a agência ainda mais',
            paragraphs: [
              'Uma sandbox de navegador pode rodar em um ambiente, um worker de deploy em outro e um signer de pagamento atrás de uma fronteira separada. O agente pode coordenar essas capacidades sem conter fisicamente nenhuma delas.',
              'A unidade útil deixa de ser um único processo. Passa a ser a relação entre identidade, estado, capacidades e a autoridade que as conecta durante uma execução.',
            ],
          },
          {
            heading: 'Existência vira uma pergunta arquitetural',
            paragraphs: [
              'Para um chatbot simples, perguntar onde o agente existe talvez não importe. Para um sistema capaz de agir, recuperar trabalho e acumular consequências, a resposta determina segurança, observabilidade e responsabilidade.',
              'Talvez um agente não exista em um único endereço. Talvez exista como uma identidade operacional durável, reconstruída sempre que o sistema ao redor fornece estado, ferramentas e um direito delimitado de continuar.',
            ],
          },
        ],
      },
    },
  },
  {
    slug: 'autonomia-e-uma-propriedade-do-agente-ou-do-sistema',
    title: {
      en: 'Is autonomy a property of the agent or of the system around it?',
      pt: 'Autonomia é uma propriedade do agente ou do sistema ao redor dele?',
    },
    kind: 'ESSAY',
    publishedAt: '2026-09-03',
    dateLabel: { en: '03 SEP 2026', pt: '03 SET 2026' },
    readTime: { en: '7 MIN READ', pt: '7 MIN DE LEITURA' },
    featured: false,
    topics: {
      en: ['agents', 'authority', 'coordination'],
      pt: ['agentes', 'autoridade', 'coordenação'],
    },
    copy: {
      en: {
        dek: 'An agent can generate plans and still have almost no autonomy. What it can actually do depends on the permissions, state transitions and external effects the surrounding system allows.',
        sections: [
          {
            heading: 'Intelligence does not create authority',
            paragraphs: [
              'A model may understand a repository, propose a migration and predict the next useful step. None of that gives it permission to merge code, spend money or redefine the task it was given.',
              'Capability answers whether an action can be produced. Authority answers whether that action is allowed to become real. Treating those questions as equivalent turns model competence into accidental power.',
            ],
          },
          {
            heading: 'Autonomy is shaped by transitions',
            paragraphs: [
              'In a controlled runtime, the agent does not move freely through every possible state. It proposes outputs that are checked against contracts, and deterministic machinery decides whether the work may advance, pause, recover or require review.',
              'The apparent autonomy of the agent is therefore partly an effect of which transitions the surrounding system exposes and under which conditions those transitions are admitted.',
            ],
          },
          {
            heading: 'More freedom can mean less useful autonomy',
            paragraphs: [
              'Giving an agent unrestricted tools can make it look powerful while making the overall system harder to trust. A worker that can widen scope, erase evidence or approve its own result is difficult to distinguish from an uncontrolled script with good language skills.',
              'Boundaries can increase practical autonomy because they make longer execution safe enough to permit. The system can allow more continuation precisely because the agent cannot silently redefine the rules.',
            ],
          },
          {
            heading: 'Autonomy belongs to the arrangement',
            paragraphs: [
              'An autonomous system is not simply a very capable model. It is an arrangement in which software can continue useful work while identity, permissions, evidence and acceptance remain coherent.',
              'The interesting engineering question is therefore not how autonomous the model is in isolation. It is how much independent action the whole system can sustain without losing control over meaning and consequences.',
            ],
          },
        ],
      },
      pt: {
        dek: 'Um agente pode gerar planos e ainda ter quase nenhuma autonomia. O que ele realmente consegue fazer depende das permissões, transições de estado e efeitos externos que o sistema ao redor permite.',
        sections: [
          {
            heading: 'Inteligência não cria autoridade',
            paragraphs: [
              'Um modelo pode compreender um repositório, propor uma migração e prever o próximo passo útil. Nada disso lhe dá permissão para fazer merge, gastar dinheiro ou redefinir a tarefa que recebeu.',
              'Capacidade responde se uma ação pode ser produzida. Autoridade responde se essa ação pode se tornar real. Tratar as duas perguntas como equivalentes transforma competência do modelo em poder acidental.',
            ],
          },
          {
            heading: 'Autonomia é moldada pelas transições',
            paragraphs: [
              'Em um runtime controlado, o agente não circula livremente por qualquer estado possível. Ele propõe resultados que são verificados contra contratos, e mecanismos determinísticos decidem se o trabalho pode avançar, pausar, recuperar ou exigir revisão.',
              'A autonomia aparente do agente é, portanto, parcialmente efeito de quais transições o sistema ao redor expõe e sob quais condições essas transições são admitidas.',
            ],
          },
          {
            heading: 'Mais liberdade pode produzir menos autonomia útil',
            paragraphs: [
              'Dar ferramentas irrestritas a um agente pode fazê-lo parecer poderoso ao mesmo tempo em que torna o sistema mais difícil de confiar. Um worker que pode ampliar escopo, apagar evidência ou aprovar o próprio resultado fica próximo demais de um script descontrolado com boa linguagem.',
              'Fronteiras podem aumentar autonomia prática porque tornam execuções mais longas seguras o bastante para serem permitidas. O sistema deixa o agente continuar mais justamente porque ele não consegue redefinir as regras silenciosamente.',
            ],
          },
          {
            heading: 'Autonomia pertence ao arranjo',
            paragraphs: [
              'Um sistema autônomo não é simplesmente um modelo muito capaz. É um arranjo no qual software consegue continuar trabalho útil enquanto identidade, permissões, evidência e aceitação permanecem coerentes.',
              'A pergunta de engenharia deixa de ser quão autônomo o modelo é isoladamente. Passa a ser quanta ação independente o sistema inteiro consegue sustentar sem perder controle sobre significado e consequências.',
            ],
          },
        ],
      },
    },
  },
  {
    slug: 'quando-software-deixa-de-ser-aplicacao-e-vira-infraestrutura',
    title: {
      en: 'When does software stop being an application and become infrastructure?',
      pt: 'Quando software deixa de ser aplicação e vira infraestrutura?',
    },
    kind: 'ESSAY',
    publishedAt: '2026-09-03',
    dateLabel: { en: '03 SEP 2026', pt: '03 SET 2026' },
    readTime: { en: '8 MIN READ', pt: '8 MIN DE LEITURA' },
    featured: false,
    topics: {
      en: ['infrastructure', 'software production', 'systems'],
      pt: ['infraestrutura', 'produção de software', 'sistemas'],
    },
    copy: {
      en: {
        dek: 'A product solves a task directly. Infrastructure changes the conditions under which many tasks can be performed. The boundary becomes visible when one system starts carrying other systems.',
        sections: [
          {
            heading: 'Applications consume capabilities',
            paragraphs: [
              'An application usually enters an environment that already provides identity, storage, networking, deployment and ways to observe failure. Its main job is to combine those capabilities into an experience for a particular problem.',
              'This makes the application dependent on a substrate it did not create. Much of what allows it to exist is outside the visible product surface.',
            ],
          },
          {
            heading: 'Infrastructure begins when the direction reverses',
            paragraphs: [
              'A system starts behaving like infrastructure when other software depends on its contracts rather than merely using its interface. A task runner becomes infrastructure when many workers rely on its state model. A browser becomes infrastructure when agents receive identity, permissions and execution primitives from it.',
              'The difference is not size. A small service can be infrastructural if removing it changes the conditions under which many other things can operate.',
            ],
          },
          {
            heading: 'Infrastructure carries policy',
            paragraphs: [
              'Once a system becomes a substrate, technical choices become institutional choices. Which states are durable, who may trigger an effect, what counts as evidence and how recovery works begin shaping every system built on top.',
              'Infrastructure therefore does more than provide reusable code. It establishes a grammar of possible behavior that downstream applications inherit whether they notice it or not.',
            ],
          },
          {
            heading: 'Building fewer products can create more capability',
            paragraphs: [
              'When the same problems of coordination, evidence, execution and recovery appear repeatedly, solving them inside each product becomes duplication. Moving those primitives downward can make future products thinner and faster to construct.',
              'That is the moment software starts to feel less like another application and more like infrastructure: the value is increasingly measured by what becomes possible above it.',
            ],
          },
        ],
      },
      pt: {
        dek: 'Um produto resolve uma tarefa diretamente. Infraestrutura muda as condições sob as quais muitas tarefas podem ser executadas. A fronteira aparece quando um sistema começa a carregar outros sistemas.',
        sections: [
          {
            heading: 'Aplicações consomem capacidades',
            paragraphs: [
              'Uma aplicação normalmente entra em um ambiente que já oferece identidade, armazenamento, rede, deploy e maneiras de observar falhas. Seu trabalho principal é combinar essas capacidades em uma experiência para um problema específico.',
              'Isso torna a aplicação dependente de um substrato que ela não criou. Muito do que permite que o produto exista está fora da superfície visível.',
            ],
          },
          {
            heading: 'Infraestrutura começa quando a direção se inverte',
            paragraphs: [
              'Um sistema começa a se comportar como infraestrutura quando outros softwares passam a depender de seus contratos, não apenas usar sua interface. Um task runner vira infraestrutura quando vários workers dependem de seu modelo de estado. Um navegador vira infraestrutura quando agentes recebem dele identidade, permissões e primitives de execução.',
              'A diferença não é tamanho. Um serviço pequeno pode ser infraestrutura se removê-lo muda as condições sob as quais muitas outras coisas conseguem operar.',
            ],
          },
          {
            heading: 'Infraestrutura carrega política',
            paragraphs: [
              'Quando um sistema vira substrato, escolhas técnicas também viram escolhas institucionais. Quais estados são duráveis, quem pode disparar um efeito, o que conta como evidência e como recovery funciona passam a moldar todos os sistemas construídos acima.',
              'Infraestrutura, portanto, faz mais do que oferecer código reutilizável. Ela estabelece uma gramática de comportamento possível que aplicações a jusante herdam mesmo quando não percebem.',
            ],
          },
          {
            heading: 'Construir menos produtos pode criar mais capacidade',
            paragraphs: [
              'Quando os mesmos problemas de coordenação, evidência, execução e recovery aparecem repetidamente, resolvê-los dentro de cada produto vira duplicação. Mover essas primitives para baixo pode tornar os próximos produtos mais finos e rápidos de construir.',
              'Esse é o momento em que software começa a parecer menos uma aplicação e mais infraestrutura: o valor passa a ser medido cada vez mais pelo que se torna possível acima dele.',
            ],
          },
        ],
      },
    },
  },
  {
    slug: 'como-um-sistema-sabe-que-alguma-coisa-aconteceu',
    title: {
      en: 'How does a system know that something happened?',
      pt: 'Como um sistema sabe que alguma coisa aconteceu?',
    },
    kind: 'ESSAY',
    publishedAt: '2026-09-03',
    dateLabel: { en: '03 SEP 2026', pt: '03 SET 2026' },
    readTime: { en: '8 MIN READ', pt: '8 MIN DE LEITURA' },
    featured: false,
    topics: {
      en: ['evidence', 'observation', 'state'],
      pt: ['evidência', 'observação', 'estado'],
    },
    copy: {
      en: {
        dek: 'A database row can say that an event occurred without proving the event itself. Reliable systems need to distinguish observation, evidence, interpretation and admission.',
        sections: [
          {
            heading: 'A statement is not the event',
            paragraphs: [
              'If a system stores that a contract was delivered, the row proves only that the system contains that statement. It does not automatically prove the physical delivery, who observed it or which source justified the claim.',
              'This distinction becomes important whenever software must make decisions about reality rather than merely about its own internal state.',
            ],
          },
          {
            heading: 'Observation creates a boundary',
            paragraphs: [
              'An observation says that a particular mechanism encountered a particular external state at a particular moment. Preserving the body, identifiers, timestamps and digests makes that encounter inspectable later without pretending that the observer was omniscient.',
              'The observation is already stronger than an unsupported claim, but it still does not decide what the observed material means.',
            ],
          },
          {
            heading: 'Evidence does not interpret itself',
            paragraphs: [
              'A document may prove that an authorization was issued while saying nothing about whether the goods were delivered. A network transaction may prove that bytes were accepted while saying nothing about whether the intended business obligation was satisfied.',
              'Systems need explicit interpretation rules because the same evidence can support one claim and fail to support another that sounds superficially similar.',
            ],
          },
          {
            heading: 'Knowledge is admitted, not discovered magically',
            paragraphs: [
              'A system can know something operationally when it can point to the observation, preserve the evidence, apply a declared interpretation and admit the resulting claim under rules that other parts of the system understand.',
              'That knowledge is never the event itself. It is a disciplined relationship between what happened outside, what was observed and what the system is willing to treat as true enough to act on.',
            ],
          },
        ],
      },
      pt: {
        dek: 'Uma linha no banco pode dizer que um evento aconteceu sem provar o evento em si. Sistemas confiáveis precisam distinguir observação, evidência, interpretação e admissão.',
        sections: [
          {
            heading: 'Uma afirmação não é o acontecimento',
            paragraphs: [
              'Se um sistema registra que um contrato foi entregue, a linha prova apenas que o sistema contém essa afirmação. Ela não prova automaticamente a entrega física, quem a observou ou qual fonte justificou o claim.',
              'Essa diferença importa sempre que software precisa tomar decisões sobre a realidade e não apenas sobre o próprio estado interno.',
            ],
          },
          {
            heading: 'Observação cria uma fronteira',
            paragraphs: [
              'Uma observação diz que um mecanismo específico encontrou um estado externo específico em determinado momento. Preservar corpo, identificadores, timestamps e digests torna esse encontro inspecionável depois sem fingir que o observador era onisciente.',
              'A observação já é mais forte do que uma afirmação sem suporte, mas ainda não decide o significado do material observado.',
            ],
          },
          {
            heading: 'Evidência não se interpreta sozinha',
            paragraphs: [
              'Um documento pode provar que uma autorização foi emitida sem dizer nada sobre a entrega dos bens. Uma transação de rede pode provar que bytes foram aceitos sem dizer se a obrigação econômica pretendida foi cumprida.',
              'Sistemas precisam de regras explícitas de interpretação porque a mesma evidência pode sustentar um claim e não sustentar outro que parece superficialmente parecido.',
            ],
          },
          {
            heading: 'Conhecimento é admitido, não descoberto magicamente',
            paragraphs: [
              'Um sistema pode saber algo operacionalmente quando consegue apontar para a observação, preservar a evidência, aplicar uma interpretação declarada e admitir o claim resultante sob regras compreendidas pelo restante do sistema.',
              'Esse conhecimento nunca é o acontecimento em si. É uma relação disciplinada entre o que ocorreu fora, o que foi observado e aquilo que o sistema aceita tratar como verdadeiro o bastante para agir.',
            ],
          },
        ],
      },
    },
  },
  {
    slug: 'o-estado-e-uma-coisa-ou-uma-afirmacao-sobre-uma-coisa',
    title: {
      en: 'Is state a thing or a claim about a thing?',
      pt: 'O estado é uma coisa ou uma afirmação sobre uma coisa?',
    },
    kind: 'ESSAY',
    publishedAt: '2026-09-03',
    dateLabel: { en: '03 SEP 2026', pt: '03 SET 2026' },
    readTime: { en: '7 MIN READ', pt: '7 MIN DE LEITURA' },
    featured: false,
    topics: {
      en: ['state', 'causality', 'evidence'],
      pt: ['estado', 'causalidade', 'evidência'],
    },
    copy: {
      en: {
        dek: 'Software often talks about state as if it were the world itself. But many important states are claims assembled from observations, rules and relationships between surviving evidence.',
        sections: [
          {
            heading: 'Internal state can be directly material',
            paragraphs: [
              'Inside a process, some states are straightforward: a byte has one value, a row exists, a file has a digest. The system can inspect those facts because they are part of its own material configuration.',
              'Confusion begins when the same language is used for external reality. A field called delivered may look just as concrete as a byte while actually depending on interpretation of events outside the machine.',
            ],
          },
          {
            heading: 'External state arrives through claims',
            paragraphs: [
              'A system rarely possesses a contract, a delivery or a human decision in the same way it possesses memory. It receives documents, messages, signatures, timestamps and observations from which it constructs claims about those things.',
              'The claim may be extremely reliable, but reliability does not turn the representation into the underlying event.',
            ],
          },
          {
            heading: 'Relations change what a claim means',
            paragraphs: [
              'One record can correct another, supersede it, contradict it or corroborate it. If state is reduced to the latest row, those relationships disappear and the system loses the reason why one account should be preferred over another.',
              'Causal and temporal relations make state less like a single value and more like an admitted interpretation over a graph of surviving evidence.',
            ],
          },
          {
            heading: 'State can be material and epistemic at once',
            paragraphs: [
              'The useful distinction is not that state is unreal. The claim itself is materially present in the system and can deterministically influence future behavior. What must remain explicit is what that claim refers to and why it was admitted.',
              'A mature system therefore knows both its own state and the epistemic status of the statements it carries about the world outside it.',
            ],
          },
        ],
      },
      pt: {
        dek: 'Software costuma falar de estado como se fosse o próprio mundo. Mas muitos estados importantes são claims montados a partir de observações, regras e relações entre evidências que sobreviveram.',
        sections: [
          {
            heading: 'Estado interno pode ser diretamente material',
            paragraphs: [
              'Dentro de um processo, alguns estados são diretos: um byte possui um valor, uma linha existe, um arquivo tem um digest. O sistema consegue inspecionar esses fatos porque eles fazem parte de sua própria configuração material.',
              'A confusão começa quando a mesma linguagem é usada para a realidade externa. Um campo chamado entregue pode parecer tão concreto quanto um byte enquanto depende, na verdade, da interpretação de acontecimentos fora da máquina.',
            ],
          },
          {
            heading: 'Estado externo chega através de claims',
            paragraphs: [
              'Um sistema raramente possui um contrato, uma entrega ou uma decisão humana da mesma forma que possui memória. Ele recebe documentos, mensagens, assinaturas, timestamps e observações a partir dos quais constrói afirmações sobre essas coisas.',
              'O claim pode ser extremamente confiável, mas confiabilidade não transforma a representação no acontecimento subjacente.',
            ],
          },
          {
            heading: 'Relações mudam o significado de um claim',
            paragraphs: [
              'Um registro pode corrigir outro, substituí-lo, contradizê-lo ou corroborá-lo. Se estado for reduzido à linha mais recente, essas relações desaparecem e o sistema perde o motivo pelo qual um relato deveria ser preferido a outro.',
              'Relações causais e temporais fazem o estado parecer menos um único valor e mais uma interpretação admitida sobre um grafo de evidências que sobreviveram.',
            ],
          },
          {
            heading: 'Estado pode ser material e epistêmico ao mesmo tempo',
            paragraphs: [
              'A distinção útil não é dizer que o estado é irreal. O próprio claim está materialmente presente no sistema e pode influenciar deterministicamente o comportamento futuro. O que precisa continuar explícito é a que ele se refere e por que foi admitido.',
              'Um sistema maduro conhece tanto o próprio estado quanto o status epistêmico das afirmações que carrega sobre o mundo fora dele.',
            ],
          },
        ],
      },
    },
  },
  {
    slug: 'o-usuario-final-de-um-computador-precisa-ser-humano',
    title: {
      en: 'Does the end user of a computer need to be human?',
      pt: 'O usuário final de um computador precisa ser humano?',
    },
    kind: 'ESSAY',
    publishedAt: '2026-09-03',
    dateLabel: { en: '03 SEP 2026', pt: '03 SET 2026' },
    readTime: { en: '8 MIN READ', pt: '8 MIN DE LEITURA' },
    featured: false,
    topics: {
      en: ['computing', 'agents', 'interfaces'],
      pt: ['computação', 'agentes', 'interfaces'],
    },
    copy: {
      en: {
        dek: 'Modern computers are organized around a person looking at a screen. Agents introduce another class of participant that may need computation without pretending to be that person.',
        sections: [
          {
            heading: 'The desktop encodes a human assumption',
            paragraphs: [
              'Windows, icons, menus, cursors and notifications make sense because a person is expected to interpret visual state and decide what happens next. Even background services usually exist to support some eventual human-facing application.',
              'This organization became so normal that it is easy to confuse one historical interface model with the definition of a computer itself.',
            ],
          },
          {
            heading: 'Agents are not simply faster users',
            paragraphs: [
              'Software agents can read structured state directly, wait without occupying a screen and coordinate many operations at once. Forcing them through interfaces designed for eyes and hands can be useful for compatibility, but it is not necessarily their natural operating environment.',
              'An agent that clicks buttons may be using a human protocol because no machine-native contract exists yet, not because clicking is intrinsically part of computation.',
            ],
          },
          {
            heading: 'Machine-native access still needs human authority',
            paragraphs: [
              'Removing the graphical interface from an agent does not mean removing people from control. Humans may still define goals, permissions, economic limits and acceptance rules while software interacts with lower-level primitives directly.',
              'The distinction is between who holds authority and who performs the immediate operation. Those roles do not have to be the same participant.',
            ],
          },
          {
            heading: 'A computer can have more than one kind of user',
            paragraphs: [
              'The useful future may not be a machine built for agents instead of people. It may be a system where people and software have different interfaces to the same underlying capabilities, each with explicit identity and boundaries.',
              'Once that possibility is taken seriously, the end user stops being a single category. The computer becomes an environment in which different kinds of actors can participate without pretending to be one another.',
            ],
          },
        ],
      },
      pt: {
        dek: 'Computadores modernos são organizados em torno de uma pessoa olhando para uma tela. Agentes introduzem outra classe de participante que pode precisar de computação sem fingir ser essa pessoa.',
        sections: [
          {
            heading: 'O desktop codifica uma suposição humana',
            paragraphs: [
              'Janelas, ícones, menus, cursores e notificações fazem sentido porque uma pessoa deve interpretar o estado visual e decidir o que acontece depois. Até serviços em background normalmente existem para sustentar alguma aplicação que eventualmente encontra um humano.',
              'Essa organização ficou tão normal que é fácil confundir um modelo histórico de interface com a própria definição de computador.',
            ],
          },
          {
            heading: 'Agentes não são simplesmente usuários mais rápidos',
            paragraphs: [
              'Agentes de software conseguem ler estado estruturado diretamente, esperar sem ocupar uma tela e coordenar muitas operações ao mesmo tempo. Forçá-los a passar por interfaces criadas para olhos e mãos pode ser útil por compatibilidade, mas não é necessariamente seu ambiente natural.',
              'Um agente que clica em botões pode estar usando um protocolo humano porque ainda não existe um contrato machine-native, não porque clicar seja parte intrínseca da computação.',
            ],
          },
          {
            heading: 'Acesso machine-native ainda precisa de autoridade humana',
            paragraphs: [
              'Remover a interface gráfica do agente não significa remover pessoas do controle. Humanos ainda podem definir objetivos, permissões, limites econômicos e regras de aceitação enquanto software interage diretamente com primitives mais baixas.',
              'A diferença está entre quem possui autoridade e quem executa a operação imediata. Esses papéis não precisam pertencer ao mesmo participante.',
            ],
          },
          {
            heading: 'Um computador pode ter mais de um tipo de usuário',
            paragraphs: [
              'O futuro útil talvez não seja uma máquina feita para agentes em vez de pessoas. Pode ser um sistema em que pessoas e software possuem interfaces diferentes para as mesmas capacidades subjacentes, cada um com identidade e fronteiras explícitas.',
              'Quando essa possibilidade é levada a sério, usuário final deixa de ser uma categoria única. O computador vira um ambiente no qual tipos diferentes de atores podem participar sem precisar fingir que são iguais.',
            ],
          },
        ],
      },
    },
  },
];
