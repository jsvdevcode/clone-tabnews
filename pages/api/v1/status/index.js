import database from "infra/database.js";

export default async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const resultQueryServerVersion = await database.query("SHOW server_version;");
  const serverVersion = resultQueryServerVersion.rows[0].server_version;

  const resultQueryMaxConnections = await database.query(
    "SHOW max_connections;",
  );
  const maxConnections = parseInt(
    resultQueryMaxConnections.rows[0].max_connections,
  );

  const databaseName = process.env.POSTGRES_DB;
  const resultQueryOpenedConnections = await database.query({
    text: "SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const openedConnections = resultQueryOpenedConnections.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: serverVersion,
        max_connections: maxConnections,
        opened_connections: openedConnections,
      },
    },
  });
}
