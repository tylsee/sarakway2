const API = "/api";

export async function apiFetch(
  endpoint,
  options = {}
) {

  const token =
    localStorage.getItem(
      "accessToken"
    );

  return fetch(
    `${API}${endpoint}`,
    {
      ...options,

      headers: {
        "Content-Type":
          "application/json",

        Authorization:
          `Bearer ${token}`,

        ...options.headers,
      },
    }
  );
}
