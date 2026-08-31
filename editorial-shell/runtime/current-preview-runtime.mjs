/* global console, process */
import { createCurrentCommissionedRuntime } from './current-commissioned-runtime.mjs';

const runtime = await createCurrentCommissionedRuntime();
const configuredPort = Number.parseInt(process.env.PORT ?? '4322', 10);
const address = await runtime.listen(Number.isFinite(configuredPort) ? configuredPort : 4322, '0.0.0.0');
if (!address || typeof address === 'string') throw new Error('current-preview-runtime-address-unavailable');
console.log(`R2-A1.3 current isolated preview runtime listening on 0.0.0.0:${address.port}`);

const shutdown = async () => {
  await runtime.close();
  process.exit(0);
};
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
