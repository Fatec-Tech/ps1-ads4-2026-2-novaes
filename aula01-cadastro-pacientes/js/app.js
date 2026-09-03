// Array que guarda os pacientes cadastrados (em memória, só nesta sessão)
const pacientes = [];

// Referências aos elementos do DOM que vamos usar várias vezes
const formulario = document.getElementById('form-paciente');
const tabela = document.getElementById('tabela-pacientes');

// Função responsável por calcular a idade
function calcularIdade(dataNascimento) {
	const hoje = new Date();
	const nascimento = new Date(dataNascimento + 'T00:00:00');

	let idade = hoje.getFullYear() - nascimento.getFullYear();

	const mesAtual = hoje.getMonth();
	const mesNascimento = nascimento.getMonth();

	// Verifica se a pessoa ainda não fez aniversário neste ano
	if (mesAtual < mesNascimento ||
		(mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())
	) {
		idade--;
	}

	return idade;
}

function renderizarTabela() {
	tabela.innerHTML = '';

	pacientes.forEach((paciente) => {
		const linha = document.createElement('tr');

		linha.innerHTML = `
			<td>${paciente.nome}</td>
			<td>${paciente.email}</td>
			<td>${formatarData(paciente.nascimento)}</td>
			<td>${paciente.telefone}</td>
			<td>${paciente.idade} anos</td>
		`;

		tabela.appendChild(linha);
	});

	// Atualiza o total de pacientes
	totalPacientes.textContent = pacientes.length;
}
// Função responsável por adicionar um paciente ao array
function adicionarPaciente(nome, email, nascimento, telefone) {
	const novoPaciente = { nome, email, nascimento, telefone, idade: calcularIdade(nascimento) 

	};
	pacientes.push(novoPaciente);
}

// Função responsável por desenhar a tabela inteira a partir do array
function renderizarTabela() {
	tabela.innerHTML = ''; // limpa a tabela antes de redesenhar

	pacientes.forEach((paciente) => {
		const linha = document.createElement('tr');

		linha.innerHTML = `
      <td>${paciente.nome}</td>
      <td>${paciente.email}</td>
      <td>${formatarData(paciente.nascimento)}</td>
	  <td>${paciente.telefone}</td>
	  <td>${paciente.idade} anos</td>
		<button class="btn btn-danger btn-sm" onclick="removerPaciente(${pacientes.indexOf(paciente)})">Remover</button>
    `;

		tabela.appendChild(linha);
	});
	totalPacientes.textContent = pacientes.length;
}

function removerPaciente(indice) {
	pacientes.splice(indice, 1);

	renderizarTabela();

}

// Função utilitária só para formatar a data no padrão dd/mm/aaaa
function formatarData(dataISO) {
	const [ano, mes, dia] = dataISO.split('-');
	return `${dia}/${mes}/${ano}`;
}

// Evento disparado quando o formulário é enviado
formulario.addEventListener('submit', (event) => {
	event.preventDefault(); // evita o recarregamento da página

	const nome = document.getElementById('nome').value;
	const email = document.getElementById('email').value;
	const nascimento = document.getElementById('nascimento').value;
	const telefone = document.getElementById('telefone').value;
	const formulario = document.getElementById('form-paciente');
	const tabela = document.getElementById('tabela-pacientes');
	const totalPacientes = document.getElementById('total-pacientes');

	adicionarPaciente(nome, email, nascimento,telefone);			
	renderizarTabela();
	
	
});
