// const API_URL = "https://5239af1a-a557-4587-8f6a-2a8409a0d9b5.mock.pstmn.io/prod/read"
const API_URL = "https://ccgcmb0zka.execute-api.sa-east-1.amazonaws.com/prod/read"

export async function getData(params) {
  const {
    resourceName,
    query,
    queryParams,
    projectedFields
  } = params;
  if(!resourceName || !query) throw new Error("EMPTY PARAMS NOT ALLOWED")

  const payload = {
    resourceName,
    query,
    queryParams,
    projectedFields
  }
  let response;
  let apiUrl = new URL(API_URL)

  try {
    response = await fetch(apiUrl.toString(), {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  } catch (error) {
    throw error;
  }
  const result = await response.json();
  return result || [];
}