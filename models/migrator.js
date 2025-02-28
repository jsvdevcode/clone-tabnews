import { resolve } from "node:path";
import migrationRunner from "node-pg-migrate";
import database from "infra/database";

const migrationRunnerConfig = {
  dir: resolve("infra", "migrations"),
  migrationsTable: "pgmigrations",
  direction: "up",
  dryRun: true,
};

async function listPendingMigrations() {
  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const pendingMigrations = await migrationRunner({
      ...migrationRunnerConfig,
      dbClient,
    });

    return pendingMigrations;
  } finally {
    dbClient?.end();
  }
}

async function runPendingMigrations() {
  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const migratedMigrations = await migrationRunner({
      ...migrationRunnerConfig,
      dbClient,
      dryRun: false,
    });

    return migratedMigrations;
  } finally {
    dbClient?.end();
  }
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migrator;
