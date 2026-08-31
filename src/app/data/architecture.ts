import type { Language } from '../context/language-context';

export type ArchitectureViewId = 'systems' | 'settlement' | 'agents' | 'realtime' | 'handoff';
export type ArchitectureStepKind = 'interface' | 'authority' | 'runtime' | 'verification' | 'human';

type Localized<T> = Record<Language, T>;

export interface ArchitectureStep {
  id: string;
  kind: ArchitectureStepKind;
  label: Localized<string>;
  detail: Localized<string>;
}

export interface ArchitectureView {
  id: ArchitectureViewId;
  index: string;
  shortLabel: Localized<string>;
  title: Localized<string>;
  summary: Localized<string>;
  principle: Localized<string>;
  steps: ArchitectureStep[];
  guarantees: Localized<string[]>;
  boundaries: Array<{
    label: Localized<string>;
    detail: Localized<string>;
  }>;
  examples: string[];
}

const localized = <T>(en: T, pt: T): Localized<T> => ({ en, pt });

export const architectureViews: ArchitectureView[] = [
  {
    id: 'systems',
    index: '00',
    shortLabel: localized('From idea to system', 'Da ideia ao sistema'),
    title: localized('What has to happen between an idea and something that actually runs?', 'O que precisa acontecer entre uma ideia e algo que realmente funciona?'),
    summary: localized(
      'Across very different projects, I keep returning to the same sequence: understand the intention, decide what must be true, execute the effect in the right place, and keep enough feedback to recover when reality disagrees with the plan.',
      'Em projetos muito diferentes, eu volto quase sempre à mesma sequência: entender a intenção, decidir o que precisa ser verdade, executar o efeito no lugar certo e manter feedback suficiente para recuperar quando a realidade discorda do plano.',
    ),
    principle: localized(
      'Keep the intention easy to express, and keep the effect easy to explain afterwards.',
      'Deixe a intenção fácil de expressar e o efeito fácil de explicar depois.',
    ),
    steps: [
      { id: 'question', kind: 'interface', label: localized('Question or intention', 'Pergunta ou intenção'), detail: localized('What is the person or system actually trying to make happen?', 'O que a pessoa ou o sistema realmente está tentando fazer acontecer?') },
      { id: 'decision', kind: 'authority', label: localized('Decision', 'Decisão'), detail: localized('Which rules, state and constraints decide whether that action makes sense?', 'Quais regras, estado e restrições decidem se aquela ação faz sentido?') },
      { id: 'execution', kind: 'runtime', label: localized('Execution', 'Execução'), detail: localized('The effect happens in the browser, backend, device, network or external service.', 'O efeito acontece no navegador, backend, dispositivo, rede ou serviço externo.') },
      { id: 'feedback', kind: 'verification', label: localized('Feedback', 'Retorno'), detail: localized('Observe what actually happened instead of assuming the request succeeded.', 'Observe o que realmente aconteceu em vez de assumir que o pedido deu certo.') },
      { id: 'recovery', kind: 'human', label: localized('Recovery or next move', 'Recuperação ou próximo passo'), detail: localized('Continue, retry safely, ask for help or change the plan with context intact.', 'Continuar, tentar de novo com segurança, pedir ajuda ou mudar o plano sem perder o contexto.') },
    ],
    guarantees: localized(
      ['Intent stays visible', 'Decisions have a home', 'Effects can be observed', 'Failure has a next move'],
      ['A intenção continua visível', 'As decisões têm um lugar', 'Os efeitos podem ser observados', 'A falha tem um próximo passo'],
    ),
    boundaries: [
      { label: localized('Expression ↔ decision', 'Expressão ↔ decisão'), detail: localized('The interface can make an action easy without becoming the place that decides whether it is valid.', 'A interface pode facilitar uma ação sem virar o lugar que decide se ela é válida.') },
      { label: localized('Decision ↔ effect', 'Decisão ↔ efeito'), detail: localized('Choosing what should happen and performing it are separate responsibilities.', 'Escolher o que deve acontecer e fazer aquilo acontecer são responsabilidades diferentes.') },
      { label: localized('Effect ↔ reality', 'Efeito ↔ realidade'), detail: localized('A successful call is not always a successful outcome; the system needs a way to observe the difference.', 'Uma chamada bem-sucedida nem sempre é um resultado bem-sucedido; o sistema precisa conseguir observar a diferença.') },
    ],
    examples: ['Genesis', 'Foundry', 'Lisa', 'VIRA', 'XS Wallet'],
  },
  {
    id: 'settlement',
    index: '01',
    shortLabel: localized('Moving value', 'Movendo valor'),
    title: localized('How do you move value without turning one component into the whole system?', 'Como mover valor sem transformar um componente no sistema inteiro?'),
    summary: localized(
      'Financial flows become easier to reason about when the business decision, the transaction preparation, the signature, the network and the final confirmation are allowed to be different things.',
      'Fluxos financeiros ficam mais fáceis de entender quando a decisão de negócio, a preparação da transação, a assinatura, a rede e a confirmação final podem ser coisas diferentes.',
    ),
    principle: localized(
      'Decide the effect first. Only then prepare the exact operation that can produce it.',
      'Decida primeiro o efeito. Só depois prepare a operação exata capaz de produzi-lo.',
    ),
    steps: [
      { id: 'payment-intent', kind: 'interface', label: localized('Payment intent', 'Intenção de pagamento'), detail: localized('Who should receive what, and under which conditions?', 'Quem deve receber o quê e sob quais condições?') },
      { id: 'payment-rules', kind: 'authority', label: localized('Business rules', 'Regras de negócio'), detail: localized('Balance, limits, destination and approval are checked before network execution.', 'Saldo, limites, destino e aprovação são verificados antes da execução na rede.') },
      { id: 'prepare-operation', kind: 'runtime', label: localized('Prepare operation', 'Preparar operação'), detail: localized('Build the transaction or request that represents the approved effect.', 'Construir a transação ou pedido que representa o efeito aprovado.') },
      { id: 'sign-send', kind: 'runtime', label: localized('Sign and send', 'Assinar e enviar'), detail: localized('The smallest component with the required credentials performs the sensitive step.', 'O menor componente com as credenciais necessárias executa a etapa sensível.') },
      { id: 'network-result', kind: 'verification', label: localized('Network result', 'Resultado na rede'), detail: localized('Observe the network or provider to learn what actually settled.', 'Observar a rede ou o provedor para saber o que realmente foi liquidado.') },
      { id: 'payment-recovery', kind: 'human', label: localized('Continue or recover', 'Continuar ou recuperar'), detail: localized('The product can now finish, wait, investigate or recover without guessing.', 'O produto pode então concluir, aguardar, investigar ou recuperar sem adivinhar.') },
    ],
    guarantees: localized(
      ['Business intent stays separate from signing', 'Sensitive credentials stay narrow', 'Network outcome is observed', 'Recovery does not depend on blind retries'],
      ['A intenção de negócio fica separada da assinatura', 'Credenciais sensíveis ficam restritas', 'O resultado da rede é observado', 'Recuperação não depende de retries cegos'],
    ),
    boundaries: [
      { label: localized('Product ↔ transaction', 'Produto ↔ transação'), detail: localized('The product decides the economic intent; network code expresses that intent technically.', 'O produto decide a intenção econômica; o código de rede expressa essa intenção tecnicamente.') },
      { label: localized('Transaction ↔ credentials', 'Transação ↔ credenciais'), detail: localized('Preparing an operation should not automatically grant the ability to sign it.', 'Preparar uma operação não deve automaticamente conceder a capacidade de assiná-la.') },
      { label: localized('Broadcast ↔ settlement', 'Envio ↔ liquidação'), detail: localized('Sending something to a network is not the same as knowing the final state.', 'Enviar algo para uma rede não é o mesmo que saber o estado final.') },
    ],
    examples: ['XS Wallet', 'SNE OS'],
  },
  {
    id: 'agents',
    index: '02',
    shortLabel: localized('Working with agents', 'Trabalhando com agentes'),
    title: localized('What changes when software work can be delegated to AI agents?', 'O que muda quando trabalho de software pode ser delegado a agentes de IA?'),
    summary: localized(
      'The interesting part is not making an agent type faster. It is keeping the question, scope, decisions and review visible while many pieces of work can happen in parallel.',
      'A parte interessante não é fazer um agente digitar mais rápido. É manter a pergunta, o escopo, as decisões e a revisão visíveis enquanto várias partes do trabalho podem acontecer em paralelo.',
    ),
    principle: localized(
      'Delegate execution without delegating the meaning of done.',
      'Delegue a execução sem delegar o significado de concluído.',
    ),
    steps: [
      { id: 'agent-question', kind: 'interface', label: localized('Question', 'Pergunta'), detail: localized('Start from the real problem, not from a prompt-shaped task.', 'Começar pelo problema real, não por uma tarefa moldada como prompt.') },
      { id: 'agent-scope', kind: 'authority', label: localized('Scope the work', 'Delimitar o trabalho'), detail: localized('Define what can change, what must remain true and how completion will be judged.', 'Definir o que pode mudar, o que precisa continuar verdadeiro e como o resultado será julgado.') },
      { id: 'agent-execution', kind: 'runtime', label: localized('Agent works', 'Agente trabalha'), detail: localized('The agent reads, implements, tests and produces a concrete change.', 'O agente lê, implementa, testa e produz uma mudança concreta.') },
      { id: 'agent-review', kind: 'human', label: localized('Review', 'Revisão'), detail: localized('Inspect the result against the problem, not only against whether the code compiles.', 'Inspecionar o resultado contra o problema, não apenas contra o fato de o código compilar.') },
      { id: 'agent-integration', kind: 'verification', label: localized('Integrate and observe', 'Integrar e observar'), detail: localized('Merge, run the system and see whether the change behaves as intended.', 'Integrar, rodar o sistema e observar se a mudança se comporta como esperado.') },
    ],
    guarantees: localized(
      ['The question stays attached to the work', 'Scope is explicit', 'Review remains a separate act', 'The running system is the final judge'],
      ['A pergunta continua ligada ao trabalho', 'O escopo é explícito', 'Revisão continua sendo um ato separado', 'O sistema rodando é o juiz final'],
    ),
    boundaries: [
      { label: localized('Prompt ↔ problem', 'Prompt ↔ problema'), detail: localized('A prompt is an instruction format; the problem is what should survive across tools and agents.', 'Um prompt é um formato de instrução; o problema é o que precisa sobreviver entre ferramentas e agentes.') },
      { label: localized('Production ↔ approval', 'Produção ↔ aprovação'), detail: localized('Generating a change and deciding that it belongs in the system are different actions.', 'Gerar uma mudança e decidir que ela pertence ao sistema são ações diferentes.') },
      { label: localized('Code ↔ outcome', 'Código ↔ resultado'), detail: localized('A green diff is useful, but the product still has to behave correctly in reality.', 'Um diff verde é útil, mas o produto ainda precisa se comportar corretamente na realidade.') },
    ],
    examples: ['Genesis', 'Foundry', 'Lisa'],
  },
  {
    id: 'realtime',
    index: '03',
    shortLabel: localized('Shared live state', 'Estado ao vivo compartilhado'),
    title: localized('How do many people stay inside the same moment?', 'Como várias pessoas permanecem dentro do mesmo momento?'),
    summary: localized(
      'Real-time products feel simple when everyone sees roughly the same thing at roughly the same time. Underneath, that means deciding where time, state and resolution actually live.',
      'Produtos em tempo real parecem simples quando todos veem mais ou menos a mesma coisa no mesmo momento. Por baixo, isso exige decidir onde tempo, estado e resolução realmente vivem.',
    ),
    principle: localized(
      'Let clients feel immediate without asking each client to invent its own truth.',
      'Deixe os clientes parecerem imediatos sem pedir que cada cliente invente sua própria verdade.',
    ),
    steps: [
      { id: 'live-signal', kind: 'runtime', label: localized('Live signal', 'Sinal ao vivo'), detail: localized('A match event, message or external update enters the system.', 'Um evento de partida, mensagem ou atualização externa entra no sistema.') },
      { id: 'shared-state', kind: 'authority', label: localized('Shared state', 'Estado compartilhado'), detail: localized('One place owns the current room, deadline, score or lifecycle.', 'Um lugar controla a sala, prazo, placar ou ciclo de vida atual.') },
      { id: 'client-view', kind: 'interface', label: localized('Client view', 'Visão do cliente'), detail: localized('Each device renders a responsive view derived from that shared state.', 'Cada dispositivo renderiza uma visão responsiva derivada daquele estado compartilhado.') },
      { id: 'resolve-event', kind: 'authority', label: localized('Resolve once', 'Resolver uma vez'), detail: localized('When time or rules decide an outcome, the result is settled in one place.', 'Quando tempo ou regras decidem um resultado, ele é resolvido em um único lugar.') },
      { id: 'reconnect', kind: 'verification', label: localized('Reconnect', 'Reconectar'), detail: localized('A returning client can recover the latest state instead of trusting stale memory.', 'Um cliente que retorna consegue recuperar o estado mais recente em vez de confiar em memória antiga.') },
    ],
    guarantees: localized(
      ['Clients can be fast without owning truth', 'Time has one reference', 'Outcomes resolve once', 'Reconnect restores context'],
      ['Clientes podem ser rápidos sem controlar a verdade', 'O tempo tem uma referência', 'Resultados são resolvidos uma vez', 'Reconexão restaura contexto'],
    ),
    boundaries: [
      { label: localized('Experience ↔ state', 'Experiência ↔ estado'), detail: localized('Animation and optimistic UI can be local; shared game or session state cannot.', 'Animação e UI otimista podem ser locais; estado compartilhado de jogo ou sessão não.') },
      { label: localized('Clock ↔ client', 'Relógio ↔ cliente'), detail: localized('A user device may display time, but it should not decide the shared deadline.', 'O dispositivo do usuário pode exibir tempo, mas não deve decidir o prazo compartilhado.') },
      { label: localized('Reconnect ↔ memory', 'Reconexão ↔ memória'), detail: localized('After a gap, current shared state matters more than what the browser remembers.', 'Depois de uma lacuna, o estado compartilhado atual importa mais do que o navegador lembra.') },
    ],
    examples: ['VIRA'],
  },
  {
    id: 'handoff',
    index: '04',
    shortLabel: localized('Software ↔ human', 'Software ↔ pessoa'),
    title: localized('What should happen when software reaches the edge of what it should do?', 'O que deve acontecer quando o software chega ao limite do que deveria fazer?'),
    summary: localized(
      'Some flows should not end in more automation. A useful system knows when to preserve context, make the current state understandable and hand the situation to a person without making everyone start again.',
      'Alguns fluxos não deveriam terminar em mais automação. Um sistema útil sabe quando preservar contexto, tornar o estado atual compreensível e entregar a situação para uma pessoa sem obrigar todos a começar de novo.',
    ),
    principle: localized(
      'A handoff is part of the product, not an escape hatch from it.',
      'Um handoff faz parte do produto, não é uma rota de fuga dele.',
    ),
    steps: [
      { id: 'conversation', kind: 'interface', label: localized('Conversation or request', 'Conversa ou pedido'), detail: localized('The person explains what they need in the product or assistant.', 'A pessoa explica o que precisa no produto ou na assistente.') },
      { id: 'session', kind: 'authority', label: localized('Keep the session', 'Manter a sessão'), detail: localized('Identity, current step and relevant context stay attached to the interaction.', 'Identidade, etapa atual e contexto relevante continuam ligados à interação.') },
      { id: 'bounded-action', kind: 'runtime', label: localized('Do what software can do', 'Fazer o que o software pode fazer'), detail: localized('Automate the parts that are clear, repeatable and safe to perform.', 'Automatizar as partes claras, repetíveis e seguras de executar.') },
      { id: 'handoff-decision', kind: 'verification', label: localized('Recognize the edge', 'Reconhecer o limite'), detail: localized('Ambiguity, policy or a failed step can make human help the correct next move.', 'Ambiguidade, política ou uma etapa que falhou podem tornar ajuda humana o próximo passo correto.') },
      { id: 'human-continue', kind: 'human', label: localized('Human continues', 'Pessoa continua'), detail: localized('The operator receives enough context to continue instead of reconstructing the story from scratch.', 'O operador recebe contexto suficiente para continuar em vez de reconstruir toda a história do zero.') },
    ],
    guarantees: localized(
      ['Context survives the handoff', 'Automation has a visible edge', 'The person can understand the current state', 'The flow can continue after intervention'],
      ['O contexto sobrevive ao handoff', 'A automação tem um limite visível', 'A pessoa consegue entender o estado atual', 'O fluxo pode continuar depois da intervenção'],
    ),
    boundaries: [
      { label: localized('Conversation ↔ action', 'Conversa ↔ ação'), detail: localized('Understanding a request and being allowed to execute it are separate concerns.', 'Entender um pedido e ter permissão para executá-lo são preocupações diferentes.') },
      { label: localized('Automation ↔ judgment', 'Automação ↔ julgamento'), detail: localized('Some decisions become better, not worse, when a person takes over.', 'Algumas decisões ficam melhores, não piores, quando uma pessoa assume.') },
      { label: localized('Handoff ↔ restart', 'Handoff ↔ reinício'), detail: localized('Escalation should carry context forward instead of discarding the previous interaction.', 'Escalonamento deve carregar contexto adiante em vez de descartar a interação anterior.') },
    ],
    examples: ['Lisa', 'Transactional Support Bot'],
  },
];

export function getArchitectureView(value: string | null | undefined): ArchitectureView {
  return architectureViews.find((view) => view.id === value) ?? architectureViews[0];
}
