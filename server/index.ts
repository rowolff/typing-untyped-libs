import { Http2ServerRequest, Http2ServerResponse } from 'http2';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const KLARNA_USERNAME = process.env.KLARNA_USERNAME || '';
const KLARNA_PASSWORD = process.env.KLARNA_PASSWORD || '';

const http = require('http');

const hostname = '127.0.0.1';
const port = 8080;

const request = {
  purchase_country: 'DE',
  purchase_currency: 'EUR',
  locale: 'de-DE',
  order_amount: 499,
  order_tax_amount: 0,
  order_lines: [
    {
      type: 'physical',
      reference: '19-402',
      name: 'Battery Power Pack',
      quantity: 1,
      unit_price: 499,
      tax_rate: 0,
      total_amount: 499,
      total_discount_amount: 0,
      total_tax_amount: 0,
      image_url: 'https://www.exampleobjects.com/logo.png',
      product_url: 'https://www.estore.com/products/f2a8d7e34',
    },
  ],
};

const authRequest = {
  purchase_country: 'DE',
  purchase_currency: 'EUR',
  billing_address: {
    given_name: 'Omer',
    family_name: 'Heberstreit',
    email: 'omer@Heberstreit.com',
    title: 'Herr',
    street_address: 'Im Friedenstal 38',
    postal_code: '55006',
    city: 'WestSchon Matishagenfeld',
    region: '',
    phone: '+491522113356',
    country: 'DE',
  },
  shipping_address: {
    given_name: 'Omer',
    family_name: 'Heberstreit',
    email: 'omer@Heberstreit.com',
    title: 'Herr',
    street_address: 'Im Friedenstal 38',
    postal_code: '55006',
    city: 'WestSchon Matishagenfeld',
    region: '',
    phone: '+491522113356',
    country: 'DE',
  },
  order_amount: 10,
  order_tax_amount: 0, // optional
  order_lines: [
    {
      type: 'physical', // optional
      reference: '19-402', // optional
      name: 'Battery Power Pack',
      quantity: 1,
      unit_price: 10,
      tax_rate: 0, // optional
      total_amount: 10,
      total_discount_amount: 0, // optional
      total_tax_amount: 0, // optional
      product_url: 'https://www.estore.com/products/f2a8d7e34', // optional
      image_url: 'https://www.exampleobjects.com/logo.png', // optional
    },
  ],
  merchant_urls: {
    confirmation: 'https://example.com/confirmation',
    notification: 'https://example.com/pending', // optional
  },
  merchant_reference1: '45aa52f387871e3a210645d4', // optional
};

type PaymentSessionResponse = {
  session_id: string;
  client_token: string;
  payment_method_categories: Record<string, string>[];
};

const server = http.createServer(
  async (req: Http2ServerRequest, res: Http2ServerResponse) => {
    console.log(req);
    if (req.url.includes('token')) {
      const { data } = await axios.post<PaymentSessionResponse>(
        'https://api.playground.klarna.com/payments/v1/sessions',
        request,
        {
          auth: { username: KLARNA_USERNAME, password: KLARNA_PASSWORD },
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const clientToken = data.client_token;

      console.log('server: client_token =', clientToken);

      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
      const responseBody = { clientToken };
      res.write(JSON.stringify(responseBody));
      res.end();
    }

    if (req.url.includes('authorize')) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
      res.setHeader('Access-Control-Allow-Headers', '*');
      const responseBody = { success: true };
      res.write(JSON.stringify(responseBody));
      res.end();
    }
  }
);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
