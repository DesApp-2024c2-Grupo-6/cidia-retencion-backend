const { createParrafo } = require('../lib/controllers/parrafo.controller');

// Para testear error se guarda el estado de la ejecucion
let mockSaveExecution;

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
          save: async () => {
            mockSaveExecution(); //Se guarda el estado de la implementacion de modo que el test pasado ya halla agregado el parrafo
          },
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
  beforeEach(() => {
    mockSaveExecution = () => {};
  });

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

  test('createParrafo - error', async () => {
    mockSaveExecution = () => {
      throw new Error('mock de error al hacer el save');
    };
    const mockReq = {
      body: { parrafoId: 1, nuevaClave: 'parrafo2', nuevoTexto: 'lineaX' },
    };
    const mockRes = new MockResponse();
    await createParrafo(mockReq, mockRes);
    expect(mockRes.theStatus).toEqual(500);
    expect(mockRes.data.message).toEqual('Error al agregar el párrafo');
  });
});
