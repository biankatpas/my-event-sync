import { Amplify } from 'aws-amplify';
import * as Auth from '@aws-amplify/auth';

const getEndpoint = (apiName) => {
  const config = Amplify.getConfig();
  if (!config.API || !config.API.REST || !config.API.REST[apiName]) {
    throw new Error(`Endpoint not found for API: ${apiName}`);
  }
  return config.API.REST[apiName].endpoint;
};

const getAuthToken = async () => {
  try {
    const session = await Auth.fetchAuthSession();
    if (
      session &&
      session.tokens &&
      session.tokens.accessToken &&
      typeof session.tokens.accessToken.toString === 'function'
    ) {
      return session.tokens.accessToken.toString();
    }
    return null;
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
};

const attachAuthHeader = async (init = {}) => {
  const token = await getAuthToken();
  if (token) {
    init.headers = {
      ...(init.headers || {}),
      'Authorization': `Bearer ${token}`
    };
  }
  return init;
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
  
  init = await attachAuthHeader(init);
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

  init = await attachAuthHeader(init);
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
  
  init = await attachAuthHeader(init);
  const response = await fetch(url, {
    ...init,
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Erro DELETE HTTP! Status: ${response.status}`);
  }
  return await response.json();
};
