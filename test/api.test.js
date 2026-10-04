import request from 'supertest';
import { expect } from 'chai';
import mongoose from 'mongoose';
import app from '../src/app.js';
import dados from './data/testData.json' with { type: 'json' };
import { loginAdmin, loginUser } from './helpers/auth.js';

describe('Fluxo de aluno', () => {
  dados.alunos.forEach((aluno, index) => {
    it('deve cadastrar, logar e registrar um trabalho para o aluno ' + (index + 1), async () => {
      const alunoTeste = {
        ...aluno,
        email: aluno.email.replace('@', '+' + Date.now() + '@'),
        matricula: aluno.matricula + Date.now(),
      };

      const loginAdminResponse = await loginAdmin(dados.admin);
      expect(loginAdminResponse.status).to.equal(200);
      expect(loginAdminResponse.body).to.have.property('token');

      const adminToken = loginAdminResponse.body.token;

      const cadastroResponse = await request(app)
        .post('/api/admin/alunos')
        .set('Authorization', 'Bearer ' + adminToken)
        .send(alunoTeste);

      expect(cadastroResponse.status).to.equal(201);
      expect(cadastroResponse.body).to.have.property('id');
      expect(cadastroResponse.body.email).to.equal(alunoTeste.email);

      const alunoId = cadastroResponse.body.id;

      const matriculaResponse = await request(app)
        .post('/api/admin/disciplinas/' + dados.disciplina + '/matriculas')
        .set('Authorization', 'Bearer ' + adminToken)
        .send({ alunoId });

      expect(matriculaResponse.status).to.equal(201);

      const loginUserResponse = await loginUser(alunoTeste);
      expect(loginUserResponse.status).to.equal(200);
      expect(loginUserResponse.body).to.have.property('token');
      expect(loginUserResponse.body.usuario.role).to.equal('aluno');

      const userToken = loginUserResponse.body.token;

      const trabalhoResponse = await request(app)
        .post('/api/alunos/' + alunoId + '/trabalhos')
        .set('Authorization', 'Bearer ' + userToken)
        .send({
          disciplinaId: dados.disciplina,
          titulo: dados.trabalho.titulo,
          descricao: dados.trabalho.descricao,
        });

      expect(trabalhoResponse.status).to.equal(201);
      expect(trabalhoResponse.body.alunoId).to.equal(alunoId);
      expect(trabalhoResponse.body.disciplinaId).to.equal(dados.disciplina);
      expect(trabalhoResponse.body.titulo).to.equal(dados.trabalho.titulo);

      const trabalhoId = trabalhoResponse.body.id;

      const removeTrabalhoResponse = await request(app)
        .delete('/api/admin/trabalhos/' + trabalhoId)
        .set('Authorization', 'Bearer ' + adminToken);

      expect(removeTrabalhoResponse.status).to.equal(204);

      const removeAlunoResponse = await request(app)
        .delete('/api/admin/alunos/' + alunoId)
        .set('Authorization', 'Bearer ' + adminToken);

      expect(removeAlunoResponse.status).to.equal(204);
    });
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
