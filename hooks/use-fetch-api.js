import useSWR from "swr";

async function fetchAPI(url) {
  const response = await fetch(url);
  const content = await response.json();
  return content;
}

export function useFetchAPI(key, options) {
  const { isLoading, data } = useSWR(key, fetchAPI, options);

  return {
    isLoading,
    data,
  };
}
