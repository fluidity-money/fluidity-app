// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.


import axios, { AxiosError } from "axios";

const baseURL = process.env.REACT_APP_FLU_API_URI;

if (!baseURL)
  throw new Error("REACT_APP_FLU_API_URI not set!");

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },

  responseType: 'json'
});

interface apiRequest {
  path: string,
  body?: any,
  headers?: Record<string, any>
};

export const apiRequest = ({ path, headers, body }: apiRequest) =>
  axiosInstance.post(path, body, {
    headers: headers
  }).then(response => {
    if (response.data == "")
      throw new Error("API server returned error!");

    return response.data;
  });

type submitQuestionRequest = {
  name: string,
  email: string,
  question: string
};

type submitQuestionResponse = {
  status: string
};

export const submitQuestionRequest =
  (name: string, email: string, question: string)
    : Promise<submitQuestionResponse> => {
    const params = {
      name,
      email,
      question,
    };

    return (
      apiRequest({ path: '/api/submit-question', body: params }) as
      Promise<submitQuestionResponse>
    );
  };

type SupportedTokensEthereum = "fUSDT" | "fUSDC" | "fDAI";

type SupportedTokensSolana = "fUSDC" | "fUSDT";

export type SupportedNetworks = "ethereum";

export type SupportedTokens<T extends SupportedNetworks | "all" = "ethereum"> =
  T extends "ethereum" ?
    SupportedTokensEthereum :
  T extends "solana" ?
    SupportedTokensSolana :
    SupportedTokensEthereum | SupportedTokensSolana;

type submitUniquePhraseRequest = {
  network: string,
  address: string,
  token_name: SupportedTokens,
};

type submitUniquePhraseResponse = {
  response_message: 'Bad network!' | 'Bad address!' | 'Phrase already received!' | 'Bad Token!',
  was_error: boolean,
  unique_phrase: string
};

export const submitUniquePhraseRequest = (network: string, address: string, token_name: SupportedTokens)
  : Promise<submitUniquePhraseResponse> => {
  const params = {
    network,
    address,
    token_name
  };

  return (
    apiRequest({ path: '/api/request-unique-phrase', body: params }) as
    Promise<submitUniquePhraseResponse>
  );
};

export const handleResponseError = async (
  network: string,
  address: string,
  token: SupportedTokens,
  response: submitUniquePhraseResponse,
  addError: (error: string) => void
): Promise<boolean> => {

  if (!response.was_error)
    return true;

  switch (response.response_message) {
    case 'Bad address!':
      addError(`${address} is an invalid address!`);
      return false;

    case 'Bad network!':
      addError(`${network} is not a supported network!`);
      return false;
    // this should never happen unless there's a mismatch between supported tokens
    case 'Bad Token!':
      addError(`${token} is not a supported token!`);
      return false;
  }
  return true;
};

// wrapper for making faucet requests that handles errors
export const handleUniquePhraseRequest = async (
  network: string,
  address: string,
  token: SupportedTokens,
  addError: (error: string) => void,
  addNotification: (error: string) => void,
  addTwitterNotification: (notification: string) => void,
): Promise<boolean> => {
  try {

    const response = await submitUniquePhraseRequest(network, address, token);

    const wasSuccessful = await handleResponseError(
      network,
      address,
      token,
      response,
      addError
    );

    const uniqueCode = response.unique_phrase;

    if (wasSuccessful) {
      addNotification(`Got the unique address ${uniqueCode}!`);
      addTwitterNotification(uniqueCode);
    }

    return wasSuccessful;

  } catch (e: any) {
    if (e.message === "API server returned error!") {
      const error = e as Error;
      console.error("API internal error", error);
    } else {
      const error = e as AxiosError;
      console.error("Axios request failure", error);
    }

    return false;
  }
}
