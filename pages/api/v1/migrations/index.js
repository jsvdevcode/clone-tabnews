import { createRouter } from "next-connect";
import { resolve } from "node:path";
import migrationRunner from "node-pg-migrate";
import database from "infra/database";
import controller from "infra/controller";

const router = createRouter();

router.get(migrationsHandler);
router.post(migrationsHandler);

export default router.handler(controller.errorHandler);

async function migrationsHandler(request, response) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const migrationRunnerConfig = {
      dbClient,
      dir: resolve("infra", "migrations"),
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
  } finally {
    dbClient.end();
  }
}
