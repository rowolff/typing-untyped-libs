declare global {
  type ClientTokenResponse = {
    clientToken: string;
  };

  type AuthResult = {
    order_id: string;
  };

  interface Window {
    Klarna: Klarna;
  }

  type Klarna = {
    Payments: Payments;
  };

  type Payments = {
    init: Init;
    load: Load;
    authorize: Authorize;
  };

  type Init = (config: InitConfig) => void;
  type Load = (config: LoadConfig, loadCb: LoadCallback) => void;
  type Authorize = (
    config: AuthConfig,
    orderData: OrderSummary,
    authCb: AuthCallback
  ) => void;

  type InitConfig = {
    client_token: string;
  };

  type LoadConfig = {
    container: string;
    payment_method_category: 'pay_now' | 'pay_later';
  };

  type LoadCallback = (res: LoadResponse) => void;

  type LoadResponse = {
    show_form: boolean;
  };

  type AuthCallback = (res: AuthResponse) => void;

  type AuthResponse = {
    approved: boolean;
    authorization_token: string;
    error?: Error;
  };

  type OrderSummary = {
    billing_address: Address;
    shipping_address: Address;
    order_amount: number;
    order_lines: Order[];
  };

  type Address = {
    given_name: string;
    family_name: string;
    email: string;
    title: string;
    street_address: string;
    street_address2: string;
    postal_code: string;
    city: string;
    phone: string;
    country: string;
  };

  type Order = {
    type: string;
    reference: string;
    name: string;
    quantity: number;
    unit_price: number;
    tax_rate: number;
    total_amount: number;
    total_discount_amount: number;
    total_tax_amount: number;
    product_url: string;
    image_url: string;
  };
}

export {};
