const { createParrafo } = require('../lib/controllers/parrafo.controller');

//Implementamos el mock del modulo de mongoose

jest.mock('mongoose', () => ({
  __esModule: true,
  default: {
    model: (_name, _schema) => {
      return {
        findById: (_id) => ({
          _rawData: [
            {
              key: 'parrafo1',
              text: ['linea1', 'linea2'],
              condition: [],
            },
          ],
          save: async () => {},
        }),
      };
    },
  },
}));

//Mockeamos el archivo que define parrafoDataSchema
jest.mock('../lib/models/parrafo.schema', () => ({
  parrafoDataSchema: {},
}));

//Mockeamos el objeto response
class MockResponse {
  send(_data) {
    this.data = _data;
    return this;
  }
  json(_data) {
    this.data = _data;
    return this;
  }
  status(n) {
    this.theStatus = n;
    return this;
  }
}

//Test de creacion de parrafo
describe('parrafo controler', () => {
  test('createParrafo', async () => {
    //Mockeamos el objeto request
    const mockReq = {
      body: { parrafoId: 1, nuevaClave: 'parrafo2', nuevoTexto: 'lineaX' },
    };
    const mockRes = new MockResponse();
    await createParrafo(mockReq, mockRes);
    expect(mockRes.theStatus).toEqual(200);
    expect(mockRes.data.message).toEqual('Párrafo agregado correctamente');
    expect(mockRes.data.parrafo._rawData).toHaveLength(2);
  });
});
