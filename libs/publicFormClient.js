// First-party form admission. Keep one token for an uncertain network retry;
// clear it after a definitive response. No external scripts or services.
const attempts = new Map();
let issuanceQueue = Promise.resolve();
export async function getFormToken(purpose) {
  // Serialize initial issuance so two forms cannot race to set different cookies.
  const work = issuanceQueue
    .catch(() => {})
    .then(async () => {
      const response = await fetch("/api/form-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purpose }),
        credentials: "same-origin",
        cache: "no-store",
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Please reload the form and try again.");
      return data.token;
    });
  issuanceQueue = work;
  return work;
}
export async function publicFormFetch(url, options) {
  const purpose = url.replace(/^\/api\//, "");
  const key = `${purpose}:${options.body}`;
  let token = attempts.get(key);
  if (!token) {
    token = await getFormToken(purpose);
    if (attempts.size > 20) attempts.delete(attempts.keys().next().value);
    attempts.set(key, token);
  }
  const response = await fetch(url, {
    ...options,
    credentials: "same-origin",
    headers: { ...options.headers, "x-form-token": token },
  });
  if (response.ok || (response.status < 500 && response.status !== 409))
    attempts.delete(key);
  if (response.status === 403 || response.status === 409) {
    const result = await response
      .clone()
      .json()
      .catch(() => ({}));
    if (result.code === "FORM_TOKEN") attempts.delete(key);
  }
  return response;
}
