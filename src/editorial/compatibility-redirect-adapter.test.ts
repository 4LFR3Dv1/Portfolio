import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import adapterManifestJson from '../../docs/editorial/compatibility-redirect-adapter.v0.json';
import {
  buildCompatibilityHandshakeLocation,
  negotiateLegacyClientLanguage,
  reconstructCompatibilityRedirectAdapter,
  redirectDecisionToResponse,
  resolveCompatibilityRedirectRequest,
  type CompatibilityRedirectAdapterManifest,
} from './compatibility-redirect-adapter';
import { materializeAcceptedRendererInput } from './renderer-input';

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8')) as T;
}

const input = materializeAcceptedRendererInput();
const manifest = adapterManifestJson as CompatibilityRedirectAdapterManifest;
const distributed = new Set(input.pages.map((page) => page.canonicalPath));
const runtime = reconstructCompatibilityRedirectAdapter(manifest, input.shellPlan, distributed);
if (runtime.state !== 'ready' || !runtime.adapter) throw new Error(`redirect-adapter-test-setup:${runtime.errors.join(',')}`);
const adapter = runtime.adapter;

describe('R2.4 compatibility redirect adapter', () => {
  it('materializes exactly the four admitted redirect routes and eight distributed targets', () => {
    expect(adapter.entries).toHaveLength(4);
    expect(adapter.entries.map((entry) => entry.legacyPath).sort()).toEqual([
      '/',
      '/work/sne-os',
      '/work/vira',
      '/work/xs-wallet',
    ]);
    const targets = adapter.entries.flatMap((entry) => Object.values(entry.successors));
    expect(targets).toHaveLength(8);
    expect(new Set(targets).size).toBe(8);
    for (const target of targets) expect(distributed.has(target)).toBe(true);
  });

  it('preserves portfolio-language as the only client negotiation authority', () => {
    expect(adapter.language.storageKey).toBe('portfolio-language');
    expect(adapter.language.acceptedStoredValues).toEqual(['en', 'pt']);
    expect(adapter.language.defaultWhenMissing).toBe('en');
    expect(adapter.language.acceptLanguageInferenceAllowed).toBe(false);
    expect(adapter.language.navigatorLanguageInferenceAllowed).toBe(false);
    expect(negotiateLegacyClientLanguage('pt')).toBe('pt');
    expect(negotiateLegacyClientLanguage('en')).toBe('en');
    expect(negotiateLegacyClientLanguage(null)).toBe('en');
    expect(negotiateLegacyClientLanguage('unexpected')).toBe('en');
  });

  it('builds the two-stage handshake instead of pretending the HTTP server can read localStorage', () => {
    expect(manifest.negotiation.serverCanReadLocalStorage).toBe(false);
    expect(manifest.negotiation.clientHandshakeRequired).toBe(true);
    expect(buildCompatibilityHandshakeLocation(adapter, '/work/vira', 'pt')).toBe(
      '/_compat/redirect?from=%2Fwork%2Fvira&lang=pt',
    );
    expect(buildCompatibilityHandshakeLocation(adapter, '/work/vira', null)).toBe(
      '/_compat/redirect?from=%2Fwork%2Fvira&lang=en',
    );
  });

  it('returns exact 302 responses for explicit EN and PT legacy language hints', () => {
    const en = resolveCompatibilityRedirectRequest(adapter, '/work/vira', 'en', distributed);
    const pt = resolveCompatibilityRedirectRequest(adapter, '/work/vira', 'pt', distributed);
    expect(en).toEqual({
      state: 'redirect',
      legacyPath: '/work/vira',
      language: 'en',
      location: '/en/systems/vira',
      status: 302,
    });
    expect(pt).toEqual({
      state: 'redirect',
      legacyPath: '/work/vira',
      language: 'pt-BR',
      location: '/pt-br/systems/vira',
      status: 302,
    });

    const response = redirectDecisionToResponse(adapter, pt);
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toBe('/pt-br/systems/vira');
    expect(response.headers.get('cache-control')).toBe('no-store');
  });

  it('requires an explicit client-provided language hint and never infers one server-side', () => {
    expect(resolveCompatibilityRedirectRequest(adapter, '/work/vira', null, distributed)).toEqual({
      state: 'invalid-request',
      legacyPath: '/work/vira',
      reason: 'explicit-language-required',
      status: 400,
    });
    expect(resolveCompatibilityRedirectRequest(adapter, '/work/vira', 'pt-BR', distributed)).toEqual({
      state: 'invalid-request',
      legacyPath: '/work/vira',
      reason: 'invalid-language',
      status: 400,
    });
  });

  it('fails closed with 503 when an admitted successor is no longer distributed', () => {
    const withoutPtVira = new Set(distributed);
    withoutPtVira.delete('/pt-br/systems/vira');
    expect(resolveCompatibilityRedirectRequest(adapter, '/work/vira', 'pt', withoutPtVira)).toEqual({
      state: 'blocked',
      legacyPath: '/work/vira',
      language: 'pt-BR',
      targetPath: '/pt-br/systems/vira',
      reason: 'successor-not-distributed',
      status: 503,
    });
  });

  it('does not absorb preserved legacy routes or unknown paths', () => {
    expect(resolveCompatibilityRedirectRequest(adapter, '/work/agentic-systems', 'en', distributed)).toEqual({
      state: 'unresolved',
      legacyPath: '/work/agentic-systems',
      status: 404,
    });
    expect(resolveCompatibilityRedirectRequest(adapter, '/unknown', 'en', distributed)).toEqual({
      state: 'unresolved',
      legacyPath: '/unknown',
      status: 404,
    });
  });

  it('keeps production deployment untouched while materializing the adapter', () => {
    const packageJson = readJson<{ scripts: Record<string, string> }>('package.json');
    const vercel = readJson<{ rewrites: Array<{ source: string; destination: string }> }>('docs/editorial/historical-production-vercel.v0.json');
    expect(packageJson.scripts.build).toBe('vite build');
    expect(vercel.rewrites).toEqual([{ source: '/((?!.*\\.).*)', destination: '/index.html' }]);
    expect(manifest.currentState.productionAdapterActivated).toBe(false);
    expect(manifest.currentState.vercelConfigurationChanged).toBe(false);
    expect(manifest.currentState.deployedRuntimeChanged).toBe(false);
  });
});
