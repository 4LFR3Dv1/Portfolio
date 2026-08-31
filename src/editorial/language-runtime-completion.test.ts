import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  materializeRegistryRecords,
  type RecordRegistryManifest,
} from './record-registry';
import {
  reconstructLanguageRuntime,
  type LanguageRuntimeManifest,
} from './language-runtime';

interface LanguageRuntimeCompletion {
  schemaVersion: 'editorial-language-runtime-completion/v0';
  status: 'frozen';
  normative: true;
  contractId: 'PORTFOLIO-R1.4-2026-08-30';
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
  effectiveLanguageRuntime: {
    bornSystemRecords: 28;
    canonicalEnRealizations: 28;
    explicitPtBrTranslations: 5;
    languageBindings: 33;
    routedLanguagePairsResolved: 10;
    translationInferenceAllowed: false;
    implicitFallbackAllowed: false;
    staleRealizationInheritanceAllowed: false;
    languageImpliesDisclosure: false;
    languageImpliesPublicProjection: false;
    documentRenderingEnacted: false;
    frameworkCutoverEnacted: false;
    publicUiChanged: false;
    runtimeSemanticsChanged: false;
  };
  acceptance: {
    r1_3Complete: true;
    r1_4Complete: true;
    languageRuntimeReconstructs: true;
    exactRevisionBindingRequired: true;
    routeDoesNotImplyRealization: true;
    missingTranslationPreserved: true;
    staleRealizationInheritanceForbidden: true;
    implicitFallbackForbidden: true;
    currentPublicProjectionCount: 0;
    nextRequiredCut: 'R1.5 — Editorial Document Runtime';
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

const manifestText = readRepoFile('docs/editorial/language-runtime.v0.json');
const manifest = JSON.parse(manifestText) as LanguageRuntimeManifest;
const completion = JSON.parse(
  readRepoFile('docs/editorial/R1.4-completion.v0.json'),
) as LanguageRuntimeCompletion;
const registryManifest = JSON.parse(
  readRepoFile('docs/editorial/record-registry.v0.json'),
) as RecordRegistryManifest;
const records = materializeRegistryRecords(registryManifest);
const runtime = reconstructLanguageRuntime(manifest, records);
const r1Readme = readRepoFile('docs/editorial/R1-README.md');
const r14Doc = readRepoFile('docs/editorial/R1.4-language-runtime.md');

describe('R1.4 terminal completion seal', () => {
  it('binds the exact language-runtime manifest to its successful materialization witness', () => {
    expect(completion.schemaVersion).toBe('editorial-language-runtime-completion/v0');
    expect(completion.status).toBe('frozen');
    expect(completion.normative).toBe(true);
    expect(completion.materialization).toEqual({
      commit: '445cb152b20772c0029c3bdbd2867e443ea2707d',
      verify: {
        workflow: 'Verify',
        runId: 33344300340,
        conclusion: 'success',
      },
      manifestPath: 'docs/editorial/language-runtime.v0.json',
      manifestBlobSha: 'bce4ad6a9a4015c52894ffce02597f5cc20618b2',
    });
    expect(gitBlobSha(manifestText)).toBe(completion.materialization.manifestBlobSha);
  });

  it('closes R1.4 only with an exact, fail-closed language runtime', () => {
    expect(runtime.state).toBe('ready');
    expect(runtime.errors).toEqual([]);
    expect(completion.effectiveLanguageRuntime).toEqual({
      bornSystemRecords: 28,
      canonicalEnRealizations: 28,
      explicitPtBrTranslations: 5,
      languageBindings: 33,
      routedLanguagePairsResolved: 10,
      translationInferenceAllowed: false,
      implicitFallbackAllowed: false,
      staleRealizationInheritanceAllowed: false,
      languageImpliesDisclosure: false,
      languageImpliesPublicProjection: false,
      documentRenderingEnacted: false,
      frameworkCutoverEnacted: false,
      publicUiChanged: false,
      runtimeSemanticsChanged: false,
    });
  });

  it('preserves the R1.4 terminal boundary after later R1 cuts advance', () => {
    expect(completion.acceptance).toEqual({
      r1_3Complete: true,
      r1_4Complete: true,
      languageRuntimeReconstructs: true,
      exactRevisionBindingRequired: true,
      routeDoesNotImplyRealization: true,
      missingTranslationPreserved: true,
      staleRealizationInheritanceForbidden: true,
      implicitFallbackForbidden: true,
      currentPublicProjectionCount: 0,
      nextRequiredCut: 'R1.5 — Editorial Document Runtime',
    });
    expect(r1Readme).toContain('| R1.4 | Language Runtime | **COMPLETE** |');
    expect(r1Readme).toContain('R1_4_COMPLETE=true');
    expect(r14Doc).toContain('Status: **COMPLETE / CI WITNESSED**');
    expect(r14Doc).toContain('Verify run 33344300340');
    expect(r14Doc).toContain('R1_4_COMPLETE                                true');
  });
});
