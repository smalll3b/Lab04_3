import axios from 'axios';
import { api } from './http-common';

export const http = axios.create({
  baseURL: api.uri,
});

