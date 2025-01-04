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

describe("POST '/api/v1/migrations'", () => {
  describe("Anonymous user", () => {
    describe("Running pending migrations", () => {
      test("For the first time", async () => {
        const response = await httpPostMigrations();
        expect(response.status).toBe(201);

        const content = await response.json();
        expect(Array.isArray(content)).toBe(true);
        expect(content.length).toBeGreaterThan(0);
      });
      test("For the second time", async () => {
        const response = await httpPostMigrations();
        expect(response.status).toBe(200);

        const content = await response.json();
        expect(Array.isArray(content)).toBe(true);
        expect(content.length).toBe(0);
      });
    });
  });
});
