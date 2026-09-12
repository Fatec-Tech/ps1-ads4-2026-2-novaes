const pacientes = [];
 
const formulario = document.getElementById('form-paciente');
const tabela = document.getElementById('tabela-pacientes');
const tabelaWrapper = document.getElementById('tabela-wrapper');
const mensagemCarregando = document.getElementById('carregando');
const mensagemErro = document.getElementById('mensagem-erro');
const mensagemListaVazia = document.getElementById('lista-vazia');
const contadorOrigem = document.getElementById('contador-origem');
 
// Cada paciente guarda sua origem: 'json' (arquivo) ou 'manual' (cadastro na sessão)
function adicionarPaciente(nome, email, nascimento, origem = 'manual') {
	pacientes.push({ nome, email, nascimento, origem });
}
 
function renderizarTabela() {
	tabela.innerHTML = '';
 
	// Tratamento de lista vazia: some com a tabela e mostra a mensagem
	if (pacientes.length === 0) {
		tabelaWrapper.classList.add('d-none');
		mensagemListaVazia.classList.remove('d-none');
		atualizarContador();
		return;
	}
 
	tabelaWrapper.classList.remove('d-none');
	mensagemListaVazia.classList.add('d-none');
 
	pacientes.forEach((paciente) => {
		const linha = document.createElement('tr');
		linha.innerHTML = `
      <td>${paciente.nome}</td>
      <td>${paciente.email}</td>
      <td>${formatarData(paciente.nascimento)}</td>
    `;
		tabela.appendChild(linha);
	});
 
	atualizarContador();
}
 
function formatarData(dataISO) {
	const [ano, mes, dia] = dataISO.split('-');
	return `${dia}/${mes}/${ano}`;
}
 
// Contador por origem: quantos vieram do JSON vs cadastrados manualmente
function atualizarContador() {
	const totalJson = pacientes.filter((p) => p.origem === 'json').length;
	const totalManual = pacientes.filter((p) => p.origem === 'manual').length;
 
	contadorOrigem.textContent = `Pacientes do arquivo JSON: ${totalJson} | Cadastrados manualmente: ${totalManual}`;
	contadorOrigem.classList.remove('d-none');
}
 
// Simula uma latência de rede antes de disparar o fetch
function aguardar(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
 
// Busca os pacientes iniciais a partir do arquivo JSON
async function carregarPacientesIniciais() {
	// Garante que a mensagem de carregando esteja visível no início da função
	mensagemCarregando.classList.remove('d-none');
	mensagemErro.classList.add('d-none');
 
	console.log('[latência] início da espera:', new Date().toLocaleTimeString());
 
	try {
		// Simulação de latência: espera 1s ANTES do fetch, com "Carregando pacientes..." na tela
		await aguardar(1000);
 
		console.log('[latência] fim da espera, iniciando fetch:', new Date().toLocaleTimeString());
 
		const resposta = await fetch('data/pacientes.json');
 
		// Nem toda resposta é sucesso — precisamos checar antes de usar
		if (!resposta.ok) {
			throw new Error(`Erro HTTP: ${resposta.status}`);
		}
 
		const dados = await resposta.json(); // converte a resposta em objeto JS
 
		// Adiciona cada paciente vindo do arquivo ao array local, marcando a origem
		dados.forEach((paciente) => {
			adicionarPaciente(paciente.nome, paciente.email, paciente.nascimento, 'json');
		});
 
		renderizarTabela();
		mensagemCarregando.classList.add('d-none');
	} catch (erro) {
		console.error('Não foi possível carregar os pacientes:', erro);
 
		// Tratamento de erro amigável: feedback visual na interface, não só no console
		mensagemCarregando.classList.add('d-none');
		mensagemErro.textContent =
			'Não foi possível carregar os pacientes. Tente novamente mais tarde.';
		mensagemErro.classList.remove('d-none');
 
		// Mesmo com erro no carregamento inicial, renderiza o que já existe (lista vazia, se for o caso)
		renderizarTabela();
	}
}
 
formulario.addEventListener('submit', (event) => {
	event.preventDefault();
 
	const nome = document.getElementById('nome').value;
	const email = document.getElementById('email').value;
	const nascimento = document.getElementById('nascimento').value;
 
	adicionarPaciente(nome, email, nascimento, 'manual');
	renderizarTabela();
 
	formulario.reset();
});
 
// Assim que o script carrega, já dispara a busca dos dados iniciais
carregarPacientesIniciais();