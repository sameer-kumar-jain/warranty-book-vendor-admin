import {
  get as getData,
  post as postData,
  put as putData,
  del as delData
} from 'aws-amplify/api';
import { uploadData } from 'aws-amplify/storage'
import awsmobile from '../aws-exports';
import { fetchAuthSession } from 'aws-amplify/auth';
const apiName = awsmobile["aws_cloud_logic_custom"][0]["name"]



export const get = async (path, params) => {
  const options = {
    headers: { Authorization: `Bearer ${(await fetchAuthSession()).tokens.idToken.toString()}` }
  };
  if (params) {
    let q = Object.keys(params).map(key => `${key}=${params[key]}`).join("&");
    path = `${path}?${q}`
  }
  console.log('loading', path, 'with options', options)
  const restOperation = getData({ apiName, path, options })
  const response = await restOperation.response
  const { data } = await response.body.json()
  return data;
}

export const post = async (path, params) => {
  const options = {
    body: params,
    headers: {
      "Content-Type": 'application/json',
      Authorization: `Bearer ${(await fetchAuthSession()).tokens.idToken.toString()}`
    }
  };
  console.log('post', path, 'with options', options)
  const restOperation = postData({ apiName, path, options });
  const response = await restOperation.response
  const { data } = await response.body.json()
  return data;
}

export const put = async (path, params) => {
  const options = {
    body: params,
    headers: {
      "Content-Type": 'application/json',
      Authorization: `Bearer ${(await fetchAuthSession()).tokens.idToken.toString()}`
    }
  };
  console.log('update', path, 'with options', options)
  const restOperation = putData({ apiName, path, options });
  const response = await restOperation.response
  const { data } = await response.body.json()
  return data;
}

export const del = async (path, params) => {
  const restOperation = delData({
    apiName, path, options: {
      body: params, headers:
      {
        accept: 'application/json',
        Authorization: `Bearer ${(await fetchAuthSession()).tokens.idToken.toString()}`
      }
    }
  });
  const response = await restOperation.response
  const { data } = response.body.json()
  return data;
}

export const uploadMedia = async (blob, path, contentType) => {
  return uploadData({
    data: blob,
    path: ({ identityId }) => `protected/${identityId}/${path}`,
    options: {
      contentType
    }
  }).result
}