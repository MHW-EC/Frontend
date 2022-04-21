
const API_URL = "https://ccgcmb0zka.execute-api.sa-east-1.amazonaws.com/prod/"
export async function getData(params, abortSignal) {
  const {
    resourceName,
    query,
    queryParams,
    projectedFields
  } = params || {};
  if(!resourceName || !query) throw new Error("EMPTY PARAMS NOT ALLOWED")

  const payload = {
    resourceName,
    query,
    queryParams,
    projectedFields
  }
  let response;
  let apiUrl = new URL('read', API_URL).toString()
  try {
    response = await fetch(apiUrl.toString(), {
      method: 'POST',
      body: JSON.stringify(payload),
      signal: abortSignal
    });
  } catch (error) {
    throw error;
  }
  const result = await response.json();
  return result || [];
}
export async function generate(params, abortSignal) {
  const {
    body
  } = params || {};
  if(!body) throw new Error("EMPTY PARAMS NOT ALLOWED")

  let response;
  let apiUrl = new URL('generate', API_URL).toString()
  try {
    response = await fetch(apiUrl.toString(), {
      method: 'PUT',
      body: JSON.stringify({payload: body}),
      signal: abortSignal
    });
  } catch (error) {
    throw error;
  }
  const result = await response.json();
  return result || [];
}