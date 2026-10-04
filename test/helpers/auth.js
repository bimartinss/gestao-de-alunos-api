import 'dotenv/config';
import request from 'supertest';
import app from '../../src/app.js';

export async function loginAdmin(dados) {
  const resposta = await request(app)
    .post('/api/auth/login')
    .send({
      email: process.env.ADMIN_EMAIL || dados.email,
      senha: process.env.ADMIN_PASSWORD || dados.senha,
    });

  return resposta;
}

export async function loginUser(dados) {
  const resposta = await request(app)
    .post('/api/auth/login')
    .send({
      email: dados.email,
      senha: dados.senha,
    });

  return resposta;
}
