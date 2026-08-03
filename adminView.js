module.exports = function renderAdminView(leads = [], ganhador = null, erro = null, msg = null) {
    let alertas = '';
    
    if (erro) {
        alertas += `
            <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r shadow-sm flex justify-between items-center" role="alert">
                <div>
                    <p class="font-bold">Atenção</p>
                    <p>${erro}</p>
                </div>
                <button onclick="this.parentElement.remove()" class="text-red-700 font-bold text-xl">&times;</button>
            </div>`;
    }
    
    if (msg) {
        alertas += `
            <div class="bg-emerald-100 border-l-4 border-emerald-500 text-emerald-700 p-4 mb-6 rounded-r shadow-sm flex justify-between items-center" role="alert">
                <div>
                    <p class="font-bold">Sucesso</p>
                    <p>${msg}</p>
                </div>
                <button onclick="this.parentElement.remove()" class="text-emerald-700 font-bold text-xl">&times;</button>
            </div>`;
    }

    // Preparando os dados para a animação no JavaScript do front-end
    const nomesLeads = leads.map(l => l.nome);
    const leadsJson = JSON.stringify(nomesLeads.length > 0 ? nomesLeads : ['Nenhuma pizzaria']);
    const ganhadorJson = ganhador ? JSON.stringify(ganhador) : 'null';

    // Renderizando as linhas da tabela (Com botão de excluir, fotos de perfil, etc.)
    const linhasTabela = leads.map(lead => `
        <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors group">
            <td class="py-3 px-6 text-left whitespace-nowrap flex items-center gap-3">
                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(lead.nome)}&background=10b981&color=fff&rounded=true" alt="Foto de perfil de ${lead.nome}" class="w-8 h-8 rounded-full shadow-sm">
                <div class="font-medium text-gray-800">${lead.nome}</div>
            </td>
            <td class="py-3 px-6 text-left">
                <a href="https://instagram.com/${lead.instagram}" target="_blank" class="text-emerald-600 hover:text-emerald-800 font-medium">
                    @${lead.instagram}
                </a>
            </td>
            <td class="py-3 px-6 text-center">
                <form action="/admin/excluir" method="POST" class="inline" onsubmit="return confirm('Tem certeza que deseja excluir permanentemente a pizzaria ${lead.nome}? Essa ação não pode ser desfeita.');">
                    <input type="hidden" name="id" value="${lead.id}">
                    <button type="submit" class="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50" title="Excluir Pizzaria">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </form>
            </td>
        </tr>
    `).join('');

    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Painel Admin - Sorteio Ecocaixas</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            .backdrop-blur-md {
                backdrop-filter: blur(8px);
            }
            @keyframes popIn {
                0% { transform: scale(0.8); opacity: 0; }
                50% { transform: scale(1.1); opacity: 1; }
                100% { transform: scale(1); opacity: 1; }
            }
            .animate-pop {
                animation: popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            }
            
            /* KEYFRAMES PARA A EXPLOSÃO DO NOME */
            @keyframes explodeFall {
                0% {
                    transform: translate(-50%, -50%) scale(0.1) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(var(--scale)) rotate(var(--rot));
                    opacity: 1;
                }
                100% {
                    transform: translate(calc(-50% + var(--tx) * 1.5), 120vh) scale(var(--scale)) rotate(var(--rotEnd));
                    opacity: 0;
                }
            }
            
            .particle-name {
                position: fixed;
                top: 50%;
                left: 50%;
                pointer-events: none;
                z-index: 99999;
                font-weight: 900;
                white-space: nowrap;
                text-shadow: 0px 4px 10px rgba(0,0,0,0.3);
                /* Animação com ease-in para simular gravidade (acelera na queda) */
                animation: explodeFall cubic-bezier(0.3, 0, 0.8, 0.15) forwards;
            }
        </style>
    </head>
    <body class="bg-gray-50 font-sans text-gray-800 min-h-screen">

        <!-- Navbar -->
        <nav class="bg-emerald-600 text-white shadow-md p-4">
            <div class="container mx-auto flex justify-between items-center">
                <h1 class="text-xl font-bold flex items-center gap-2">
                    📦 Sorteio Ecocaixas
                </h1>
                <span class="text-sm bg-emerald-700 px-3 py-1 rounded-full border border-emerald-500">
                    Total: ${leads.length} Pizzarias
                </span>
            </div>
        </nav>

        <div class="container mx-auto p-6 max-w-5xl mt-4">
            ${alertas}

            <!-- Card de Ação -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 text-center">
                <h2 class="text-2xl font-bold text-gray-800 mb-2">Realizar Sorteio</h2>
                <p class="text-gray-500 mb-6">O sistema escolherá aleatoriamente uma das pizzarias cadastradas.</p>
                
                <form action="/admin/sortear" method="POST">
                    <button type="submit" class="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-4 px-10 rounded-full shadow-lg transform transition-transform active:scale-95 text-lg">
                        🎲 Sortear Ganhador Agora
                    </button>
                </form>
            </div>

            <!-- Tabela de Leads -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="bg-gray-50 border-b border-gray-100 px-6 py-4">
                    <h3 class="font-bold text-gray-700 text-lg">Pizzarias Participantes</h3>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full w-full table-auto">
                        <thead>
                            <tr class="bg-gray-100 text-gray-600 uppercase text-xs leading-normal">
                                <th class="py-3 px-6 text-left">Pizzaria</th>
                                <th class="py-3 px-6 text-left">Instagram</th>
                                <th class="py-3 px-6 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody class="text-gray-600 text-sm font-light">
                            ${linhasTabela || `
                                <tr>
                                    <td colspan="3" class="py-8 text-center text-gray-400 font-medium">
                                        Nenhuma pizzaria cadastrada ainda.
                                    </td>
                                </tr>
                            `}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- MODAL DE SORTEIO -->
        <div id="modalSorteio" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-md hidden">
            <div id="modalContent" class="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 text-center transform scale-95 transition-transform duration-300">
                
                <div id="faseEmbaralhando" class="py-10">
                    <div class="text-emerald-500 mb-4 animate-spin inline-block">
                        <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                    </div>
                    <h3 class="text-xl text-gray-500 font-medium mb-2">Sorteando...</h3>
                    <div id="nomeRoleta" class="text-3xl font-bold text-gray-800 h-10 truncate px-4"></div>
                </div>

                <div id="faseGanhador" class="hidden">
                    <div class="text-6xl mb-2">🎉</div>
                    <h3 class="text-emerald-600 font-black text-2xl uppercase tracking-wider mb-1">Temos um vencedor!</h3>
                    
                    <div class="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 my-6 shadow-inner">
                        <p class="text-sm text-gray-500 mb-1">A pizzaria ganhadora é:</p>
                        <h2 id="nomeGanhadorFinal" class="text-3xl font-bold text-gray-900 mb-2 truncate"></h2>
                        <a id="instaGanhadorFinal" href="#" target="_blank" class="inline-block bg-white text-emerald-600 font-bold py-2 px-4 rounded-lg shadow-sm border border-emerald-200 hover:bg-emerald-50 transition-colors">
                            @instagram
                        </a>
                    </div>
                    
                    <div class="bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold text-xl py-3 px-4 rounded-xl mb-6 shadow-md animate-pulse">
                        🎁 Ganhou 100 Caixas!
                    </div>

                    <div class="text-left bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
                        <p class="text-xs text-red-500 font-bold mt-2">
                            ⚠️ Ação obrigatória: Clique no Instagram acima e verifique se a pizzaria segue a @ecocaixasba.
                        </p>
                    </div>

                    <button onclick="fecharModal()" class="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-xl transition-colors relative z-10">
                        Fechar
                    </button>
                </div>
            </div>
        </div>

        <script>
            // Recebendo os dados do Node.js
            const leadsParticipantes = ${leadsJson};
            const ganhador = ${ganhadorJson};

            if (ganhador) {
                iniciarAnimacaoSorteio();
            }

            function iniciarAnimacaoSorteio() {
                const modal = document.getElementById('modalSorteio');
                const modalContent = document.getElementById('modalContent');
                const faseEmbaralhando = document.getElementById('faseEmbaralhando');
                const faseGanhador = document.getElementById('faseGanhador');
                const nomeRoleta = document.getElementById('nomeRoleta');
                
                modal.classList.remove('hidden');
                setTimeout(() => modalContent.classList.remove('scale-95'), 50);

                let tempoEmbaralhando = 0;
                const tempoTotal = 3000;
                const intervaloTroca = 80;

                const roleta = setInterval(() => {
                    const nomeAleatorio = leadsParticipantes[Math.floor(Math.random() * leadsParticipantes.length)];
                    nomeRoleta.textContent = nomeAleatorio;
                    tempoEmbaralhando += intervaloTroca;

                    if (tempoEmbaralhando >= tempoTotal) {
                        clearInterval(roleta);
                        revelarGanhador();
                    }
                }, intervaloTroca);
            }

            // FUNÇÃO PARA CRIAR A EXPLOSÃO DE NOMES
            function explodirNomeVencedor(nome) {
                // Cores vibrantes combinando com a paleta
                const cores = ['#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#ffffff'];
                const quantidade = 70; // Quantidade de nomes explodindo

                for (let i = 0; i < quantidade; i++) {
                    const particula = document.createElement('div');
                    particula.textContent = nome;
                    particula.className = 'particle-name';
                    
                    // Cálculo de física da explosão (radial)
                    const angulo = Math.random() * Math.PI * 2;
                    // Velocidade da explosão inicial
                    const velocidade = 100 + Math.random() * 600; 
                    
                    const tx = Math.cos(angulo) * velocidade + 'px';
                    // Subtração no eixo Y dá um impulso extra para cima no início
                    const ty = Math.sin(angulo) * velocidade - (Math.random() * 300) + 'px'; 
                    
                    const rot = (Math.random() * 360) + 'deg';
                    const rotEnd = (Math.random() * 1080 - 540) + 'deg'; // Rotaciona bastante durante a queda
                    
                    const duration = 2.5 + Math.random() * 2.5; // Duração entre 2.5s e 5s
                    const scale = 0.5 + Math.random() * 1.5; // Variação de tamanho
                    
                    particula.style.setProperty('--tx', tx);
                    particula.style.setProperty('--ty', ty);
                    particula.style.setProperty('--rot', rot);
                    particula.style.setProperty('--rotEnd', rotEnd);
                    particula.style.setProperty('--scale', scale);
                    particula.style.animationDuration = duration + 's';
                    
                    particula.style.fontSize = (12 + Math.random() * 20) + 'px';
                    particula.style.color = cores[Math.floor(Math.random() * cores.length)];
                    
                    document.body.appendChild(particula);
                    
                    // Remove do DOM após a animação
                    setTimeout(() => particula.remove(), duration * 1000);
                }
            }

            function revelarGanhador() {
                const faseEmbaralhando = document.getElementById('faseEmbaralhando');
                const faseGanhador = document.getElementById('faseGanhador');
                
                faseEmbaralhando.classList.add('hidden');
                faseGanhador.classList.remove('hidden');
                faseGanhador.classList.add('animate-pop');

                document.getElementById('nomeGanhadorFinal').textContent = ganhador.nome;
                
                if(document.getElementById('telGanhadorFinal')){
                    document.getElementById('telGanhadorFinal').textContent = ganhador.telefone;
                }
                
                const btnInsta = document.getElementById('instaGanhadorFinal');
                btnInsta.textContent = '@' + ganhador.instagram;
                btnInsta.href = 'https://instagram.com/' + ganhador.instagram;

                // Dispara o efeito visual espetacular
                explodirNomeVencedor(ganhador.nome);
            }

            function fecharModal() {
                const modal = document.getElementById('modalSorteio');
                modal.classList.add('hidden');
                window.history.replaceState({}, document.title, "/admin");
                
                // Limpa quaisquer partículas remanescentes se o modal for fechado rápido
                document.querySelectorAll('.particle-name').forEach(p => p.remove());
            }
        </script>
    </body>
    </html>
    `;
};