import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

interface RuntimeBoundaryCompletion {
  schemaVersion: 'editorial-runtime-boundary-completion/v0';
  status: 'frozen';
  normative: true;
  contractId: 'PORTFOLIO-R1.0-2026-08-30';
  materialization: {
    commit: string;
    verify: {
      workflow: 'Verify';
      runId: number;
      conclusion: 'success';
    };
    manifestPath: string;
    manifestBlobSha: string;
  };
  effectiveRuntimeBoundary: {
    publicationShell: 'astro-static';
    interactiveLayer: 'react-islands';
    semanticAuthority: 'editorial-registry';
    outputMode: 'static';
    canonicalReadingRequiresServer: false;
    requestTimeGitHubAuthority: false;
    clientSemanticAuthority: false;
    recordBirthCount: 0;
    frameworkCutoverEnacted: false;
    publicUiChanged: false;
    runtimeSemanticsChanged: false;
  };
  acceptance: {
    r1_0Complete: true;
    r1ProgramInProgress: true;
    r0EffectiveComplete: true;
    r1PreComplete: true;
    runtimeBoundaryFrozen: true;
    recordBirthCount: 0;
    nextRequiredCut: 'R1.1 — Record Registry';
  };
}

function readRepoFile(path: string): string {
  return readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
}

function gitBlobSha(content: string): string {
  const bytes = Buffer.from(content, 'utf8');
  return createHash('sha1')
    .update(`blob ${bytes.length}\0`)
    .update(bytes)
    .digest('hex');
}

const completion = JSON.parse(
  readRepoFile('docs/editorial/R1.0-completion.v0.json'),
) as RuntimeBoundaryCompletion;

const manifest = readRepoFile('docs/editorial/editorial-runtime-boundary.v0.json');
const r1Readme = readRepoFile('docs/editorial/R1-README.md');
const r10Doc = readRepoFile('docs/editorial/R1.0-editorial-runtime-boundary.md');

describe('R1.0 terminal completion seal', () => {
  it('seals the exact materialized runtime-boundary manifest witnessed by CI', () => {
    expect(completion.schemaVersion).toBe('editorial-runtime-boundary-completion/v0');
    expect(completion.status).toBe('frozen');
    expect(completion.normative).toBe(true);
    expect(completion.contractId).toBe('PORTFOLIO-R1.0-2026-08-30');
    expect(completion.materialization.commit).toBe('04995cc7c053cc07c56a5de458dd2e80c46248b5');
    expect(completion.materialization.verify).toEqual({
      workflow: 'Verify',
      runId: 33339042562,
      conclusion: 'success',
    });
    expect(completion.materialization.manifestPath).toBe(
      'docs/editorial/editorial-runtime-boundary.v0.json',
    );
    expect(gitBlobSha(manifest)).toBe(completion.materialization.manifestBlobSha);
  });

  it('closes R1.0 without Record Birth, cutover, UI or runtime semantic mutation', () => {
    expect(completion.effectiveRuntimeBoundary).toMatchObject({
      publicationShell: 'astro-static',
      interactiveLayer: 'react-islands',
      semanticAuthority: 'editorial-registry',
      outputMode: 'static',
      canonicalReadingRequiresServer: false,
      requestTimeGitHubAuthority: false,
      clientSemanticAuthority: false,
      recordBirthCount: 0,
      frameworkCutoverEnacted: false,
      publicUiChanged: false,
      runtimeSemanticsChanged: false,
    });
  });

  it('keeps R1.0 complete while the shared program advances beyond its next cut', () => {
    expect(completion.acceptance).toMatchObject({
      r1_0Complete: true,
      r1ProgramInProgress: true,
      r0EffectiveComplete: true,
      r1PreComplete: true,
      runtimeBoundaryFrozen: true,
      recordBirthCount: 0,
      nextRequiredCut: 'R1.1 — Record Registry',
    });
    expect(r1Readme).toContain('| R1.0 | Editorial Runtime Boundary | **COMPLETE** |');
    expect(r1Readme).toContain('| R1.1 | Record Registry |');
    expect(r1Readme).toContain('R1_0_COMPLETE=true');
    expect(r10Doc).toContain('Status: **COMPLETE / CI WITNESSED**');
    expect(r10Doc).toContain('Verify` run `33339042562`');
    expect(r10Doc).toContain('R1_0_COMPLETE                                 true');
  });
});
