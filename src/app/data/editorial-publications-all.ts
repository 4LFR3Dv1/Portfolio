import {
  publications as cohort001Publications,
  type EditorialPublication,
  type PublicationKind,
} from './editorial-publications';
import { cohort002Publications } from './editorial-publications-cohort-002';

export const publications: EditorialPublication[] = [
  ...cohort001Publications,
  ...cohort002Publications,
];

export const featuredPublications = publications.filter((publication) => publication.featured);

export type { EditorialPublication, PublicationKind };
