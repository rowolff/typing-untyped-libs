export const ORDER_DATA = {
  billing_address: {
    given_name: 'Omer',
    family_name: 'Heberstreit',
    email: 'omer@Heberstreit.com',
    title: 'Herr',
    street_address: 'Hermannstraße 64',
    street_address2: '',
    postal_code: '53225',
    city: 'Bonn',
    phone: '+491522113356',
    country: 'DE',
  },
  shipping_address: {
    given_name: 'Omer',
    family_name: 'Heberstreit',
    email: 'omer@Heberstreit.com',
    title: 'Herr',
    street_address: 'Hermannstraße 64',
    street_address2: '',
    postal_code: '53225',
    city: 'Bonn',
    phone: '+491522113356',
    country: 'DE',
  },
  order_amount: 10,
  order_lines: [
    {
      type: 'physical',
      reference: '19-402',
      name: 'Battery Power Pack',
      quantity: 1,
      unit_price: 10,
      tax_rate: 0,
      total_amount: 10,
      total_discount_amount: 0,
      total_tax_amount: 0,
      product_url: 'https://www.estore.com/products/f2a8d7e34',
      image_url: 'https://www.exampleobjects.com/logo.png',
    },
  ],
};
