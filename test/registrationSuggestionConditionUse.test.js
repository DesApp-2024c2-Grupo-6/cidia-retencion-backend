const {
  crearCondicionesCarrera,
} = require('../lib/controllers/registrationSuggestionConditionUse.controller');

//Mockeamos el archivo que define RegistrationSuggestionConditionUseSchema
jest.mock('../lib/models/registrationSuggestionConditionUse.schema');

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

//Test de creacion de condicion de carrera
describe('Condicion de carrera controler', () => {
  test('crearCondicionesCarrera', async () => {
    //Mockeamos el objeto request
    const mockReq = {
      body: {
        id_carrera: 1,
        id_materia: 1,
        anio: 1,
        campo: 'Test',
        codigo_condicion: 1,
        config_condicion: 1,
      },
    };
    const mockRes = new MockResponse();
    await crearCondicionesCarrera(mockReq, mockRes);
    expect(mockRes.theStatus).toEqual(200);
  });
});
