import { useFetchAPI } from "hooks/use-fetch-api";

export default function StatusPage() {
  const { isLoading, data } = useFetchAPI("/api/v1/status", {
    refreshInterval: 10000,
  });

  let content = "carregando...";

  if (!isLoading && data) {
    content = (
      <>
        <UpdatedAt data={data.updated_at} />
        <Database data={data.dependencies.database} />
      </>
    );
  }

  return (
    <>
      <h1>Status</h1>
      {content}
    </>
  );
}

function UpdatedAt({ data }) {
  return (
    <div>
      <strong>Última atualização:</strong>{" "}
      <span>{new Date(data).toLocaleString("pt-BR")}</span>
    </div>
  );
}

function Database({ data }) {
  return (
    <>
      <div>
        <h3>Database</h3>
      </div>
      <div>
        <strong>Versão:</strong> <span>{data.version}</span>
      </div>
      <div>
        <strong>Máximo de conexões:</strong> <span>{data.max_connections}</span>
      </div>
      <div>
        <strong>Conexões abertas:</strong>{" "}
        <span>{data.opened_connections}</span>
      </div>
    </>
  );
}
