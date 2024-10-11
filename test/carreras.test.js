import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

test('Get todas las carreras', async () => {
  mock.onGet('/api/carreras/').reply(200, {
    data: [
      {
        careerId: 1,
        unahurSubjects: { year: 1, campo: 'Test' },
        englishLevels: { year: 1, campo: 'Test' },
        suggestionThresholdRegularizedSubjects: 1,
        careerName: 'Test de carrera',
        specialCareerName: 'Test',
        minimumSubjectsRecommended: 1,
      },
    ],
  });

  const response = await axios.get('/api/carreras/');

  expect(response.data).toEqual({ data: [] });
});

test('Get una carrera por ID', async () => {
  mock.onGet('/api/carreras/', { params: { careerId: '1' } }).reply(200, {
    data: {
      careerId: 1,
      unahurSubjects: { year: 1, campo: 'Test' },
      englishLevels: { year: 1, campo: 'Test' },
      suggestionThresholdRegularizedSubjects: 1,
      careerName: 'Test de carrera',
      specialCareerName: 'Test',
      minimumSubjectsRecommended: 1,
    },
  });

  const response = await axios.get('/api/carreras/', {
    params: { careerId: '1' },
  });

  expect(response.data).toEqual({ data: [] });
});
