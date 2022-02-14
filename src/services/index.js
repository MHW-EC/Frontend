
const url = process.env.URL || "https://ccgcmb0zka.execute-api.sa-east-1.amazonaws.com/prod/read"

export async function getData(params) {
  const {
    resourceName,
    query
  } = params;
  if(!resourceName || !query) throw new Error("EMPTY PARAMS NOT ALLOWED")

  const payload = {
    resourceName,
    query
  }
  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  } catch (error) {
    throw error;
  }
  const result = await response.json();
  return result || [];
}