import { fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';

export const API_BASE_URL = 'https://dummyjson.com';
const REQUEST_TIMEOUT_MS = 15000;

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
});

export const baseQuery = retry(rawBaseQuery, {
  maxRetries: 2,
});