import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  reconstructRecordRegistry,
  type RecordRegistryManifest,
} from './record-registry';

interface RecordRegistryCompletion {
  schemaVersion: 'editorial-record-registry-completion/v0';
  status: 'frozen';
  normative: true;
  contractId: 'PORTFOLIO-R1.1-2026-08-30';
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
  effectiveRegistry: {
    systemBirthCount: 28;
    frontierSystemBirthCount: 15;
    historicalSystemBirthCount: 13;
    otherRecordBirthCount: 0;
    preservedR0_8SystemReservations: 5;
    retiredPreBirthIdentityCount: 1;
    heldReservationCount: 8;
    repositoryIdentityInference: false;
    birthImpliesPublication: false;
    frameworkCutoverEnacted: false;
    publicUiChanged: false;
    runtimeSemanticsChanged: false;
  };
  acceptance: {
    r1_0Complete: true;
    r1_1Complete: true;
    recordRegistryReconstructs: true;
    systemSubjectCoverage: 28;
    invalidBirthCount: 0;
    duplicateRecordIdCount: 0;
    retiredAgenticIdReused: false;
    nextRequiredCut: 'R1.2 — Projection Engine';
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
  readRepoFile('docs/editorial/R1.1-completion.v0.json'),
) as RecordRegistryCompletion;
const manifestText = readRepoFile('docs/editorial/record-registry.v0.json');
const manifest = JSON.parse(manifestText) as RecordRegistryManifest;
const r1Readme = readRepoFile('docs/editorial/R1-README.md');
const r11Doc = readRepoFile('docs/editorial/R1.1-record-registry.md');

describe('R1.1 terminal completion seal', () => {
  it('seals the exact Record Registry manifest witnessed by materialization CI', () => {
    expect(completion.schemaVersion).toBe('editorial-record-registry-completion/v0');
    expect(completion.status).toBe('frozen');
    expect(completion.normative).toBe(true);
    expect(completion.contractId).toBe('PORTFOLIO-R1.1-2026-08-30');
    expect(completion.materialization.commit).toBe('305f9832922353aa842d82836ccacda4bd59f13b');
    expect(completion.materialization.verify).toEqual({
      workflow: 'Verify',
      runId: 33340127024,
      conclusion: 'success',
    });
    expect(completion.materialization.manifestPath).toBe('docs/editorial/record-registry.v0.json');
    expect(gitBlobSha(manifestText)).toBe(completion.materialization.manifestBlobSha);
  });

  it('closes R1.1 only if all 28 System Births reconstruct fail-closed', () => {
    const registry = reconstructRecordRegistry(manifest);
    expect(registry.errors).toEqual([]);
    expect(registry.records.size).toBe(28);
    expect([...registry.records.values()].every((record) => record.state === 'ready')).toBe(true);
    expect(completion.effectiveRegistry).toMatchObject({
      systemBirthCount: 28,
      frontierSystemBirthCount: 15,
      historicalSystemBirthCount: 13,
      otherRecordBirthCount: 0,
      preservedR0_8SystemReservations: 5,
      retiredPreBirthIdentityCount: 1,
      heldReservationCount: 8,
      repositoryIdentityInference: false,
      birthImpliesPublication: false,
      frameworkCutoverEnacted: false,
      publicUiChanged: false,
      runtimeSemanticsChanged: false,
    });
  });

  it('advances the shared program to Projection Engine without mutating the materialized manifest', () => {
    expect(manifest.acceptance.r1_1Complete).toBe(false);
    expect(completion.acceptance).toMatchObject({
      r1_0Complete: true,
      r1_1Complete: true,
      recordRegistryReconstructs: true,
      systemSubjectCoverage: 28,
      invalidBirthCount: 0,
      duplicateRecordIdCount: 0,
      retiredAgenticIdReused: false,
      nextRequiredCut: 'R1.2 — Projection Engine',
    });
    expect(r1Readme).toContain('| R1.1 | Record Registry | **COMPLETE** |');
    expect(r1Readme).toContain('| R1.2 | Projection Engine | **NEXT** |');
    expect(r1Readme).toContain('R1_1_COMPLETE=true');
    expect(r11Doc).toContain('Status: **COMPLETE / CI WITNESSED**');
    expect(r11Doc).toContain('R1_1_COMPLETE                                 true');
  });
});
