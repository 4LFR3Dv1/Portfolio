import type { APIRoute } from 'astro';
import { distributionArtifactResponse } from '../../lib/artifact-response';

export const prerender = true;

export const GET: APIRoute = () => distributionArtifactResponse('/pt-br/rss.xml');
