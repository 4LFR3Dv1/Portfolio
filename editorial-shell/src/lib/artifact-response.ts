import { publicationState } from './publication-state';

export function distributionArtifactResponse(path: string): Response {
  const artifact = publicationState.emission.artifacts.find((entry) => entry.path === path);
  if (!artifact) throw new Error(`editorial-shell-distribution-artifact-missing:${path}`);
  return new Response(artifact.body, {
    status: 200,
    headers: {
      'Content-Type': artifact.contentType,
      'X-Content-Digest': artifact.digest,
    },
  });
}
