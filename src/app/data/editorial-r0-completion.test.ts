import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

interface CompletionMarker {
  schemaVersion: 'editorial-r0-completion/v0';
  status: 'frozen';
  normative: true;
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
  acceptance: {
    r0_8Complete: true;
    r0Complete: true;
    legacyCoverageComplete: true;
    semanticLossCount: 0;
    unresolvedMigrationCount: 0;
    runtimeSemanticsChanged: false;
    uiChanged: false;
  };
  next: string;
}

function readRepoFile(path: string): string {
  return readFileSync(new URL(`../../../${path}`, import.meta.url), 'utf8');
}

function gitBlobSha(content: string): string {
  const bytes = Buffer.from(content, 'utf8');
  return createHash('sha1')
    .update(`blob ${bytes.length}\0`)
    .update(bytes)
    .digest('hex');
}

const completion = JSON.parse(
  readRepoFile('docs/editorial/R0.8-completion.v0.json'),
) as CompletionMarker;

const manifest = readRepoFile('docs/editorial/migration-acceptance.v0.json');
const readme = readRepoFile('docs/editorial/R0-README.md');

describe('R0 terminal completion seal', () => {
  it('cryptographically seals the exact R0.8 materialization manifest witnessed by CI', () => {
    expect(completion.schemaVersion).toBe('editorial-r0-completion/v0');
    expect(completion.status).toBe('frozen');
    expect(completion.normative).toBe(true);
    expect(completion.materialization.commit).toBe('460b0b554a14dcf3b14dc54b49c83e416300dfb0');
    expect(completion.materialization.verify).toEqual({
      workflow: 'Verify',
      runId: 33336382754,
      conclusion: 'success',
    });
    expect(completion.materialization.manifestPath).toBe('docs/editorial/migration-acceptance.v0.json');
    expect(gitBlobSha(manifest)).toBe(completion.materialization.manifestBlobSha);
  });

  it('closes R0 only with complete reconciliation and no runtime/UI mutation', () => {
    expect(completion.acceptance.r0_8Complete).toBe(true);
    expect(completion.acceptance.r0Complete).toBe(true);
    expect(completion.acceptance.legacyCoverageComplete).toBe(true);
    expect(completion.acceptance.semanticLossCount).toBe(0);
    expect(completion.acceptance.unresolvedMigrationCount).toBe(0);
    expect(completion.acceptance.runtimeSemanticsChanged).toBe(false);
    expect(completion.acceptance.uiChanged).toBe(false);
  });

  it('advances the constitutional program to R1 Editorial Foundation', () => {
    expect(completion.next).toBe('R1 — Editorial Foundation');
    expect(readme).toContain('| R0.8 | Migration & Acceptance | **COMPLETE** |');
    expect(readme).toContain('R0_COMPLETE=true');
    expect(readme).toContain('R1 — Editorial Foundation');
  });
});
