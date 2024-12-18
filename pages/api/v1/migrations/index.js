import { join } from "node:path";
import migrationRunner from "node-pg-migrate";
import database from "infra/database";

export default async function migrations(request, response) {
  if (["GET", "POST"].includes(request.method) === false) {
    return response
      .status(405)
      .json({ error: `Method ${request.method} not allowed` });
  }

  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const migrationRunnerConfig = {
      dbClient,
      dir: join("infra", "migrations"),
      migrationsTable: "pgmigrations",
      direction: "up",
      dryRun: true,
    };

    if (request.method === "GET") {
      const pendingMigrations = await migrationRunner(migrationRunnerConfig);
      return response.status(200).json(pendingMigrations);
    }

    const migratedMigrations = await migrationRunner({
      ...migrationRunnerConfig,
      dryRun: false,
    });

    const statusCode = migratedMigrations.length > 0 ? 201 : 200;
    return response.status(statusCode).json(migratedMigrations);
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    dbClient.end();
  }
}
