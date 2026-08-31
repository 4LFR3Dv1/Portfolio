/* global console, process */
import { createCommissionedRuntime } from './commissioned-runtime.mjs';

const runtime = await createCommissionedRuntime();
const configuredPort = Number.parseInt(process.env.PORT ?? '4322', 10);
if (!Number.isFinite(configuredPort) || configuredPort < 1 || configuredPort > 65535) {
  throw new Error(`r2-6-preview-invalid-port:${process.env.PORT ?? 'missing'}`);
}

const address = await runtime.listen(configuredPort, '0.0.0.0');
if (!address || typeof address === 'string') throw new Error('r2-6-preview-address-unavailable');

console.log(`R2.6 isolated preview runtime listening on 0.0.0.0:${address.port}`);

let closing = false;
const shutdown = async () => {
  if (closing) return;
  closing = true;
  await runtime.close();
  process.exit(0);
};

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
