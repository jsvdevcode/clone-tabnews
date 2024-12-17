import database from "infra/database";

function httpPostMigrations() {
  return fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
}

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

beforeAll(cleanDatabase);

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
