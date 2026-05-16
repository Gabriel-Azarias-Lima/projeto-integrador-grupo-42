const { PrismaClient } = require('@prisma/client');

/**
 * Supabase Transaction Pooler (porta 6543) não suporta o pool grande do Prisma por padrão.
 * Ajusta query string: pgbouncer=true, connection_limit baixo e timeouts maiores.
 * @see https://www.prisma.io/docs/orm/overview/databases/supabase
 */
function resolveDatabaseUrl() {
  const raw = process.env.DATABASE_URL;
  if (!raw || typeof raw !== 'string') return raw;

  try {
    const url = new URL(raw);
    const host = url.hostname;
    const port = url.port || '5432';
    const isSupabaseTransactionPool =
      host.endsWith('pooler.supabase.com') && port === '6543';

    if (!isSupabaseTransactionPool) return raw;

    if (!url.searchParams.has('pgbouncer')) url.searchParams.set('pgbouncer', 'true');
    url.searchParams.set('connection_limit', '1');
    if (!url.searchParams.has('pool_timeout')) url.searchParams.set('pool_timeout', '30');
    if (!url.searchParams.has('connect_timeout')) url.searchParams.set('connect_timeout', '25');

    return url.toString();
  } catch {
    return raw;
  }
}

const databaseUrl = resolveDatabaseUrl();

const prisma = new PrismaClient({
  datasources: { db: { url: databaseUrl } },
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

module.exports = prisma;
