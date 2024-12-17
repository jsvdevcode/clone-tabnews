import { join } from "node:path";
import migrationRunner from "node-pg-migrate";
import database from "infra/database";

export default async function migrations(request, response) {
  if (["GET", "POST"].includes(request.method) === false) {
    return response.status(405).end();
  }

  const dbClient = await database.getNewClient();
  const migrationRunnerConfig = {
    dbClient,
    dir: join("infra", "migrations"),
    migrationsTable: "pgmigrations",
    direction: "up",
    dryRun: true,
  };

  if (request.method === "GET") {
    const pendingMigrations = await migrationRunner(migrationRunnerConfig);
    dbClient.end();

    return response.status(200).json(pendingMigrations);
  }

  const migratedMigrations = await migrationRunner({
    ...migrationRunnerConfig,
    dryRun: false,
  });

  dbClient.end();

  if (migratedMigrations.length > 0) {
    return response.status(201).json(migratedMigrations);
  }
  return response.status(200).json(migratedMigrations);
}
