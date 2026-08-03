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

    const nomesLeads = leads.map(l => l.nome);
    const leadsJson = JSON.stringify(nomesLeads.length > 0 ? nomesLeads : ['Nenhuma pizzaria']);
    const ganhadorJson = ganhador ? JSON.stringify(ganhador) : 'null';

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
                <button type="button" onclick="abrirModalExclusao(${lead.id}, '${lead.nome.replace(/'/g, "\\'")}')" class="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50" title="Excluir Pizzaria">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                </button>
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
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;700;900&display=swap" rel="stylesheet">
        
        <style>
            .backdrop-blur-md { backdrop-filter: blur(8px); }
            
            @keyframes popIn {
                0% { transform: scale(0.8); opacity: 0; }
                50% { transform: scale(1.1); opacity: 1; }
                100% { transform: scale(1); opacity: 1; }
            }
            .animate-pop { animation: popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }

            /* Efeito Shake com Intervalo para o nome do Vencedor */
            @keyframes shakeInterval {
                0%, 15%, 100% { transform: translateX(0) rotate(0deg); }
                2%, 6%, 10% { transform: translateX(-4px) rotate(-2deg); }
                4%, 8%, 12% { transform: translateX(4px) rotate(2deg); }
            }
            .animate-shake-interval {
                animation: shakeInterval 4s ease-in-out infinite;
                display: inline-block;
            }

            /* Animação do Texto Preparatório (Fade e Scale) */
            @keyframes fadeTextIn {
                0% { opacity: 0; transform: scale(0.8); }
                20% { opacity: 1; transform: scale(1.05); }
                30% { transform: scale(1); }
                80% { opacity: 1; transform: scale(1); }
                100% { opacity: 0; transform: scale(1.2); }
            }
            .animate-fade-text {
                animation: fadeTextIn 1.5s ease-in-out forwards;
            }
            
            /* CAÇA-NÍQUEL */
            .slot-board {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 6px;
                padding: 20px 16px;
                background: #f8fafc;
                border-radius: 12px;
                border: 3px solid #e2e8f0;
                box-shadow: inset 0 4px 6px rgba(0,0,0,0.05);
            }
            .letter-window {
                height: 72px; 
                width: 52px;  
                overflow: hidden;
                position: relative;
                background: #ffffff;
                border-radius: 8px;
                box-shadow: inset 0 3px 6px rgba(0,0,0,0.1);
                border: 1px solid #cbd5e1;
            }
            .letter-window::before, .letter-window::after {
                content: '';
                position: absolute;
                left: 0;
                right: 0;
                height: 12px;
                z-index: 10;
                pointer-events: none;
            }
            .letter-window::before { top: 0; background: linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%); }
            .letter-window::after { bottom: 0; background: linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%); }
            
            .letter-window.space {
                background: transparent;
                box-shadow: none;
                border: none;
                width: 20px; 
            }
            .letter-window.space::before, .letter-window.space::after { display: none; }
            
            .letter-track {
                display: flex;
                flex-direction: column;
            }
            .letter-item {
                height: 72px; 
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2.5rem; 
                font-weight: 700;
                color: #1f2937;
                font-family: 'Poppins', sans-serif;
                text-transform: uppercase;
            }

            /* EXPLOSÃO DE ADESIVOS */
            @keyframes explodeFall {
                0% { transform: translate(-50%, -50%) scale(0.1) rotate(0deg); opacity: 0; }
                10% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(var(--scale)) rotate(var(--rot)); opacity: 1; }
                100% { transform: translate(calc(-50% + var(--tx) * 1.5), 120vh) scale(var(--scale)) rotate(var(--rotEnd)); opacity: 0; }
            }
            
            .particle-name {
                position: fixed;
                top: 50%;
                left: 50%;
                pointer-events: none;
                z-index: 99999;
                white-space: nowrap;
                font-family: 'Poppins', sans-serif;
                font-weight: 500;
                background-color: #ffffff !important;
                padding: 8px 20px;
                border-radius: 12px;
                box-shadow: 0 8px 15px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.08);
                border: 2px solid #f1f5f9;
                animation: explodeFall cubic-bezier(0.3, 0, 0.8, 0.15) forwards;
            }
        </style>
    </head>
    <body class="bg-gray-50 font-sans text-gray-800 min-h-screen">

        <nav class="bg-emerald-600 text-white shadow-md p-4">
            <div class="container mx-auto flex justify-between items-center">
                <h1 class="text-xl font-bold flex items-center gap-3">
                    <img src="/img/eco.png" alt="Logo Ecocaixas" class="h-8 w-auto object-contain drop-shadow-md">
                    Sorteio Ecocaixas
                </h1>
                <span class="text-sm bg-emerald-700 px-3 py-1 rounded-full border border-emerald-500">
                    Total: ${leads.length} Pizzarias
                </span>
            </div>
        </nav>

        <div class="container mx-auto p-6 max-w-5xl mt-4">
            ${alertas}

            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 text-center">
                <h2 class="text-2xl font-bold text-gray-800 mb-2">Realizar Sorteio</h2>
                <p class="text-gray-500 mb-6">O sistema escolherá aleatoriamente uma das pizzarias cadastradas.</p>
                
                <form action="/admin/sortear" method="POST">
                    <button type="submit" class="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-4 px-10 rounded-full shadow-lg transform transition-transform active:scale-95 text-lg">
                        🎲 Sortear Ganhador Agora
                    </button>
                </form>
            </div>

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

        <!-- MODAL DE EXCLUSÃO -->
        <div id="modalExclusao" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm hidden opacity-0 transition-opacity duration-300">
            <div id="modalExclusaoContent" class="bg-white rounded-3xl shadow-2xl p-6 max-w-sm w-full mx-4 text-center transform scale-95 transition-transform duration-300">
                <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </div>
                <h3 class="text-xl font-bold text-gray-800 mb-2">Excluir Participante</h3>
                <p class="text-gray-500 mb-6 text-sm">Tem certeza que deseja excluir a pizzaria <strong id="nomePizzariaExcluir" class="text-gray-800"></strong>? Esta ação não pode ser desfeita.</p>
                
                <form action="/admin/excluir" method="POST" class="flex gap-2">
                    <input type="hidden" name="id" id="inputIdExcluir">
                    <button type="button" onclick="fecharModalExclusao()" class="w-1/2 bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition-all">Cancelar</button>
                    <button type="submit" class="w-1/2 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 shadow-lg active:scale-95 transition-all">Excluir</button>
                </form>
            </div>
        </div>

        <!-- MODAL DE SORTEIO COM FUNDO ESCURO E DESFOCADO PARA CONTRASTE MÁXIMO -->
        <div id="modalSorteio" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-md hidden">
            
            <!-- Fase 1: Textos Animados (Gigantes, claros e com sombra pesada) -->
            <div id="fasePreparacao" class="hidden absolute inset-0 items-center justify-center pointer-events-none z-50">
                <h2 id="textoAnimado" class="text-6xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300 uppercase tracking-widest opacity-0 drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] text-center px-4" style="font-family: 'Poppins', sans-serif;"></h2>
            </div>

            <!-- Fases 2 e 3: O Container Branco Reduzido (max-w-3xl) -->
            <div id="modalContent" class="hidden bg-white rounded-3xl shadow-2xl p-8 max-w-3xl w-full mx-4 text-center transform scale-95 transition-transform duration-300">
                
                <!-- Fase 2: Caça-Níquel -->
                <div id="faseEmbaralhando" class="py-8 hidden">
                    <h3 class="text-xl text-gray-500 font-bold mb-6 uppercase tracking-widest text-emerald-500 animate-pulse">Sorteando...</h3>
                    
                    <div id="slotBoard" class="slot-board mx-auto">
                        <!-- Janelas das letras injetadas aqui -->
                    </div>
                </div>

                <!-- Fase 3: Ganhador -->
                <div id="faseGanhador" class="hidden">
                    <div class="text-6xl mb-4">🎉</div>
                    <h3 class="text-emerald-600 font-black text-2xl uppercase tracking-wider mb-2">Vencedor</h3>
                    
                    <div class="bg-gray-50 border border-gray-100 rounded-2xl p-6 my-6 shadow-inner">
                        <p class="text-sm text-gray-500 mb-2">A pizzaria ganhadora é:</p>
                        
                        <div class="animate-shake-interval">
                            <h2 id="nomeGanhadorFinal" class="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-600 drop-shadow-sm mb-6 break-words" style="font-family: 'Poppins', sans-serif;"></h2>
                        </div>
                        <br>
                        
                        <a id="instaGanhadorFinal" href="#" target="_blank" class="inline-block bg-white text-emerald-600 font-bold py-3 px-6 rounded-xl shadow-md border border-emerald-200 hover:bg-emerald-50 hover:shadow-lg transition-all transform hover:-translate-y-1 text-lg">
                            @instagram
                        </a>
                    </div>
                    
                    <div class="bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold text-xl py-3 px-4 rounded-xl mb-6 shadow-md animate-pulse">
                        🎁 Ganhou 100 Caixas!
                    </div>

                    <button onclick="fecharModalSorteio()" class="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 rounded-xl transition-colors relative z-10 text-lg">
                        Fechar
                    </button>
                </div>
            </div>
        </div>

        <script>
            const leadsParticipantes = ${leadsJson};
            const ganhador = ${ganhadorJson};

            // MODAL DE EXCLUSÃO
            function abrirModalExclusao(id, nome) {
                document.getElementById('inputIdExcluir').value = id;
                document.getElementById('nomePizzariaExcluir').textContent = nome;
                
                const modal = document.getElementById('modalExclusao');
                const content = document.getElementById('modalExclusaoContent');
                
                modal.classList.remove('hidden');
                setTimeout(() => {
                    modal.classList.remove('opacity-0');
                    content.classList.remove('scale-95');
                }, 10);
            }

            function fecharModalExclusao() {
                const modal = document.getElementById('modalExclusao');
                const content = document.getElementById('modalExclusaoContent');
                
                modal.classList.add('opacity-0');
                content.classList.add('scale-95');
                
                setTimeout(() => {
                    modal.classList.add('hidden');
                }, 300);
            }

            // LÓGICA DO SORTEIO
            if (ganhador) {
                iniciarFluxoSorteio();
            }

            function iniciarFluxoSorteio() {
                const modal = document.getElementById('modalSorteio');
                const modalContent = document.getElementById('modalContent');
                const fasePreparacao = document.getElementById('fasePreparacao');
                const textoAnimado = document.getElementById('textoAnimado');
                
                modal.classList.remove('hidden');
                fasePreparacao.classList.remove('hidden');
                fasePreparacao.classList.add('flex'); 
                
                modalContent.classList.add('hidden');

                const textos = ["A sua pizzaria", "Pode ser", "A vencedora!", "Boa sorte!"];
                let indexTexto = 0;

                function animarProximoTexto() {
                    if (indexTexto < textos.length) {
                        textoAnimado.textContent = textos[indexTexto];
                        // Reseta a animação
                        textoAnimado.classList.remove('animate-fade-text');
                        void textoAnimado.offsetWidth; 
                        textoAnimado.classList.add('animate-fade-text');
                        
                        indexTexto++;
                        setTimeout(animarProximoTexto, 1500); // 1.5s por texto
                    } else {
                        // Fim da preparação
                        fasePreparacao.classList.add('hidden');
                        fasePreparacao.classList.remove('flex');
                        
                        modalContent.classList.remove('hidden');
                        setTimeout(() => modalContent.classList.remove('scale-95'), 50);
                        
                        iniciarAnimacaoRoleta();
                    }
                }
                
                setTimeout(animarProximoTexto, 400);
            }

            function iniciarAnimacaoRoleta() {
                const faseEmbaralhando = document.getElementById('faseEmbaralhando');
                const slotBoard = document.getElementById('slotBoard');
                
                faseEmbaralhando.classList.remove('hidden');
                slotBoard.innerHTML = ''; 
                
                const nomeGanhador = ganhador.nome.toUpperCase();
                const caracteresNome = nomeGanhador.split('');
                const alfabetoEspeciais = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#*";
                const alturaDoItem = 72; 
                
                let tempoMaximoDeEspera = 0;

                caracteresNome.forEach((char, index) => {
                    const windowEl = document.createElement('div');
                    
                    if (char === ' ') {
                        windowEl.className = 'letter-window space';
                        slotBoard.appendChild(windowEl);
                        return;
                    }

                    windowEl.className = 'letter-window';
                    const track = document.createElement('div');
                    track.className = 'letter-track';
                    
                    const totalItensRoleta = 60 + (index * 12); 
                    
                    for (let i = 0; i < totalItensRoleta; i++) {
                        const item = document.createElement('div');
                        item.className = 'letter-item';
                        
                        if (i === totalItensRoleta - 1) {
                            item.textContent = char;
                            item.classList.add('text-emerald-600');
                        } else {
                            item.textContent = alfabetoEspeciais[Math.floor(Math.random() * alfabetoEspeciais.length)];
                        }
                        track.appendChild(item);
                    }
                    
                    windowEl.appendChild(track);
                    slotBoard.appendChild(windowEl);

                    const duracaoEmSegundos = 5.0 + (index * 0.6);
                    if (duracaoEmSegundos > tempoMaximoDeEspera) {
                        tempoMaximoDeEspera = duracaoEmSegundos;
                    }

                    setTimeout(() => {
                        track.style.transition = \`transform \${duracaoEmSegundos}s cubic-bezier(0.1, 0.85, 0.25, 1)\`;
                        const targetY = -(totalItensRoleta - 1) * alturaDoItem;
                        track.style.transform = \`translateY(\${targetY}px)\`;
                    }, 100);
                });

                setTimeout(() => {
                    revelarGanhador();
                }, (tempoMaximoDeEspera * 1000) + 600);
            }

            function explodirNomeVencedor(nome) {
                const cores = ['#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6', '#ef4444'];
                const quantidade = 70; 

                for (let i = 0; i < quantidade; i++) {
                    const particula = document.createElement('div');
                    particula.textContent = nome;
                    particula.className = 'particle-name';
                    
                    const angulo = Math.random() * Math.PI * 2;
                    const velocidade = 150 + Math.random() * 800; 
                    
                    const tx = Math.cos(angulo) * velocidade + 'px';
                    const ty = Math.sin(angulo) * velocidade - (Math.random() * 500) + 'px'; 
                    
                    const rot = (Math.random() * 360) + 'deg';
                    const rotEnd = (Math.random() * 1080 - 540) + 'deg'; 
                    
                    const duration = 2.5 + Math.random() * 4; 
                    const scale = 0.5 + Math.random() * 1.5; 
                    
                    particula.style.setProperty('--tx', tx);
                    particula.style.setProperty('--ty', ty);
                    particula.style.setProperty('--rot', rot);
                    particula.style.setProperty('--rotEnd', rotEnd);
                    particula.style.setProperty('--scale', scale);
                    particula.style.animationDuration = duration + 's';
                    
                    particula.style.fontSize = (16 + Math.random() * 18) + 'px';
                    particula.style.color = cores[Math.floor(Math.random() * cores.length)];
                    particula.style.border = '2px solid ' + particula.style.color;
                    
                    document.body.appendChild(particula);
                    
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
                
                const btnInsta = document.getElementById('instaGanhadorFinal');
                btnInsta.textContent = '@' + ganhador.instagram;
                btnInsta.href = 'https://instagram.com/' + ganhador.instagram;

                explodirNomeVencedor(ganhador.nome);
            }

            function fecharModalSorteio() {
                const modal = document.getElementById('modalSorteio');
                modal.classList.add('hidden');
                window.history.replaceState({}, document.title, "/admin");
                document.querySelectorAll('.particle-name').forEach(p => p.remove());
            }
        </script>
    </body>
    </html>
    `;
};