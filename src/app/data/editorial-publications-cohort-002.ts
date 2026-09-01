import type { EditorialPublication } from './editorial-publications';

export const cohort002Publications: EditorialPublication[] = [
  {
    slug: 'quando-produzir-software-deixa-de-ser-o-gargalo',
    title: {
      en: 'What changes when producing software stops being the bottleneck?',
      pt: 'O que muda quando produzir software deixa de ser o gargalo?',
    },
    kind: 'ESSAY',
    publishedAt: '2026-08-31',
    dateLabel: { en: '31 AUG 2026', pt: '31 AGO 2026' },
    readTime: { en: '7 MIN READ', pt: '7 MIN DE LEITURA' },
    featured: false,
    topics: {
      en: ['software production', 'AI agents', 'review'],
      pt: ['produção de software', 'agentes de IA', 'revisão'],
    },
    copy: {
      en: {
        dek: 'When writing the change gets cheap, the difficult work moves toward deciding what should exist, bounding the work and accepting the result without turning speed into noise.',
        sections: [
          {
            heading: 'Speed moves scarcity somewhere else',
            paragraphs: [
              'For most of software history, implementation consumed a large part of the cost. An idea could wait days or weeks until someone had enough uninterrupted time to translate it into code, tests and a deployable change.',
              'Agents compress part of that interval. A change that once occupied an afternoon may appear in minutes. But the disappearance of one delay does not make production free. It exposes the work that had been hidden behind implementation time.',
            ],
          },
          {
            heading: 'Generating a change is not producing software',
            paragraphs: [
              'A repository can receive code faster than a product can safely absorb it. Someone still has to decide what problem is being solved, which files may change, what must remain true and what evidence is enough to accept the result.',
              'Building Factory made this distinction concrete for me. Coordination and execution became different responsibilities. The worker can produce a bounded delta, but it does not get to define the task, widen its own authority or declare the result accepted.',
            ],
          },
          {
            heading: 'Review becomes part of production capacity',
            paragraphs: [
              'When implementation is expensive, review can feel like the last step after the real work. When implementation becomes abundant, review becomes one of the scarce resources that determines throughput.',
              'The important question stops being how many changes can be generated. It becomes how many changes can be understood, checked, integrated and carried forward without making the system less coherent than it was before.',
            ],
          },
          {
            heading: 'The bottleneck returns to judgment',
            paragraphs: [
              'Faster implementation does not eliminate engineering work. It moves the center of gravity toward selection, decomposition, boundaries, evidence, sequencing and acceptance. Producing more becomes easy enough that deciding what deserves to exist matters more.',
              'A software production system built around agents may therefore be limited less by typing speed than by judgment. The scarce capability is not making a change appear. It is knowing which change should become part of the system.',
            ],
          },
        ],
      },
      pt: {
        dek: 'Quando escrever a mudança fica barato, o trabalho difícil se desloca para decidir o que deve existir, delimitar o trabalho e aceitar o resultado sem transformar velocidade em ruído.',
        sections: [
          {
            heading: 'Velocidade desloca a escassez',
            paragraphs: [
              'Durante boa parte da história do software, implementar consumia uma parte enorme do custo. Uma ideia podia esperar dias ou semanas até alguém ter tempo contínuo suficiente para transformá-la em código, testes e uma mudança capaz de chegar ao produto.',
              'Agentes comprimem parte desse intervalo. Uma mudança que antes ocupava uma tarde pode aparecer em minutos. Mas o desaparecimento de uma espera não torna a produção gratuita. Ele apenas expõe o trabalho que ficava escondido atrás do tempo de implementação.',
            ],
          },
          {
            heading: 'Gerar uma mudança não é produzir software',
            paragraphs: [
              'Um repositório consegue receber código mais rápido do que um produto consegue absorvê-lo com segurança. Ainda é preciso decidir qual problema está sendo resolvido, quais arquivos podem mudar, o que precisa continuar verdadeiro e qual evidência é suficiente para aceitar o resultado.',
              'Construir Factory tornou essa diferença concreta para mim. Coordenação e execução viraram responsabilidades diferentes. O worker pode produzir um delta delimitado, mas não ganha o direito de definir a própria tarefa, ampliar a própria autoridade ou declarar o resultado aceito.',
            ],
          },
          {
            heading: 'Revisão vira parte da capacidade produtiva',
            paragraphs: [
              'Quando implementar é caro, revisão pode parecer a etapa final depois do trabalho de verdade. Quando implementar se torna abundante, revisão passa a ser um dos recursos escassos que determinam o throughput.',
              'A pergunta importante deixa de ser quantas mudanças podem ser geradas. Passa a ser quantas mudanças podem ser compreendidas, verificadas, integradas e carregadas adiante sem deixar o sistema menos coerente do que estava antes.',
            ],
          },
          {
            heading: 'O gargalo volta para o julgamento',
            paragraphs: [
              'Implementação mais rápida não elimina trabalho de engenharia. Ela desloca o centro de gravidade para seleção, decomposição, limites, evidência, sequência e aceitação. Produzir mais fica fácil o bastante para que decidir o que merece existir passe a importar mais.',
              'Um sistema de produção de software construído em torno de agentes talvez seja limitado menos pela velocidade de escrever código e mais pela qualidade do julgamento. A capacidade escassa não é fazer uma mudança aparecer. É saber qual mudança deve passar a fazer parte do sistema.',
            ],
          },
        ],
      },
    },
  },
  {
    slug: 'o-que-faz-uma-presenca-digital-continuar-sendo-a-mesma',
    title: {
      en: 'What makes a digital presence continue being the same one?',
      pt: 'O que faz uma presença digital continuar sendo a mesma?',
    },
    kind: 'ESSAY',
    publishedAt: '2026-08-31',
    dateLabel: { en: '31 AUG 2026', pt: '31 AGO 2026' },
    readTime: { en: '7 MIN READ', pt: '7 MIN DE LEITURA' },
    featured: false,
    topics: {
      en: ['AI', 'identity', 'continuity'],
      pt: ['IA', 'identidade', 'continuidade'],
    },
    copy: {
      en: {
        dek: 'An assistant can answer one message well and still fail to exist as a presence. Continuity appears when identity, memory, actions and limits survive across interactions.',
        sections: [
          {
            heading: 'A good answer does not create continuity',
            paragraphs: [
              'A language model can produce an excellent response without knowing who it spoke to yesterday, what it promised, which action it started or whether a person took over the conversation in the meantime.',
              'That is enough for a chat interface. It is not enough for a presence that is expected to remain recognizable over hours, days and different channels. The problem stops being response quality alone and becomes continuity of state.',
            ],
          },
          {
            heading: 'Memory has to belong to someone',
            paragraphs: [
              'While designing Lisa, contact, conversation, message and action became separate objects for a reason. A memory is useful only when the system can say whose memory it is, which conversation produced it and under which configuration it was created.',
              'Without those boundaries, more context can make the system less trustworthy rather than more intelligent. Continuity is not the accumulation of everything. It is the preservation of the right relationships between facts.',
            ],
          },
          {
            heading: 'Acting changes what identity means',
            paragraphs: [
              'The moment a digital presence can execute tools, schedule work, wait for approval or hand a conversation to a person, identity stops being only a tone of voice. Actions create consequences that must still belong to the same operational history later.',
              'This is why handoff, approval, retry and recovery matter to product identity. A presence that forgets who is currently responsible for the conversation is not merely inconsistent; it can perform the wrong action under the wrong authority.',
            ],
          },
          {
            heading: 'Presence is continuity under limits',
            paragraphs: [
              'The useful version of a persistent AI presence is not one that remembers everything or acts everywhere. It is one that can continue from previous state while still knowing what it may do, what requires another person and what evidence must survive a failure.',
              'What makes the presence feel like the same one is therefore not a character sheet alone. It is the continuity between identity, memory, action and responsibility as the surrounding system changes.',
            ],
          },
        ],
      },
      pt: {
        dek: 'Uma assistente pode responder muito bem a uma mensagem e ainda assim não existir como presença. Continuidade aparece quando identidade, memória, ações e limites sobrevivem entre interações.',
        sections: [
          {
            heading: 'Uma boa resposta não cria continuidade',
            paragraphs: [
              'Um modelo de linguagem pode produzir uma resposta excelente sem saber com quem falou ontem, o que prometeu, qual ação iniciou ou se uma pessoa assumiu a conversa nesse intervalo.',
              'Isso pode bastar para uma interface de chat. Não basta para uma presença que precisa continuar reconhecível ao longo de horas, dias e canais diferentes. O problema deixa de ser apenas qualidade de resposta e passa a ser continuidade de estado.',
            ],
          },
          {
            heading: 'Memória precisa pertencer a alguém',
            paragraphs: [
              'Ao desenhar Lisa, contato, conversa, mensagem e ação viraram objetos separados por um motivo. Uma memória só é útil quando o sistema consegue dizer de quem ela é, em qual conversa surgiu e sob qual configuração foi produzida.',
              'Sem essas fronteiras, adicionar contexto pode tornar o sistema menos confiável em vez de mais inteligente. Continuidade não é acumular tudo. É preservar as relações corretas entre os fatos.',
            ],
          },
          {
            heading: 'Agir muda o significado de identidade',
            paragraphs: [
              'No momento em que uma presença digital consegue executar ferramentas, agendar trabalho, aguardar aprovação ou transferir uma conversa para uma pessoa, identidade deixa de ser apenas tom de voz. Ações criam consequências que ainda precisam pertencer à mesma história operacional depois.',
              'É por isso que handoff, aprovação, retry e recovery também são problemas de identidade de produto. Uma presença que esquece quem está responsável pela conversa não é apenas inconsistente; ela pode realizar a ação errada sob a autoridade errada.',
            ],
          },
          {
            heading: 'Presença é continuidade sob limites',
            paragraphs: [
              'A versão útil de uma presença persistente de IA não é aquela que lembra tudo ou age em qualquer lugar. É aquela que consegue continuar a partir do estado anterior sem esquecer o que pode fazer, o que exige outra pessoa e qual evidência precisa sobreviver quando algo falha.',
              'O que faz essa presença parecer a mesma, portanto, não é apenas uma personalidade escrita. É a continuidade entre identidade, memória, ação e responsabilidade enquanto o sistema ao redor muda.',
            ],
          },
        ],
      },
    },
  },
  {
    slug: 'o-que-significa-duas-pessoas-estarem-no-mesmo-agora',
    title: {
      en: 'What does it mean for two people to be in the same now?',
      pt: 'O que significa duas pessoas estarem no mesmo agora?',
    },
    kind: 'ESSAY',
    publishedAt: '2026-08-31',
    dateLabel: { en: '31 AUG 2026', pt: '31 AGO 2026' },
    readTime: { en: '7 MIN READ', pt: '7 MIN DE LEITURA' },
    featured: false,
    topics: {
      en: ['real time', 'multiplayer', 'state'],
      pt: ['tempo real', 'multiplayer', 'estado'],
    },
    copy: {
      en: {
        dek: 'Real time is not only about receiving data quickly. A shared present exists when different participants are governed by the same event, deadline and resolution.',
        sections: [
          {
            heading: 'Real time is not just arriving fast',
            paragraphs: [
              'Two screens can receive updates within milliseconds and still disagree about what is happening. Latency tells us how quickly information travelled; it does not tell us whether participants are living inside the same state transition.',
              'VIRA made this distinction visible because a live match is already moving outside the software. The product cannot choose when a goal happened or quietly invent a different result for each participant. It has to join an external sequence of events.',
            ],
          },
          {
            heading: 'The present needs an authority',
            paragraphs: [
              'A synchronized challenge needs one deadline, one admitted set of answers and one event that is allowed to resolve the round. If each browser can decide those things locally, there is no shared now, only several approximations of it.',
              'The server therefore owns the lock and the sports-data observation owns the event that follows it. Every participant can have a different device and network delay while still being reconciled against the same temporal boundary.',
            ],
          },
          {
            heading: 'Not everything should become shared immediately',
            paragraphs: [
              'A shared state does not mean exposing every local state. Before the deadline, a player answer can remain private even while the existence of the round and its closing time are common to everyone.',
              'Only after the lock does the system turn private decisions into a shared result, points and ranking. Synchronization is therefore also a decision about what becomes common, and when.',
            ],
          },
          {
            heading: 'A shared present should leave reconstructable traces',
            paragraphs: [
              'Once the match moves on, the live moment disappears. If we want to verify that two participants really experienced the same round, we need enough surviving evidence to reconstruct the ordering: open, answer, lock, observation, resolution and score.',
              'Real-time systems are often described as if only the current moment mattered. In practice, trust in the current moment depends on whether the system can later explain how that moment became shared.',
            ],
          },
        ],
      },
      pt: {
        dek: 'Tempo real não é apenas receber dados rapidamente. Um presente compartilhado existe quando participantes diferentes estão submetidos ao mesmo evento, ao mesmo limite temporal e à mesma resolução.',
        sections: [
          {
            heading: 'Tempo real não é apenas chegar rápido',
            paragraphs: [
              'Duas telas podem receber atualizações em milissegundos e ainda discordar sobre o que está acontecendo. Latência diz quão rápido uma informação viajou; não diz se os participantes estão vivendo dentro da mesma transição de estado.',
              'VIRA tornou essa diferença visível porque uma partida ao vivo já está mudando fora do software. O produto não pode escolher quando um gol aconteceu nem inventar silenciosamente um resultado diferente para cada participante. Ele precisa entrar em uma sequência externa de acontecimentos.',
            ],
          },
          {
            heading: 'O presente precisa de uma autoridade',
            paragraphs: [
              'Um desafio sincronizado precisa de um único deadline, um conjunto definido de respostas admitidas e um evento autorizado a resolver a rodada. Se cada navegador puder decidir essas coisas localmente, não existe um agora compartilhado, apenas várias aproximações dele.',
              'Por isso o servidor possui o lock e a observação dos dados esportivos possui o evento que vem depois. Cada participante pode ter um dispositivo e um atraso de rede diferentes e ainda assim ser reconciliado contra a mesma fronteira temporal.',
            ],
          },
          {
            heading: 'Nem tudo deve se tornar compartilhado imediatamente',
            paragraphs: [
              'Estado compartilhado não significa expor todo estado local. Antes do deadline, a resposta de uma pessoa pode continuar privada mesmo enquanto a existência da rodada e o horário em que ela fecha são comuns a todos.',
              'Somente depois do lock o sistema transforma decisões privadas em resultado, pontos e ranking compartilhados. Sincronizar também é decidir o que se torna comum — e em qual momento.',
            ],
          },
          {
            heading: 'Um presente compartilhado precisa deixar rastros reconstruíveis',
            paragraphs: [
              'Quando a partida segue adiante, o momento ao vivo desaparece. Se quisermos verificar que dois participantes realmente viveram a mesma rodada, precisamos preservar evidência suficiente para reconstruir a ordem: abrir, responder, travar, observar, resolver e pontuar.',
              'Sistemas em tempo real costumam ser descritos como se apenas o instante atual importasse. Na prática, a confiança nesse instante depende de o sistema conseguir explicar depois como ele se tornou compartilhado.',
            ],
          },
        ],
      },
    },
  },
  {
    slug: 'pagar-e-executar-uma-transacao-ou-cumprir-uma-obrigacao',
    title: {
      en: 'Is paying executing a transaction or fulfilling an obligation?',
      pt: 'Pagar é executar uma transação ou cumprir uma obrigação?',
    },
    kind: 'ESSAY',
    publishedAt: '2026-08-31',
    dateLabel: { en: '31 AUG 2026', pt: '31 AGO 2026' },
    readTime: { en: '8 MIN READ', pt: '8 MIN DE LEITURA' },
    featured: false,
    topics: {
      en: ['payments', 'authority', 'stablecoins'],
      pt: ['pagamentos', 'autoridade', 'stablecoins'],
    },
    copy: {
      en: {
        dek: 'A network can tell us that a transaction happened. A payment system has to know whether the right obligation was fulfilled, and those are not the same question.',
        sections: [
          {
            heading: 'A transaction is evidence, not the whole payment',
            paragraphs: [
              'Blockchains are very good at answering mechanical questions: which bytes were signed, which transaction was accepted, what balances changed and what state is visible now.',
              'A business obligation begins earlier. Someone intended to pay a particular recipient, a particular amount, in a particular asset, under a particular policy. A successful transaction can still be the wrong payment if it does not satisfy that obligation.',
            ],
          },
          {
            heading: 'Authority has to exist before the signature',
            paragraphs: [
              'If an application or agent asks to pay five units, that request should not silently become permission to change the recipient, increase the amount, choose another asset or sign arbitrary future operations.',
              'Foundry Pay separates the decision that an economic obligation is allowed from the machinery that prepares, signs and broadcasts exact network bytes. The signer proves authorization over a specific operation; it does not become the owner of economic intent.',
            ],
          },
          {
            heading: 'An unknown result is an economic state',
            paragraphs: [
              'Networks fail in uncomfortable places. A transaction can be accepted while the response disappears. At that moment the application does not know whether the obligation is still unpaid or has already been fulfilled.',
              'Blindly sending another transaction turns uncertainty into the possibility of a duplicate payment. Recovery and independent observation are therefore not operational details after payment; they are part of deciding what the payment currently means.',
            ],
          },
          {
            heading: 'A channel turns payment into a relationship',
            paragraphs: [
              'Foundry Channels pushes the same idea further. Instead of treating every transfer as an isolated event, a channel represents a persistent funded relationship whose issued, activated, settled and refundable states evolve over time.',
              'That changes the unit we reason about. The interesting object is no longer only a transaction. It is the obligation and the relationship that transactions can materialize, update or prove.',
            ],
          },
        ],
      },
      pt: {
        dek: 'Uma rede consegue dizer que uma transação aconteceu. Um sistema de pagamento precisa saber se a obrigação correta foi cumprida — e essas duas perguntas não são iguais.',
        sections: [
          {
            heading: 'Uma transação é evidência, não o pagamento inteiro',
            paragraphs: [
              'Blockchains são muito boas em responder perguntas mecânicas: quais bytes foram assinados, qual transação foi aceita, quais saldos mudaram e qual estado está visível agora.',
              'Uma obrigação econômica começa antes. Alguém pretendia pagar um destinatário específico, um valor específico, em um ativo específico e sob uma política específica. Uma transação bem-sucedida ainda pode ser o pagamento errado se não satisfizer essa obrigação.',
            ],
          },
          {
            heading: 'Autoridade precisa existir antes da assinatura',
            paragraphs: [
              'Se uma aplicação ou agente pede para pagar cinco unidades, esse pedido não deveria virar silenciosamente permissão para trocar o destinatário, aumentar o valor, escolher outro ativo ou assinar operações futuras arbitrárias.',
              'Foundry Pay separa a decisão de que uma obrigação econômica é permitida da maquinaria que prepara, assina e transmite bytes exatos para a rede. O signer prova autorização sobre uma operação específica; ele não vira dono da intenção econômica.',
            ],
          },
          {
            heading: 'Resultado desconhecido é um estado econômico',
            paragraphs: [
              'Redes falham em lugares desconfortáveis. Uma transação pode ser aceita enquanto a resposta desaparece. Nesse momento a aplicação não sabe se a obrigação continua pendente ou se já foi cumprida.',
              'Enviar outra transação às cegas transforma incerteza em possibilidade de pagamento duplicado. Recovery e observação independente, portanto, não são detalhes operacionais depois do pagamento; fazem parte de decidir o que aquele pagamento significa agora.',
            ],
          },
          {
            heading: 'Um canal transforma pagamento em relação',
            paragraphs: [
              'Foundry Channels leva a mesma ideia adiante. Em vez de tratar cada transferência como um evento isolado, um canal representa uma relação financiada persistente cujos estados emitido, ativado, liquidado e reembolsável evoluem com o tempo.',
              'Isso muda a unidade sobre a qual raciocinamos. O objeto interessante deixa de ser apenas uma transação. Passa a ser a obrigação e a relação que transações podem materializar, atualizar ou provar.',
            ],
          },
        ],
      },
    },
  },
  {
    slug: 'quando-o-resultado-e-desconhecido-repetir-e-uma-nova-acao',
    title: {
      en: 'When the result is unknown, is repeating a new action?',
      pt: 'Quando o resultado é desconhecido, repetir é uma nova ação?',
    },
    kind: 'ESSAY',
    publishedAt: '2026-08-31',
    dateLabel: { en: '31 AUG 2026', pt: '31 AGO 2026' },
    readTime: { en: '7 MIN READ', pt: '7 MIN DE LEITURA' },
    featured: false,
    topics: {
      en: ['recovery', 'agents', 'distributed systems'],
      pt: ['recovery', 'agentes', 'sistemas distribuídos'],
    },
    copy: {
      en: {
        dek: 'A timeout does not prove that nothing happened. In systems that create real effects, repeating without knowing can create a second effect instead of recovering the first one.',
        sections: [
          {
            heading: 'A timeout belongs to the observer',
            paragraphs: [
              'When an application sends a request and receives no answer, the easiest story is that the operation failed. But the missing response only proves something about what the application observed. It says nothing by itself about what happened on the other side.',
              'A network may have accepted the transaction, a process may have committed state or an external system may have completed the action before the response was lost. The observer is uncertain; reality does not become undone because the acknowledgement disappeared.',
            ],
          },
          {
            heading: 'Uncertainty is a state, not an error message',
            paragraphs: [
              'If the system collapses every ambiguous outcome into failure, retry becomes automatic. For read-only operations that may be harmless. For payments, deployments or any action with durable effects, it can be destructive.',
              'Solana-Agent treats an ambiguous submission as something that must be recovered. The runtime preserves enough identity to ask about the original attempt instead of manufacturing another one immediately.',
            ],
          },
          {
            heading: 'Record before acting',
            paragraphs: [
              'Recovery is only possible when the system knows what it was trying to do. Intent, authorization and execution identity need to survive before the irreversible boundary is crossed.',
              'This changes persistence from an audit feature into part of execution semantics. A journal is not merely a record we inspect later; it is what allows the runtime to distinguish continuing the same action from beginning a new one.',
            ],
          },
          {
            heading: 'Recovery is not retry',
            paragraphs: [
              'Retry asks the world to perform an operation again. Recovery asks the world what happened to an operation that may already have occurred. Those are different causal requests even when the user experience begins with the same spinner.',
              'For agentic systems, this distinction becomes increasingly important. The more independently software can act, the more carefully it must know when another attempt is continuation, when it is duplication and when only new evidence can decide.',
            ],
          },
        ],
      },
      pt: {
        dek: 'Um timeout não prova que nada aconteceu. Em sistemas que produzem efeitos reais, repetir sem saber pode criar um segundo efeito em vez de recuperar o primeiro.',
        sections: [
          {
            heading: 'Um timeout pertence ao observador',
            paragraphs: [
              'Quando uma aplicação envia uma solicitação e não recebe resposta, a história mais fácil é dizer que a operação falhou. Mas a ausência da resposta prova apenas algo sobre o que a aplicação observou. Sozinha, ela não diz o que aconteceu do outro lado.',
              'Uma rede pode ter aceitado a transação, um processo pode ter persistido estado ou um sistema externo pode ter concluído a ação antes de a resposta se perder. O observador ficou incerto; a realidade não é desfeita porque o acknowledgement desapareceu.',
            ],
          },
          {
            heading: 'Incerteza é um estado, não uma mensagem de erro',
            paragraphs: [
              'Se o sistema reduz todo resultado ambíguo a falha, retry vira automático. Para operações somente de leitura isso pode ser inofensivo. Para pagamentos, deploys ou qualquer ação com efeito durável, pode ser destrutivo.',
              'Solana-Agent trata uma submissão ambígua como algo que precisa ser recuperado. O runtime preserva identidade suficiente para perguntar pelo destino da tentativa original em vez de fabricar outra imediatamente.',
            ],
          },
          {
            heading: 'Registrar antes de agir',
            paragraphs: [
              'Recovery só é possível quando o sistema sabe o que estava tentando fazer. Intenção, autorização e identidade de execução precisam sobreviver antes de a fronteira irreversível ser atravessada.',
              'Isso transforma persistência de recurso de auditoria em parte da semântica de execução. Um journal não é apenas um registro para consultar depois; é o que permite ao runtime distinguir continuar a mesma ação de iniciar uma ação nova.',
            ],
          },
          {
            heading: 'Recovery não é retry',
            paragraphs: [
              'Retry pede ao mundo que execute uma operação novamente. Recovery pergunta ao mundo o que aconteceu com uma operação que talvez já tenha ocorrido. São solicitações causais diferentes mesmo quando, para o usuário, ambas começam com o mesmo spinner.',
              'Em sistemas agênticos essa diferença fica cada vez mais importante. Quanto mais autonomamente um software consegue agir, mais cuidadosamente ele precisa saber quando outra tentativa é continuação, quando é duplicação e quando apenas nova evidência pode decidir.',
            ],
          },
        ],
      },
    },
  },
];
