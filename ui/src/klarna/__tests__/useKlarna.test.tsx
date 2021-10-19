import { renderHook } from '@testing-library/react-hooks';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { useKlarna } from '../useKlarna';
import axios from 'axios';

const TEST_ID = 'test';
const successFnMock = jest.fn();

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const klarnaMock = {
  Payments: {
    init: jest.fn(),
    load: jest.fn(),
    authorize: jest.fn(),
  },
};

const loadKlarnaScript = async () => {
  let script;
  await waitFor(() => {
    script = document.querySelector('script');
    expect(script).toBeTruthy();
  });
  if (script) {
    fireEvent.load(script);
  }
};

beforeEach(() => {
  jest.clearAllMocks();
  window.Klarna = klarnaMock;
  mockedAxios.get.mockReturnValue(
    Promise.resolve({ data: { client_token: 'client_token' } })
  );
  document.body.innerHTML = '';
});

test('when hook is used, Klarna initialises', async () => {
  renderHook(() => useKlarna(TEST_ID, successFnMock));

  await loadKlarnaScript();

  expect(klarnaMock.Payments.init).toHaveBeenCalled();
});

test('when klarna loads the payment, it Klarna becomes ready', async () => {
  klarnaMock.Payments.load.mockImplementation(
    (config: LoadConfig, cb: LoadCallback) => {
      expect(config.container).toBe('#' + TEST_ID);
      cb({ show_form: true });
    }
  );

  const { result } = renderHook(() => useKlarna(TEST_ID, successFnMock));
  await loadKlarnaScript();

  expect(result.current.ready).toBe(true);
});
