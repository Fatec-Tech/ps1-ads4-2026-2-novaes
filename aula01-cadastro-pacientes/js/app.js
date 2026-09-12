// Array que guarda os pacientes cadastrados (em memória, só nesta sessão)
let pacientes = [];
let ordemAscendente = true;
 
// Referências aos elementos do DOM
const formulario = document.getElementById('form-paciente');
const tabela = document.getElementById('tabela-pacientes');
const totalPacientes = document.getElementById('total-pacientes');
const campoBusca = document.getElementById('busca-nome');
const cabecalhoNome = document.getElementById('th-nome');
 
// Calcula a idade a partir da data de nascimento
function calcularIdade(dataNascimento) {
	const hoje = new Date();
	const nascimento = new Date(dataNascimento + 'T00:00:00');
 
	let idade = hoje.getFullYear() - nascimento.getFullYear();
 
	const mesAtual = hoje.getMonth();
	const mesNascimento = nascimento.getMonth();
 
	if (
		mesAtual < mesNascimento ||
		(mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())
	) {
		idade--;
	}
 
	return idade;
}
 
// Formata data ISO (aaaa-mm-dd) para dd/mm/aaaa
function formatarData(dataISO) {
	const [ano, mes, dia] = dataISO.split('-');
	return `${dia}/${mes}/${ano}`;
}
 

 
function salvarNoStorage() {
	localStorage.setItem('pacientes', JSON.stringify(pacientes));
}
 
function carregarDoStorage() {
	const dados = localStorage.getItem('pacientes');
	pacientes = dados ? JSON.parse(dados) : [];
}
 

 
function emailJaExiste(email) {
	return pacientes.some((p) => p.email.toLowerCase() === email.toLowerCase());
}
 
function adicionarPaciente(nome, email, nascimento, telefone) {
	if (emailJaExiste(email)) {
		alert('Já existe um paciente cadastrado com este e-mail!');
		return false;
	}
 
	const novoPaciente = {
		id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
		nome,
		email,
		nascimento,
		telefone,
		idade: calcularIdade(nascimento),
	};
 
	pacientes.push(novoPaciente);
	salvarNoStorage();
	return true;
}
 

 
function removerPaciente(id) {
	pacientes = pacientes.filter((p) => p.id !== id);
	salvarNoStorage();
	renderizarTabela(filtrarPacientes(campoBusca.value));
}
 

 
function filtrarPacientes(termo) {
	const termoBusca = termo.trim().toLowerCase();
	if (!termoBusca) return pacientes;
	return pacientes.filter((p) => p.nome.toLowerCase().includes(termoBusca));
}
 

 
function renderizarTabela(lista = pacientes) {
	tabela.innerHTML = '';
 
	lista.forEach((paciente) => {
		const linha = document.createElement('tr');
 
		linha.innerHTML = `
			<td>${paciente.nome}</td>
			<td>${paciente.email}</td>
			<td>${formatarData(paciente.nascimento)}</td>
			<td>${paciente.telefone}</td>
			<td>${paciente.idade} anos</td>
			<td><button type="button" class="btn btn-danger btn-sm">Remover</button></td>
		`;
 
		linha.querySelector('button').addEventListener('click', () => removerPaciente(paciente.id));
 
		tabela.appendChild(linha);
	});
 
	// O total sempre reflete todos os pacientes cadastrados, mesmo com busca ativa
	totalPacientes.textContent = pacientes.length;
}
 

 
formulario.addEventListener('submit', (event) => {
	event.preventDefault();
 
	const nome = document.getElementById('nome').value;
	const email = document.getElementById('email').value;
	const nascimento = document.getElementById('nascimento').value;
	const telefone = document.getElementById('telefone').value;
 
	const sucesso = adicionarPaciente(nome, email, nascimento, telefone);
 
	if (sucesso) {
		formulario.reset();
		renderizarTabela(filtrarPacientes(campoBusca.value));
	}
});
 
campoBusca.addEventListener('input', () => {
	renderizarTabela(filtrarPacientes(campoBusca.value));
});
 
cabecalhoNome.addEventListener('click', () => {
	pacientes.sort((a, b) => {
		const comparacao = a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' });
		return ordemAscendente ? comparacao : -comparacao;
	});
	ordemAscendente = !ordemAscendente;
 
	salvarNoStorage();
	renderizarTabela(filtrarPacientes(campoBusca.value));
});
 

 
carregarDoStorage();
renderizarTabela();
