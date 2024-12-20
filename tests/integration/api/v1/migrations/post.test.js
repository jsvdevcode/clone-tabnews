import database from "infra/database";
import orchestrator from "tests/orchestrator";

function httpPostMigrations() {
  return fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
}

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await database.query("drop schema public cascade; create schema public;");
});

test("POST to /api/v1/migrations should return 200", async () => {
  let response = await httpPostMigrations();
  expect(response.status).toBe(201);

  let content = await response.json();
  expect(Array.isArray(content)).toBe(true);
  expect(content.length).toBeGreaterThan(0);

  response = await httpPostMigrations();
  expect(response.status).toBe(200);

  content = await response.json();
  expect(Array.isArray(content)).toBe(true);
  expect(content.length).toBe(0);
});
