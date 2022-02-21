
const url = process.env.MHW_LAMBDA_READ_URL || "https://5239af1a-a557-4587-8f6a-2a8409a0d9b5.mock.pstmn.io/prod/read"

export async function getData(params, devQueryParams) {
  const {
    resourceName,
    query,
    queryParams,
    projectedFields
  } = params;
  const {
    id
  } = devQueryParams;
  if(!resourceName || !query) throw new Error("EMPTY PARAMS NOT ALLOWED")

  const payload = {
    resourceName,
    query,
    queryParams,
    projectedFields
  }
  let response;
  let devUrl = new URL(url)
  devUrl.searchParams.append('id', id);

  try {
    response = await fetch(devUrl.toString(), {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  } catch (error) {
    throw error;
  }
  const result = await response.json();
  return result || [];
}