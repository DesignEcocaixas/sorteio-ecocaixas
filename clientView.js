module.exports = function renderClientView() {
    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>Sorteio - Ecocaixas</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            .step-container { position: relative; overflow: hidden; }
            .step { transition: all 0.4s ease-in-out; width: 100%; }
            .step-hidden { opacity: 0; transform: translateX(100%); position: absolute; top: 0; pointer-events: none; visibility: hidden; }
            .step-active { opacity: 1; transform: translateX(0); position: relative; visibility: visible; }
            body { background: linear-gradient(135deg, #f6fff8 0%, #eaf4f4 100%); }
            .backdrop-blur-sm { backdrop-filter: blur(4px); }
        </style>
    </head>
    <body class="min-h-screen flex flex-col items-center justify-center p-4 antialiased text-gray-800">
        
        <!-- Card Principal -->
        <div class="w-full max-w-sm bg-white rounded-3xl shadow-xl p-6 relative overflow-hidden">
            
            <!-- Logo -->
            <div class="text-center mb-6 pt-2">
                <img src="/img/eco.png" alt="Ecocaixas" class="h-16 mx-auto object-contain">
            </div>

            <!-- Indicador de Passos (Dots) -->
            <div class="flex justify-center gap-2 mb-8">
                <div id="dot-1" class="w-8 h-2 rounded-full bg-emerald-500 transition-colors duration-300"></div>
                <div id="dot-2" class="w-8 h-2 rounded-full bg-gray-200 transition-colors duration-300"></div>
                <div id="dot-3" class="w-8 h-2 rounded-full bg-gray-200 transition-colors duration-300"></div>
            </div>

            <!-- Formulário Wizard (Agora sem action, controlado pelo JS) -->
            <form id="wizardForm" class="step-container" onsubmit="enviarFormulario(event)">
                
                <!-- PASSO 1: Seguir Instagram -->
                <div id="step-1" class="step step-active text-center">
                    <h2 class="text-xl font-bold mb-2 text-gray-800">Regra de Ouro 🏆</h2>
                    <p class="text-sm text-gray-500 mb-6">Para participar do sorteio, sua pizzaria precisa seguir nosso Instagram oficial.</p>
                    
                    <a href="https://instagram.com/ecocaixasba" target="_blank" onclick="liberarPasso2()" class="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform active:scale-95 transition-all mb-4">
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                        Seguir @ecocaixasba
                    </a>

                    <button type="button" id="btnIrPasso2" disabled onclick="goToStep(2)" class="w-full bg-gray-100 text-gray-400 font-bold py-3 px-4 rounded-xl transition-all cursor-not-allowed">
                        Já segui, avançar
                    </button>
                </div>

                <!-- PASSO 2: Dados da Pizzaria -->
                <div id="step-2" class="step step-hidden text-left">
                    <h2 class="text-xl font-bold mb-1 text-gray-800">Sobre sua Pizzaria 🍕</h2>
                    <p class="text-sm text-gray-500 mb-5">Onde vamos entregar as caixas se você ganhar?</p>

                    <div class="mb-4">
                        <label class="block text-sm font-bold text-gray-700 mb-1">Nome da Pizzaria</label>
                        <input type="text" name="nome" id="inputNome" placeholder="Ex: Pizza'vilha" class="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all">
                    </div>

                    <div class="mb-6">
                        <label class="block text-sm font-bold text-gray-700 mb-1">Contato (WhatsApp)</label>
                        <input type="tel" name="telefone" id="inputContato" placeholder="(00) 00000-0000" class="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all">
                    </div>

                    <div class="flex gap-2">
                        <button type="button" onclick="goToStep(1)" class="w-1/3 bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition-all">Voltar</button>
                        <button type="button" onclick="validarPasso2()" class="w-2/3 bg-emerald-500 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-emerald-600 active:scale-95 transition-all">Avançar</button>
                    </div>
                </div>

                <!-- PASSO 3: Validação do Insta -->
                <div id="step-3" class="step step-hidden text-center">
                    <h2 class="text-xl font-bold mb-1 text-gray-800">Último passo! 🚀</h2>
                    <p class="text-sm text-gray-500 mb-5">Qual o Instagram da pizzaria? Usaremos isso para validar o sorteio.</p>

                    <div class="mb-6 text-left relative">
                        <span class="absolute left-4 top-3.5 text-gray-400 font-bold">@</span>
                        <input type="text" name="instagram" id="inputInstagram" placeholder="suapizzaria" required class="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all">
                    </div>

                    <div class="flex gap-2">
                        <button type="button" onclick="goToStep(2)" class="w-1/3 bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition-all">Voltar</button>
                        <button type="submit" id="btnSubmit" class="w-2/3 bg-emerald-500 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-emerald-600 active:scale-95 transition-all flex justify-center items-center">
                            <span>Finalizar Cadastro</span>
                        </button>
                    </div>
                    
                    <p class="text-xs text-gray-400 mt-4 px-2">
                        Atenção: desclassificaremos automaticamente se a conta não estiver seguindo @ecocaixasba no dia do sorteio.
                    </p>
                </div>
            </form>
        </div>

        <!-- MODAIS -->

        <!-- Modal de Sucesso -->
        <div id="modalSucesso" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm hidden opacity-0 transition-opacity duration-300">
            <div class="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center transform scale-95 transition-transform duration-300" id="modalSucessoContent">
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h3 class="text-2xl font-bold text-gray-800 mb-2">Sucesso!</h3>
                <p id="msgSucessoText" class="text-gray-500 mb-6">Cadastro realizado com sucesso. Boa sorte no sorteio!</p>
                <button onclick="fecharModal('modalSucesso')" class="w-full bg-green-500 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-green-600 active:scale-95 transition-all">
                    Entendido
                </button>
            </div>
        </div>

        <!-- Modal de Erro -->
        <div id="modalErro" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm hidden opacity-0 transition-opacity duration-300">
            <div class="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center transform scale-95 transition-transform duration-300" id="modalErroContent">
                <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                </div>
                <h3 class="text-2xl font-bold text-gray-800 mb-2">Ops!</h3>
                <p id="msgErroText" class="text-gray-500 mb-6">Ocorreu um erro ao processar seu cadastro.</p>
                <button onclick="fecharModal('modalErro')" class="w-full bg-red-500 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-red-600 active:scale-95 transition-all">
                    Tentar Novamente
                </button>
            </div>
        </div>

        <script>
            // Lógica do Wizard
            function goToStep(step) {
                document.querySelectorAll('.step').forEach(el => {
                    el.classList.remove('step-active');
                    el.classList.add('step-hidden');
                });
                
                const currentStep = document.getElementById('step-' + step);
                currentStep.classList.remove('step-hidden');
                currentStep.classList.add('step-active');
                
                for(let i = 1; i <= 3; i++) {
                    const dot = document.getElementById('dot-' + i);
                    if(i <= step) {
                        dot.classList.remove('bg-gray-200');
                        dot.classList.add('bg-emerald-500');
                    } else {
                        dot.classList.remove('bg-emerald-500');
                        dot.classList.add('bg-gray-200');
                    }
                }
            }

            function liberarPasso2() {
                const btn = document.getElementById('btnIrPasso2');
                btn.disabled = false;
                btn.classList.remove('bg-gray-100', 'text-gray-400', 'cursor-not-allowed');
                btn.classList.add('bg-emerald-500', 'text-white', 'shadow-lg', 'hover:bg-emerald-600');
            }

            function validarPasso2() {
                const nome = document.getElementById('inputNome').value.trim();
                const contato = document.getElementById('inputContato').value.trim();
                
                if(!nome || !contato) {
                    abrirModalErro('Por favor, preencha o nome da pizzaria e o contato.');
                    return;
                }
                goToStep(3);
            }

            // Funções dos Modais
            function abrirModalSucesso(mensagem) {
                document.getElementById('msgSucessoText').textContent = mensagem;
                const modal = document.getElementById('modalSucesso');
                const content = document.getElementById('modalSucessoContent');
                
                modal.classList.remove('hidden');
                setTimeout(() => {
                    modal.classList.remove('opacity-0');
                    content.classList.remove('scale-95');
                }, 10);
            }

            function abrirModalErro(mensagem) {
                document.getElementById('msgErroText').textContent = mensagem;
                const modal = document.getElementById('modalErro');
                const content = document.getElementById('modalErroContent');
                
                modal.classList.remove('hidden');
                setTimeout(() => {
                    modal.classList.remove('opacity-0');
                    content.classList.remove('scale-95');
                }, 10);
            }

            function fecharModal(idModal) {
                const modal = document.getElementById(idModal);
                const content = document.getElementById(idModal + 'Content');
                
                modal.classList.add('opacity-0');
                content.classList.add('scale-95');
                
                setTimeout(() => {
                    modal.classList.add('hidden');
                }, 300);
            }

            // Lógica de Envio via AJAX (Evita o carregamento da página)
            async function enviarFormulario(event) {
                event.preventDefault(); // Impede o redirecionamento
                
                const btn = document.getElementById('btnSubmit');
                const spanBtn = btn.querySelector('span');
                const textoOriginal = spanBtn.textContent;
                
                // Estado de carregamento no botão
                btn.disabled = true;
                spanBtn.innerHTML = '<svg class="animate-spin h-5 w-5 mr-3 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Enviando...';

                // Capturando os dados
                const data = {
                    nome: document.getElementById('inputNome').value.trim(),
                    telefone: document.getElementById('inputContato').value.trim(),
                    instagram: document.getElementById('inputInstagram').value.trim()
                };

                try {
                    // ATENÇÃO: Verifique se sua rota da API de cadastro é /api/cadastrar
                    const response = await fetch('/api/cadastrar', { 
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });

                    const result = await response.json();

                    if (response.ok || response.status === 201) {
                        abrirModalSucesso(result.message || 'Sua pizzaria está cadastrada no sorteio! Lembre-se de não deixar de seguir a @ecocaixasba.');
                        document.getElementById('wizardForm').reset(); // Limpa os campos
                        goToStep(1); // Volta para o passo inicial
                    } else {
                        abrirModalErro(result.error || 'Este Instagram já foi cadastrado ou ocorreu um erro.');
                    }
                } catch (error) {
                    abrirModalErro('Erro de conexão com o servidor. Verifique sua internet.');
                } finally {
                    // Restaura o botão
                    btn.disabled = false;
                    spanBtn.textContent = textoOriginal;
                }
            }
        </script>
    </body>
    </html>
    `;
};