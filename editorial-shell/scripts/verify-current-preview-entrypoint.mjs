/* global console */
import { createCurrentCommissionedRuntime } from '../runtime/current-commissioned-runtime.mjs';

const runtime = await createCurrentCommissionedRuntime();
try {
  const address = await runtime.listen(0, '0.0.0.0');
  if (!address || typeof address === 'string') throw new Error('current-preview-entrypoint-address');
  const origin = `http://127.0.0.1:${address.port}`;

  const canonical = await fetch(`${origin}/en`, { redirect: 'manual' });
  if (canonical.status !== 200) throw new Error(`current-preview-canonical:${canonical.status}`);
  if (canonical.headers.get('x-commissioned-runtime') !== 'R2-A1.3') throw new Error('current-preview-runtime-header');
  if (canonical.headers.get('x-publication-digest') !== 'sha256_f72c807283aa0f2da0a20b3ecaf1ec5f99227fedac47aa9fb988f5c924997d32') {
    throw new Error('current-preview-publication-digest');
  }

  const unknown = await fetch(`${origin}/__current_preview_unknown__`, { redirect: 'manual' });
  if (unknown.status !== 404) throw new Error(`current-preview-404:${unknown.status}`);

  console.log('R2-A1.3 CURRENT PREVIEW ENTRYPOINT: PASS');
  console.log('bind_address=0.0.0.0');
  console.log('semantic_runtime=R2-A1.3-current-commissioned-runtime');
  console.log('accepted_publication_digest=sha256_f72c807283aa0f2da0a20b3ecaf1ec5f99227fedac47aa9fb988f5c924997d32');
  console.log('distribution_digest=sha256_b7813fa7400b1ad205cd82bf32ecad86d4c9790d7d03630033dcc68c6d8dc308');
  console.log('production_mutation=0');
} finally {
  await runtime.close();
}
