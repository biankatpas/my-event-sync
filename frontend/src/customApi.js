import { Amplify } from 'aws-amplify';

const getEndpoint = (apiName) => {
  const config = Amplify.getConfig();
  if (!config.API || !config.API.REST || !config.API.REST[apiName]) {
    throw new Error(`Endpoint para API "${apiName}" não encontrado na configuração.`);
  }
  return config.API.REST[apiName].endpoint;
};

export const customGet = async (apiName, path, init = {}) => {
  const endpoint = getEndpoint(apiName);
  const url = `${endpoint}${path}`;
  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error(`Erro GET HTTP! Status: ${response.status}`);
  }
  return await response.json();
};

export const customPost = async (apiName, path, init = {}) => {
  const endpoint = getEndpoint(apiName);
  const url = `${endpoint}${path}`;
  const response = await fetch(url, {
    ...init,
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error(`Erro POST HTTP! Status: ${response.status}`);
  }
  return await response.json();
};

export const customPut = async (apiName, path, init = {}) => {
  const endpoint = getEndpoint(apiName);
  const url = `${endpoint}${path}`;
  const response = await fetch(url, {
    ...init,
    method: 'PUT',
  });
  if (!response.ok) {
    throw new Error(`Erro PUT HTTP! Status: ${response.status}`);
  }
  return await response.json();
};

export const customDel = async (apiName, path, init = {}) => {
  const endpoint = getEndpoint(apiName);
  const url = `${endpoint}${path}`;
  const response = await fetch(url, {
    ...init,
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Erro DELETE HTTP! Status: ${response.status}`);
  }
  return await response.json();
};
