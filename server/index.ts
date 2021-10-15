import axios, { AxiosError } from 'axios';
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { sessionRequest, authorizationRequest } from './payloads';

dotenv.config();

const KLARNA_USERNAME = process.env.KLARNA_USERNAME || '';
const KLARNA_PASSWORD = process.env.KLARNA_PASSWORD || '';

const app = express();
app.disable('x-powered-by');

const corsOptions = {
  origin: ['http://localhost:3000'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

const klarnaApi = axios.create({
  baseURL: 'https://api.playground.klarna.com/payments/v1',
  auth: { username: KLARNA_USERNAME, password: KLARNA_PASSWORD },
  headers: { 'Content-Type': 'application/json' },
});

type PaymentSessionResponse = {
  session_id: string;
  client_token: string;
  payment_method_categories: Record<string, string>[];
};

app.get('/token', async (_req, res) => {
  const { data } = await klarnaApi.post<PaymentSessionResponse>(
    '/sessions',
    sessionRequest
  );

  return res.status(200).send({ clientToken: data.client_token });
});

app.post('/authorize', async (req, res) => {
  const authToken = req.body.authorization_token;
  try {
    const { data } = await klarnaApi.post(
      `/authorizations/${authToken}/order`,
      authorizationRequest
    );
    return res.status(200).send(data);
  } catch (e) {
    const axiosError = e as AxiosError;
    return res
      .status(axiosError?.response?.status || 503)
      .send('Authorization Rejected!'); // don't let the client know the details
  }
});

app.listen(8080);
