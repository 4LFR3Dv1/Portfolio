import type { Language } from '../context/language-context';

export type EditorialThreadId =
  | 'agents-interfaces'
  | 'software-production'
  | 'networks'
  | 'state-time';

export type EditorialLocalized = Record<Language, string>;

export interface EditorialThread {
  id: EditorialThreadId;
  title: EditorialLocalized;
  description: EditorialLocalized;
}

const local = (en: string, pt: string): EditorialLocalized => ({ en, pt });

export const editorialThreads: EditorialThread[] = [
  {
    id: 'agents-interfaces',
    title: local('Agents and interfaces', 'Agentes e interfaces'),
    description: local(
      'How software participates in interfaces originally designed around a person standing outside the system.',
      'Como software participa de interfaces originalmente desenhadas em torno de uma pessoa do lado de fora do sistema.',
    ),
  },
  {
    id: 'software-production',
    title: local('Software production', 'Produção de software'),
    description: local(
      'What changes in software work when implementation becomes cheap and deciding, bounding and accepting work become the scarce parts.',
      'O que muda no trabalho de software quando implementar fica barato e decidir, delimitar e aceitar trabalho passam a ser as partes escassas.',
    ),
  },
  {
    id: 'networks',
    title: local('Networks', 'Redes'),
    description: local(
      'Where a network exists when the observer moves between application, operating system, controller, protocol and physical medium.',
      'Onde uma rede existe quando o observador muda entre aplicação, sistema operacional, controlador, protocolo e meio físico.',
    ),
  },
  {
    id: 'state-time',
    title: local('State and time', 'Estado e tempo'),
    description: local(
      'What systems can know about change, memory and continuity when only the present state physically exists.',
      'O que sistemas podem saber sobre mudança, memória e continuidade quando apenas o estado presente existe fisicamente.',
    ),
  },
];

export function getEditorialThread(id: EditorialThreadId): EditorialThread {
  const thread = editorialThreads.find((candidate) => candidate.id === id);
  if (!thread) throw new Error(`Unknown editorial thread: ${id}`);
  return thread;
}
