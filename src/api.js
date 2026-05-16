/* ============================================================
   STUDIO ELEGANCE — Cliente de API
   Centraliza todas as chamadas ao backend REST.
   Expõe: window.studioApi
============================================================ */
(function () {
  const BASE_URL = 'http://localhost:3000/api';
  const TOKEN_KEY  = 'se_token';
  const CLIENTE_KEY = 'se_cliente';

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  async function request(method, path, body) {
    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const json = await res.json();

    if (!res.ok) {
      const msg = json.mensagem || 'Erro inesperado. Tente novamente.';
      throw new Error(msg);
    }

    return json;
  }

  /* ── Helpers locais ── */
  function salvarSessao(token, cliente) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(CLIENTE_KEY, JSON.stringify(cliente));
  }

  function limparSessao() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CLIENTE_KEY);
  }

  /* ── API pública ── */
  window.studioApi = {
    auth: {
      isAutenticado() {
        return !!getToken();
      },
      getCliente() {
        const raw = localStorage.getItem(CLIENTE_KEY);
        return raw ? JSON.parse(raw) : null;
      },
      async login(email, senha) {
        const res = await request('POST', '/auth/login', { email, senha });
        salvarSessao(res.dados.token, res.dados.cliente);
        return res.dados;
      },
      async registrar(nome, email, senha, telefone) {
        const res = await request('POST', '/auth/registrar', {
          nome,
          email,
          senha,
          telefone,
        });
        salvarSessao(res.dados.token, res.dados.cliente);
        return res.dados;
      },
      logout() {
        limparSessao();
        window.location.reload();
      },
    },

    servicos: {
      async listar(categoria) {
        const query = categoria && categoria !== 'todos' ? `?categoria=${categoria}` : '';
        const res = await request('GET', `/servicos${query}`);
        return res.dados.servicos;
      },
    },

    agendamentos: {
      async listar() {
        const res = await request('GET', '/agendamentos');
        return res.dados.agendamentos;
      },
      async criar(fk_id_servico, data_hora_inicio) {
        const res = await request('POST', '/agendamentos', { fk_id_servico, data_hora_inicio });
        return res.dados.agendamento;
      },
      async reagendar(id, data_hora_inicio) {
        const res = await request('PATCH', `/agendamentos/${id}/reagendar`, { data_hora_inicio });
        return res.dados.agendamento;
      },
      async cancelar(id) {
        const res = await request('PATCH', `/agendamentos/${id}/cancelar`);
        return res.dados.agendamento;
      },
      async horariosDisponiveis(data, excluirAgendamentoId) {
        let path = `/agendamentos/horarios-disponiveis?data=${data}`;
        if (excluirAgendamentoId) path += `&excluir=${excluirAgendamentoId}`;
        const res = await request('GET', path);
        return res.dados.horarios;
      },
    },
  };
})();
