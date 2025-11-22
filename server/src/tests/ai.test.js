const request = require('supertest');
const app = require('../../src/server'); // Adjust path as needed

describe('AI Recommendations API', () => {
  it('should return AI recommendations with a valid query and products', async () => {
    const products = [
      { sku: 'P1', name: 'Product 1', description: 'Description 1', category: 'Category A' },
      { sku: 'P2', name: 'Product 2', description: 'Description 2', category: 'Category B' },
    ];

    const response = await request(app)
      .post('/api/ai/recommend')
      .send({ query: 'I need something for pain', products })
      .expect(200);

    expect(response.body).toHaveProperty('assistantResponse');
    expect(response.body).toHaveProperty('recommendedSkus');
    expect(Array.isArray(response.body.recommendedSkus)).toBe(true);
  });

  it('should return 400 if query is missing', async () => {
    const products = [
      { sku: 'P1', name: 'Product 1', description: 'Description 1', category: 'Category A' },
    ];

    await request(app)
      .post('/api/ai/recommend')
      .send({ products })
      .expect(400);
  });
});
