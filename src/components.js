/* ============================================================
   STUDIO ELEGANCE — Componentes compartilhados
   Injeta header, modal de login e modal de agendamento.
   Expõe: window.initPage() e window.openBooking(service)
   Requer: window.studioApi (src/api.js carregado antes)
============================================================ */
(function () {
  const LOGO = './imagem/logo.png';

  /* ══════════════════════════════════════════
     MODAL DE LOGIN
  ══════════════════════════════════════════ */
  function injectLoginModal() {
    const root = document.getElementById('modal-root');
    if (!root) return;
    root.innerHTML = `
      <div id="modal-overlay" class="modal-overlay" aria-hidden="true">
        <div id="login-modal" class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">

          <button id="modal-close-btn" class="modal-close-btn" aria-label="Fechar">
            <i data-lucide="x" class="h-4 w-4"></i>
          </button>

          <div class="flex justify-center pb-4">
            <img src="${LOGO}" alt="Studio Elegance"
              class="h-[3.5em] sm:h-[4.6em] w-auto object-contain" draggable="false" />
          </div>

          <div class="text-center">
            <h2 id="modal-title" class="title-font text-2xl text-white">Bem vindo</h2>
            <p class="mt-1.5 text-sm leading-relaxed text-muted">
              Por favor, insira seus dados para acessar o seu santuário.
            </p>
          </div>

          <div class="modal-tabs mt-6">
            <button class="tab-btn active" data-tab="login">ENTRAR</button>
            <button class="tab-btn" data-tab="register">CRIAR CONTA</button>
          </div>

          <!-- Mensagem de erro/sucesso do modal -->
          <div id="modal-msg" class="hidden mt-4 rounded-xl px-4 py-2.5 text-center text-xs font-medium tracking-wide"></div>

          <form id="tab-login" class="tab-panel mt-6" novalidate>
            <div class="modal-field">
              <label class="modal-label">E-MAIL</label>
              <input id="login-email" type="email" class="modal-input"
                placeholder="concierge@studio-elegance.com" autocomplete="email" />
            </div>
            <div class="modal-field mt-5">
              <label class="modal-label">SENHA</label>
              <div class="relative">
                <input id="login-password" type="password" class="modal-input pr-10"
                  placeholder="••••••••••" autocomplete="current-password" />
                <button type="button" class="eye-btn" data-target="login-password"
                  aria-label="Mostrar/ocultar senha">
                  <i data-lucide="eye-off" class="h-4 w-4"></i>
                </button>
              </div>
            </div>
            <button type="submit" id="login-submit" class="modal-submit mt-7">ENTRAR</button>
            <p class="mt-4 text-center text-xs text-label">
              Esqueceu a senha?
              <a href="#" class="ml-1 text-gold hover:underline">Recuperar acesso</a>
            </p>
          </form>

          <form id="tab-register" class="tab-panel hidden mt-6" novalidate>
            <div class="modal-field">
              <label class="modal-label">NOME COMPLETO</label>
              <input id="reg-name" type="text" class="modal-input" placeholder="Seu nome" autocomplete="name" />
            </div>
            <div class="modal-field mt-5">
              <label class="modal-label">E-MAIL</label>
              <input id="reg-email" type="email" class="modal-input" placeholder="seu@email.com" autocomplete="email" />
            </div>
            <div class="modal-field mt-5">
              <label class="modal-label">TELEFONE</label>
              <input id="reg-phone" type="tel" class="modal-input" placeholder="(11) 98765-4321" maxlength="20" autocomplete="tel" inputmode="tel" required />
            </div>
            <div class="modal-field mt-5">
              <label class="modal-label">SENHA</label>
              <div class="relative">
                <input id="reg-password" type="password" class="modal-input pr-10"
                  placeholder="••••••••••" autocomplete="new-password" />
                <button type="button" class="eye-btn" data-target="reg-password"
                  aria-label="Mostrar/ocultar senha">
                  <i data-lucide="eye-off" class="h-4 w-4"></i>
                </button>
              </div>
            </div>
            <button type="submit" id="reg-submit" class="modal-submit mt-7">CRIAR CONTA</button>
          </form>

        </div>
      </div>
    `;
  }

  function formatPrimeiroNome(nome) {
    if (!nome || typeof nome !== 'string') return '';
    const part = nome.trim().split(/\s+/)[0];
    if (!part) return '';
    return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
  }

  /** Texto da pílula (badge) acima do título da home */
  const DASHBOARD_BADGE_VISITANTE = 'BEM VINDOS!';
  const DASHBOARD_BADGE_LOGADA = 'ÁREA MEMBRO';

  /** Atualiza o título da home (#dashboard-greeting) e a pílula (#dashboard-welcome-badge) */
  function syncDashboardGreeting() {
    const el = document.getElementById('dashboard-greeting');
    const badge = document.getElementById('dashboard-welcome-badge');
    const cliente =
      typeof window.studioApi !== 'undefined' && window.studioApi.auth
        ? window.studioApi.auth.getCliente()
        : null;

    if (badge) {
      badge.textContent = cliente ? DASHBOARD_BADGE_LOGADA : DASHBOARD_BADGE_VISITANTE;
    }

    if (el) {
      if (cliente && cliente.nome) {
        const primeiro = formatPrimeiroNome(cliente.nome);
        el.textContent = primeiro
          ? `Que bom ter você aqui, ${primeiro}`
          : 'Descubra sua melhor versão!';
      } else {
        el.textContent = 'Descubra sua melhor versão!';
      }
    }

    syncDashboardAvatar(cliente);
  }

  /** Avatar circular da home: ícone visitante ou inicial do nome quando logada */
  function syncDashboardAvatar(cliente) {
    const icon = document.getElementById('dashboard-avatar-icon');
    const initialEl = document.getElementById('dashboard-avatar-initial');
    if (!icon || !initialEl) return;

    const nome = cliente && cliente.nome ? String(cliente.nome).trim() : '';
    const letra = nome ? nome.charAt(0).toUpperCase() : '';

    if (letra) {
      initialEl.textContent = letra;
      icon.classList.add('hidden');
      initialEl.classList.remove('hidden');
    } else {
      initialEl.textContent = '';
      initialEl.classList.add('hidden');
      icon.classList.remove('hidden');
      if (typeof lucide !== 'undefined') {
        lucide.createIcons({ nodes: [icon.closest('.avatar-ring') || icon.parentElement] });
      }
    }
  }

  /* ══════════════════════════════════════════
     HEADER
  ══════════════════════════════════════════ */
  function injectHeader() {
    const root = document.getElementById('header-root');
    if (!root) return;
    root.innerHTML = `
      <header class="header-glow">
        <div class="layout-shell mx-auto w-full px-4 py-5 sm:px-6 md:px-8 lg:px-10">
          <div class="flex items-center justify-between">
            <a href="./index.html" class="flex items-center">
              <img src="${LOGO}" alt="Studio Elegance"
                class="h-[3.5em] sm:h-[4.6em] w-auto object-contain" draggable="false" />
            </a>
            <div id="header-auth-area"></div>
          </div>
        </div>
      </header>
    `;
  }

  function renderHeaderAuth() {
    const area = document.getElementById('header-auth-area');
    if (!area) return;

    const cliente =
      typeof window.studioApi !== 'undefined' && window.studioApi.auth
        ? window.studioApi.auth.getCliente()
        : null;

    if (cliente) {
      const inicial = cliente.nome ? cliente.nome.charAt(0).toUpperCase() : 'U';
      area.innerHTML = `
        <div class="relative flex items-center">
          <button
            id="profile-btn"
            type="button"
            class="grid h-11 w-11 place-items-center rounded-full border-2 border-gold/90
                   bg-gold/10 text-gold transition hover:bg-gold/20
                   hover:shadow-[0_0_24px_rgba(212,175,55,0.2)] title-font text-base"
            aria-label="Menu do usuário"
          >${inicial}</button>
          <div id="user-menu" class="user-menu-panel hidden" role="menu" aria-label="Menu da conta">
            <a href="./agendamentos.html" class="user-menu-item" role="menuitem">
              <span class="user-menu-item__icon" aria-hidden="true">
                <i data-lucide="calendar"></i>
              </span>
              <span>Agendamentos</span>
            </a>
            <div class="user-menu-sep" aria-hidden="true"></div>
            <button type="button" id="logout-btn" class="user-menu-item user-menu-item--danger" role="menuitem">
              <span class="user-menu-item__icon" aria-hidden="true">
                <i data-lucide="log-out"></i>
              </span>
              <span>Sair</span>
            </button>
          </div>
        </div>
      `;

      document.getElementById('profile-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('user-menu').classList.toggle('hidden');
      });
      document.addEventListener('click', () => {
        const m = document.getElementById('user-menu');
        if (m) m.classList.add('hidden');
      }, { once: false });
      document.getElementById('logout-btn').addEventListener('click', () => {
        window.studioApi.auth.logout();
      });

    } else {
      area.innerHTML = `
        <button
          id="profile-btn"
          type="button"
          class="grid h-11 w-11 place-items-center rounded-full border-2 border-gold/90
                 bg-transparent text-gold transition hover:bg-gold/10
                 hover:shadow-[0_0_24px_rgba(212,175,55,0.2)]"
          aria-label="Abrir login"
          aria-expanded="false"
        >
          <i data-lucide="user" class="h-5 w-5"></i>
        </button>
      `;
    }

    if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [area] });
    syncDashboardGreeting();
  }

  /* ══════════════════════════════════════════
     MODAL DE AGENDAMENTO
  ══════════════════════════════════════════ */
  function injectBookingModal() {
    const root = document.getElementById('booking-root');
    if (!root) return;
    root.innerHTML = `
      <div id="booking-overlay" class="modal-overlay" aria-hidden="true">
        <div id="booking-card" class="booking-card" role="dialog" aria-modal="true" aria-labelledby="booking-title">

          <button id="booking-close-btn" class="modal-close-btn" aria-label="Fechar">
            <i data-lucide="x" class="h-4 w-4"></i>
          </button>

          <div class="mb-7 text-center">
            <h2 id="booking-title" class="title-font text-2xl text-gold">Escolha seu Horário</h2>
            <p class="mt-1.5 text-[0.6rem] font-semibold tracking-[0.26em] text-label">AGENDAMENTO EXCLUSIVO</p>
          </div>

          <div class="grid gap-7 sm:grid-cols-2">

            <!-- Calendário -->
            <div>
              <div class="mb-4 flex items-center justify-between">
                <span id="bk-month-lbl" class="title-font text-base text-white"></span>
                <div class="flex items-center gap-2">
                  <button id="bk-prev" class="cal-nav-btn" aria-label="Mês anterior">
                    <i data-lucide="chevron-left" class="h-4 w-4"></i>
                  </button>
                  <button id="bk-next" class="cal-nav-btn" aria-label="Próximo mês">
                    <i data-lucide="chevron-right" class="h-4 w-4"></i>
                  </button>
                </div>
              </div>
              <div class="grid grid-cols-7 mb-1">
                <span class="cal-weekday">DOM</span>
                <span class="cal-weekday">SEG</span>
                <span class="cal-weekday">TER</span>
                <span class="cal-weekday">QUA</span>
                <span class="cal-weekday">QUI</span>
                <span class="cal-weekday">SEX</span>
                <span class="cal-weekday">SÁB</span>
              </div>
              <div id="bk-days" class="grid grid-cols-7 gap-1"></div>
            </div>

            <!-- Horários + Resumo -->
            <div class="flex flex-col gap-5">
              <div>
                <p class="mb-3 text-[0.6rem] font-semibold tracking-[0.2em] text-label">HORÁRIOS DISPONÍVEIS</p>
                <div id="bk-times" class="grid grid-cols-3 gap-2"></div>
              </div>

              <div id="bk-summary" class="booking-summary hidden">
                <div class="flex items-start justify-between gap-2">
                  <p id="bk-svc-name" class="title-font text-[0.95rem] leading-snug text-gold"></p>
                  <span id="bk-svc-price" class="shrink-0 text-sm font-semibold text-gold"></span>
                </div>
                <p id="bk-svc-dur" class="mt-1 text-[0.72rem] text-muted"></p>
                <div id="bk-dt-row" class="mt-2.5 items-center gap-1.5 text-[0.72rem] text-label" style="display:none">
                  <i data-lucide="calendar" class="h-3.5 w-3.5 shrink-0"></i>
                  <span id="bk-dt-txt"></span>
                </div>
              </div>

              <!-- Mensagem de erro inline do booking -->
              <p id="bk-error" class="hidden text-center text-[0.72rem] text-red-400"></p>
            </div>
          </div>

          <button id="bk-confirm" class="modal-submit mt-7 opacity-40 cursor-not-allowed" disabled>
            CONFIRMAR AGENDAMENTO
          </button>
          <p class="mt-4 text-center">
            <button id="bk-back" class="text-[0.65rem] tracking-[0.18em] text-label transition-colors hover:text-gold/80">
              VOLTAR
            </button>
          </p>

        </div>
      </div>
    `;
  }

  /* ── Lógica do modal de agendamento ── */
  function initBookingBehavior() {
    const bkOverlay  = document.getElementById('booking-overlay');
    const bkCard     = document.getElementById('booking-card');
    if (!bkOverlay) return;

    const bkCloseBtn = document.getElementById('booking-close-btn');
    const bkBackBtn  = document.getElementById('bk-back');
    const bkConfirm  = document.getElementById('bk-confirm');
    const bkMonthLbl = document.getElementById('bk-month-lbl');
    const bkDays     = document.getElementById('bk-days');
    const bkTimes    = document.getElementById('bk-times');
    const bkSummary  = document.getElementById('bk-summary');
    const bkSvcName  = document.getElementById('bk-svc-name');
    const bkSvcPrice = document.getElementById('bk-svc-price');
    const bkSvcDur   = document.getElementById('bk-svc-dur');
    const bkDtRow    = document.getElementById('bk-dt-row');
    const bkDtTxt    = document.getElementById('bk-dt-txt');
    const bkError    = document.getElementById('bk-error');
    const bkTitle    = document.getElementById('booking-title');

    const MONTHS_PT = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                       'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

    const BK_CONFIRM_NOVO = 'CONFIRMAR AGENDAMENTO';
    const BK_CONFIRM_REAG = 'CONFIRMAR REAGENDAMENTO';

    let bkOpen          = false;
    let bkService       = {};
    let bkAgendamentoId = null;
    let bkSelDate       = null;
    let bkSelTime       = null;
    let bkViewDate      = new Date();
    let bkTimesCache    = null; // horários disponíveis vindos da API

    function setBookingMode(isReschedule) {
      if (bkTitle) bkTitle.textContent = isReschedule ? 'Reagendar Horário' : 'Escolha seu Horário';
      bkConfirm.textContent = isReschedule ? BK_CONFIRM_REAG : BK_CONFIRM_NOVO;
    }

    /* ── Abrir ── */
    function openBooking(service) {
      bkService       = service || {};
      bkAgendamentoId = service.agendamentoId || null;
      bkSelDate       = null;
      bkSelTime       = null;
      bkTimesCache    = null;
      bkViewDate      = new Date();
      bkViewDate.setDate(1);

      setBookingMode(!!bkAgendamentoId);
      renderCalendar();
      renderTimes([]);
      renderSummary();
      setError('');

      bkOpen = true;
      bkOverlay.removeAttribute('aria-hidden');
      bkOverlay.classList.remove('overlay-leaving');
      bkOverlay.classList.add('is-open', 'overlay-entering');
      bkCard.classList.remove('modal-leaving');
      bkCard.classList.add('modal-entering');
      document.body.style.overflow = 'hidden';
    }

    /* ── Fechar ── */
    function closeBooking() {
      if (!bkOpen) return;
      bkOpen = false;
      bkCard.classList.remove('modal-entering');
      bkCard.classList.add('modal-leaving');
      bkOverlay.classList.remove('overlay-entering', 'is-open');
      bkOverlay.classList.add('overlay-leaving');
      document.body.style.overflow = '';
      setTimeout(() => {
        bkOverlay.classList.remove('overlay-leaving');
        bkOverlay.setAttribute('aria-hidden', 'true');
        bkCard.classList.remove('modal-leaving');
        bkAgendamentoId = null;
        setBookingMode(false);
        bkConfirm.disabled = true;
        bkConfirm.classList.add('opacity-40', 'cursor-not-allowed');
      }, 280);
    }

    /* ── Mensagem de erro ── */
    function setError(msg) {
      if (!bkError) return;
      if (msg) {
        bkError.textContent = msg;
        bkError.classList.remove('hidden');
      } else {
        bkError.classList.add('hidden');
      }
    }

    /* ── Calendário ── */
    function renderCalendar() {
      const yr  = bkViewDate.getFullYear();
      const mo  = bkViewDate.getMonth();
      bkMonthLbl.textContent = `${MONTHS_PT[mo]} ${yr}`;

      const firstDay  = new Date(yr, mo, 1).getDay();
      const totalDays = new Date(yr, mo + 1, 0).getDate();
      const today     = new Date(); today.setHours(0, 0, 0, 0);

      bkDays.innerHTML = '';

      for (let i = 0; i < firstDay; i++) {
        const el = document.createElement('div');
        el.className = 'cal-day cal-day--empty';
        bkDays.appendChild(el);
      }

      for (let d = 1; d <= totalDays; d++) {
        const date    = new Date(yr, mo, d);
        const isPast  = date < today;
        const isToday = date.getTime() === today.getTime();
        const isSel   = bkSelDate && date.getTime() === bkSelDate.getTime();

        const btn = document.createElement('button');
        btn.textContent = d;
        btn.className   = 'cal-day';
        if (isPast)  { btn.classList.add('cal-day--past'); btn.disabled = true; }
        if (isToday) { btn.classList.add('cal-day--today'); }
        if (isSel)   { btn.classList.add('cal-day--selected'); }

        if (!isPast) {
          btn.addEventListener('click', async () => {
            bkSelDate = date;
            bkSelTime = null;
            renderCalendar();
            renderTimes(null); // null = carregando
            renderSummary();
            setError('');

            // Busca horários disponíveis na API (se usuário estiver logado)
            if (typeof window.studioApi !== 'undefined' && window.studioApi.auth.isAutenticado()) {
              try {
                const iso  = `${yr}-${String(mo + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                const list = await window.studioApi.agendamentos.horariosDisponiveis(iso, bkAgendamentoId);
                bkTimesCache = list;
                renderTimes(list);
              } catch {
                bkTimesCache = ['09:00','10:30','11:00','14:00','15:30','16:30'];
                renderTimes(bkTimesCache);
              }
            } else {
              bkTimesCache = ['09:00','10:30','11:00','14:00','15:30','16:30'];
              renderTimes(bkTimesCache);
            }
          });
        }
        bkDays.appendChild(btn);
      }
    }

    /* ── Slots de horário ── */
    function renderTimes(list) {
      bkTimes.innerHTML = '';

      if (list === null) {
        // Estado de carregamento
        for (let i = 0; i < 6; i++) {
          const el = document.createElement('div');
          el.className = 'time-slot time-slot--disabled animate-pulse';
          el.textContent = '—';
          bkTimes.appendChild(el);
        }
        return;
      }

      const times = list.length > 0 ? list : ['09:00','10:30','11:00','14:00','15:30','16:30'];

      times.forEach(t => {
        const btn = document.createElement('button');
        btn.textContent = t;
        btn.className   = 'time-slot';
        if (!bkSelDate) {
          btn.disabled = true;
          btn.classList.add('time-slot--disabled');
        } else if (t === bkSelTime) {
          btn.classList.add('time-slot--selected');
        }
        btn.addEventListener('click', () => {
          if (!bkSelDate) return;
          bkSelTime = t;
          renderTimes(bkTimesCache || times);
          renderSummary();
        });
        bkTimes.appendChild(btn);
      });
    }

    /* ── Resumo ── */
    function renderSummary() {
      bkSvcName.textContent  = bkService.name     || '';
      bkSvcPrice.textContent = bkService.price    || '';
      bkSvcDur.textContent   = bkService.duration ? `Duração estimada: ${bkService.duration}` : '';
      bkSummary.classList.remove('hidden');

      if (bkSelDate && bkSelTime) {
        bkDtTxt.textContent   = `${bkSelDate.getDate()} de ${MONTHS_PT[bkSelDate.getMonth()]}, ${bkSelTime}`;
        bkDtRow.style.display = 'flex';
        bkConfirm.disabled    = false;
        bkConfirm.classList.remove('opacity-40', 'cursor-not-allowed');
      } else {
        bkDtRow.style.display = 'none';
        bkConfirm.disabled    = true;
        bkConfirm.classList.add('opacity-40', 'cursor-not-allowed');
      }

      if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [bkDtRow] });
    }

    /* ── Navegação de mês ── */
    document.getElementById('bk-prev').addEventListener('click', () => {
      bkViewDate.setMonth(bkViewDate.getMonth() - 1);
      renderCalendar();
    });
    document.getElementById('bk-next').addEventListener('click', () => {
      bkViewDate.setMonth(bkViewDate.getMonth() + 1);
      renderCalendar();
    });

    /* ── Confirmar ── */
    bkConfirm.addEventListener('click', async () => {
      if (!bkSelDate || !bkSelTime || bkConfirm.disabled) return;
      setError('');

      // Verifica autenticação
      if (typeof window.studioApi === 'undefined' || !window.studioApi.auth.isAutenticado()) {
        closeBooking();
        setTimeout(() => window.__studioEleganceUi?.openLogin(), 320);
        return;
      }

      // Monta o ISO datetime
      const [horas, mins] = bkSelTime.split(':').map(Number);
      const dt = new Date(bkSelDate);
      dt.setHours(horas, mins, 0, 0);

      const isReschedule = !!bkAgendamentoId;
      bkConfirm.textContent = isReschedule ? 'REAGENDANDO…' : 'AGENDANDO…';
      bkConfirm.disabled    = true;

      try {
        if (isReschedule) {
          await window.studioApi.agendamentos.reagendar(bkAgendamentoId, dt.toISOString());
          bkConfirm.textContent = 'REAGENDADO COM SUCESSO ✓';
        } else {
          await window.studioApi.agendamentos.criar(bkService.id, dt.toISOString());
          bkConfirm.textContent = 'AGENDAMENTO CONFIRMADO ✓';
        }
        setTimeout(() => {
          closeBooking();
          // Se estiver na página de agendamentos, recarrega os dados
          if (typeof window.carregarAgendamentos === 'function') {
            window.carregarAgendamentos();
          }
        }, 1400);
      } catch (err) {
        bkConfirm.textContent = isReschedule ? BK_CONFIRM_REAG : BK_CONFIRM_NOVO;
        bkConfirm.disabled    = false;
        bkConfirm.classList.remove('opacity-40', 'cursor-not-allowed');
        setError(err.message || 'Não foi possível confirmar. Tente novamente.');
      }
    });

    /* ── Fechar ── */
    bkCloseBtn.addEventListener('click', closeBooking);
    bkBackBtn.addEventListener('click', closeBooking);
    bkOverlay.addEventListener('click', e => { if (e.target === bkOverlay) closeBooking(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && bkOpen) closeBooking(); });

    window.openBooking = openBooking;
  }

  /* ══════════════════════════════════════════
     MODAL DE LOGIN — comportamentos
  ══════════════════════════════════════════ */
  function initLoginBehavior() {
    const overlay    = document.getElementById('modal-overlay');
    const modal      = document.getElementById('login-modal');
    if (!overlay) return;

    let isOpen = false;

    function openModal() {
      isOpen = true;
      overlay.removeAttribute('aria-hidden');
      overlay.classList.remove('overlay-leaving');
      overlay.classList.add('is-open', 'overlay-entering');
      modal.classList.remove('modal-leaving');
      modal.classList.add('modal-entering');
      document.body.style.overflow = 'hidden';
      const profileBtn = document.getElementById('profile-btn');
      if (profileBtn) profileBtn.setAttribute('aria-expanded', 'true');
    }

    function closeModal() {
      if (!isOpen) return;
      isOpen = false;
      modal.classList.remove('modal-entering');
      modal.classList.add('modal-leaving');
      overlay.classList.remove('overlay-entering', 'is-open');
      overlay.classList.add('overlay-leaving');
      document.body.style.overflow = '';
      const profileBtn = document.getElementById('profile-btn');
      if (profileBtn) profileBtn.setAttribute('aria-expanded', 'false');
      setTimeout(() => {
        overlay.classList.remove('overlay-leaving');
        overlay.setAttribute('aria-hidden', 'true');
        modal.classList.remove('modal-leaving');
        setModalMsg('', '');
      }, 280);
    }

    function setModalMsg(msg, tipo) {
      const el = document.getElementById('modal-msg');
      if (!el) return;
      if (!msg) { el.classList.add('hidden'); el.textContent = ''; return; }
      el.textContent = msg;
      el.classList.remove('hidden', 'text-red-400', 'text-green-400', 'bg-red-500/10', 'bg-green-500/10');
      if (tipo === 'erro') {
        el.classList.add('text-red-400', 'bg-red-500/10');
      } else {
        el.classList.add('text-green-400', 'bg-green-500/10');
      }
    }

    function setSubmitLoading(btnId, loading, defaultText) {
      const btn = document.getElementById(btnId);
      if (!btn) return;
      btn.disabled = loading;
      btn.textContent = loading ? 'AGUARDE…' : defaultText;
    }

    // Abre o modal ao clicar no botão do header (somente quando não logado)
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('#profile-btn');
      if (!btn) return;
      if (typeof window.studioApi !== 'undefined' && window.studioApi.auth.isAutenticado()) return;
      isOpen ? closeModal() : openModal();
    });

    document.getElementById('modal-close-btn').addEventListener('click', closeModal);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen) closeModal(); });

    /* Tabs login / cadastro */
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
        btn.classList.add('active');
        document.getElementById('tab-' + btn.dataset.tab).classList.remove('hidden');
        setModalMsg('', '');
      });
    });

    /* Toggle senha */
    document.querySelectorAll('.eye-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = document.getElementById(btn.dataset.target);
        const hide  = input.type === 'password';
        input.type  = hide ? 'text' : 'password';
        btn.innerHTML = hide
          ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="1.35"
               stroke-linecap="round" stroke-linejoin="round">
               <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
               <circle cx="12" cy="12" r="3"/>
             </svg>`
          : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="1.35"
               stroke-linecap="round" stroke-linejoin="round">
               <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
               <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
               <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
               <line x1="2" x2="22" y1="2" y2="22"/>
             </svg>`;
      });
    });

    /* Submit — Login */
    document.getElementById('tab-login').addEventListener('submit', async (e) => {
      e.preventDefault();
      if (typeof window.studioApi === 'undefined') return;
      const email = document.getElementById('login-email').value.trim();
      const senha = document.getElementById('login-password').value;
      if (!email || !senha) { setModalMsg('Preencha e-mail e senha.', 'erro'); return; }
      setSubmitLoading('login-submit', true, 'ENTRAR');
      setModalMsg('', '');
      try {
        await window.studioApi.auth.login(email, senha);
        setModalMsg('Login realizado com sucesso!', 'ok');
        setTimeout(() => {
          closeModal();
          renderHeaderAuth();
          if (typeof window.syncDashboardAgendadosGate === 'function') window.syncDashboardAgendadosGate();
        }, 800);
      } catch (err) {
        setModalMsg(err.message, 'erro');
      } finally {
        setSubmitLoading('login-submit', false, 'ENTRAR');
      }
    });

    /* Submit — Cadastro */
    document.getElementById('tab-register').addEventListener('submit', async (e) => {
      e.preventDefault();
      if (typeof window.studioApi === 'undefined') return;
      const nome = document.getElementById('reg-name').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const telefone = document.getElementById('reg-phone').value.trim();
      const senha = document.getElementById('reg-password').value;
      if (!nome || !email || !senha || !telefone) {
        setModalMsg('Preencha nome, e-mail, telefone e senha.', 'erro');
        return;
      }
      if (senha.length < 8) { setModalMsg('A senha deve ter ao menos 8 caracteres.', 'erro'); return; }
      setSubmitLoading('reg-submit', true, 'CRIAR CONTA');
      setModalMsg('', '');
      try {
        await window.studioApi.auth.registrar(nome, email, senha, telefone);
        setModalMsg('Conta criada com sucesso!', 'ok');
        setTimeout(() => {
          closeModal();
          renderHeaderAuth();
          if (typeof window.syncDashboardAgendadosGate === 'function') window.syncDashboardAgendadosGate();
        }, 800);
      } catch (err) {
        setModalMsg(err.message, 'erro');
      } finally {
        setSubmitLoading('reg-submit', false, 'CRIAR CONTA');
      }
    });

    window.__studioEleganceUi = { openLogin: openModal, closeLogin: closeModal };
  }

  /**
   * Home (index): tile "Agendados" sem sessão não navega (href #, captura de clique,
   * bloqueio de clique do meio); abre login. Com sessão, link normal para agendamentos.
   */
  function initDashboardAgendadosGate() {
    const tile = document.getElementById('dashboard-tile-agendados');
    if (!tile) return;

    const DEST = './agendamentos.html';
    const badge = document.getElementById('dashboard-agendados-lock-badge');
    const hint = document.getElementById('dashboard-agendados-login-hint');

    function isAuthed() {
      return typeof window.studioApi !== 'undefined'
        && window.studioApi.auth
        && window.studioApi.auth.isAutenticado();
    }

    function syncDashboardAgendadosGate() {
      if (isAuthed()) {
        tile.setAttribute('href', DEST);
        tile.classList.remove('nav-tile--locked');
        tile.removeAttribute('aria-disabled');
        tile.removeAttribute('aria-describedby');
        tile.removeAttribute('data-locked');
        if (badge) {
          badge.setAttribute('hidden', '');
          badge.classList.add('opacity-0');
        }
        if (hint) hint.setAttribute('hidden', '');
      } else {
        tile.setAttribute('href', '#');
        tile.classList.add('nav-tile--locked');
        tile.setAttribute('aria-disabled', 'true');
        tile.setAttribute('data-locked', '1');
        if (hint) {
          hint.removeAttribute('hidden');
          tile.setAttribute('aria-describedby', 'dashboard-agendados-login-hint');
        }
        if (badge) {
          badge.removeAttribute('hidden');
          badge.classList.remove('opacity-0');
        }
      }
      if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [tile] });
    }

    tile.addEventListener('click', (e) => {
      if (isAuthed()) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      window.__studioEleganceUi?.openLogin();
    }, true);

    tile.addEventListener('auxclick', (e) => {
      if (isAuthed()) return;
      if (e.button === 1) e.preventDefault();
    }, true);

    tile.addEventListener('keydown', (e) => {
      if (isAuthed()) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.__studioEleganceUi?.openLogin();
      }
    });

    window.syncDashboardAgendadosGate = syncDashboardAgendadosGate;
    syncDashboardAgendadosGate();
  }

  /* ══════════════════════════════════════════
     API PÚBLICA
  ══════════════════════════════════════════ */
  window.initPage = function () {
    injectLoginModal();
    injectHeader();
    injectBookingModal();
    if (typeof lucide !== 'undefined') lucide.createIcons();
    renderHeaderAuth();
    initLoginBehavior();
    initDashboardAgendadosGate();
    initBookingBehavior();
  };
})();
