const { crearCarrera } = require('../lib/controllers/carreras.controller');

//Implementamos el mock del modulo de mongoose

//Mockeamos el archivo que define materiasSchema
jest.mock('../lib/models/carreras.schema', () => ({
  CareerDataSchema: {},
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

//Test de creacion de materia
describe('Carreras controller', () => {
  test('crearCarrera', async () => {
    //Mockeamos el objeto request
    const mockReq = {
      body: {
        careerId: 1,
        unahurSubjects: [],
        englishLevels: [],
        suggestionThresholdRegularizedSubjects: 1,
        specialCareerName: 'Test',
        minimumSubjectsRecommended: 1,
      },
    };
    const mockRes = new MockResponse();
    await crearCarrera(mockReq, mockRes);
    expect(mockRes.theStatus).toEqual(200);
  });
});
