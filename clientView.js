module.exports = function renderClientView(msg = null, erro = null) {
    let alertas = '';
    
    if (msg) {
        alertas = `
            <div class="fixed top-4 left-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl shadow-lg z-50 flex justify-between" role="alert">
                <span class="block sm:inline font-medium">${msg}</span>
                <button onclick="this.parentElement.remove()" class="text-green-700 font-bold">&times;</button>
            </div>`;
    }
    if (erro) {
        alertas = `
            <div class="fixed top-4 left-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl shadow-lg z-50 flex justify-between" role="alert">
                <span class="block sm:inline font-medium">${erro}</span>
                <button onclick="this.parentElement.remove()" class="text-red-700 font-bold">&times;</button>
            </div>`;
    }

    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>Sorteio - Ecocaixas</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            /* Animações suaves para o Wizard */
            .step-container {
                position: relative;
                overflow: hidden;
            }
            .step {
                transition: all 0.4s ease-in-out;
                width: 100%;
            }
            .step-hidden {
                opacity: 0;
                transform: translateX(100%);
                position: absolute;
                top: 0;
                pointer-events: none;
                visibility: hidden;
            }
            .step-active {
                opacity: 1;
                transform: translateX(0);
                position: relative;
                visibility: visible;
            }
            /* Fundo moderno com gradiente sutil */
            body {
                background: linear-gradient(135deg, #f6fff8 0%, #eaf4f4 100%);
            }
        </style>
    </head>
    <body class="min-h-screen flex flex-col items-center justify-center p-4 antialiased text-gray-800">
        
        ${alertas}

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

            <!-- Formulário Wizard -->
            <form action="/cadastrar" method="POST" id="wizardForm" class="step-container">
                
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
                        <input type="text" name="instagram" placeholder="suapizzaria" required class="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all">
                    </div>

                    <div class="flex gap-2">
                        <button type="button" onclick="goToStep(2)" class="w-1/3 bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition-all">Voltar</button>
                        <button type="submit" class="w-2/3 bg-emerald-500 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-emerald-600 active:scale-95 transition-all">
                            Finalizar Cadastro
                        </button>
                    </div>
                    
                    <p class="text-xs text-gray-400 mt-4 px-2">
                        Atenção: desclassificaremos automaticamente se a conta não estiver seguindo @ecocaixasba no dia do sorteio.
                    </p>
                </div>

            </form>
        </div>

        <script>
            // Lógica do Wizard
            function goToStep(step) {
                // Esconde todos
                document.querySelectorAll('.step').forEach(el => {
                    el.classList.remove('step-active');
                    el.classList.add('step-hidden');
                });
                
                // Mostra o atual
                const currentStep = document.getElementById('step-' + step);
                currentStep.classList.remove('step-hidden');
                currentStep.classList.add('step-active');
                
                // Atualiza as bolinhas (dots)
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

            // Libera o botão de avançar no Passo 1 após clicar no link
            function liberarPasso2() {
                const btn = document.getElementById('btnIrPasso2');
                btn.disabled = false;
                btn.classList.remove('bg-gray-100', 'text-gray-400', 'cursor-not-allowed');
                btn.classList.add('bg-emerald-500', 'text-white', 'shadow-lg', 'hover:bg-emerald-600');
            }

            // Validação simples do Passo 2 antes de ir para o Passo 3
            function validarPasso2() {
                const nome = document.getElementById('inputNome').value.trim();
                const contato = document.getElementById('inputContato').value.trim();
                
                if(!nome || !contato) {
                    alert('Por favor, preencha o nome da pizzaria e o contato.');
                    return;
                }
                goToStep(3);
            }
        </script>
    </body>
    </html>
    `;
};