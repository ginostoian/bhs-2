// Download a server-rendered PDF (see libs/pdf) without leaving the page.
// Pass `body` to POST JSON (e.g. an unsaved quote) instead of a plain GET.
export const downloadPdf = async (url, fallbackFilename, body) => {
  const response = await fetch(
    url,
    body
      ? {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      : undefined,
  );
  if (!response.ok) {
    throw new Error(`PDF request failed (${response.status})`);
  }

  const disposition = response.headers.get("Content-Disposition") || "";
  const match = disposition.match(/filename="([^"]+)"/);
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = match?.[1] || fallbackFilename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
};
