// const { agregarMateria }  = require('../lib/controllers/materias.controller');

// //Implementamos el mock del modulo de mongoose

// //Mockeamos el archivo que define materiasSchema
// jest.mock('../lib/models/materias.schema');

// //Mockeamos el objeto response
// class MockResponse {
//   send(_data) {
//     this.data = _data;
//     return this;
//   }
//   json(_data) {
//     this.data = _data;
//     return this;
//   }
//   status(n) {
//     this.theStatus = n;
//     return this;
//   }
// }

// //Test de creacion de materia
// describe('Materia controller', () => {
//   test('agregarMateria', async () => {
//     //Mockeamos el objeto request
//     const mockReq = {
//       body: { id_materia: 1, id_carrera: 1, anio: 1, campo: 'Testeando', specialSubjectName: 'Test' },
//     };
//     const mockRes = new MockResponse();
//     agregarMateria.mockResolvedValue({ id_materia: 1, id_carrera: 1, anio: 1, campo: 'Testeando', specialSubjectName: 'Test' });
//     await agregarMateria(mockReq, mockRes);
//     expect(mockRes.theStatus).toEqual(200);
//   });
// });
