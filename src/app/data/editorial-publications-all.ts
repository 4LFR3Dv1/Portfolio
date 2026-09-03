import {
  publications as cohort001Publications,
  type EditorialPublication,
  type PublicationKind,
} from './editorial-publications';
import { cohort002Publications } from './editorial-publications-cohort-002';
import { cohort003Publications } from './editorial-publications-cohort-003';

export const publications: EditorialPublication[] = [
  ...cohort001Publications,
  ...cohort002Publications,
  ...cohort003Publications,
];

export const featuredPublications = publications.filter((publication) => publication.featured);

export type { EditorialPublication, PublicationKind };
