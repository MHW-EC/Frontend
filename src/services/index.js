
const url = process.env.MHW_LAMBDA_READ_URL || "https://ccgcmb0zka.execute-api.sa-east-1.amazonaws.com/prod/read"
console.log("env", process.env)
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