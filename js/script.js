var socket = io();

//mudar o nick
$('#name-form').submit(function(e) {
	e.preventDefault();
	socket.emit('name change', $('.chat__name-field').val());
});

// enviar nova mensagem no chat
$('#input-form').submit(function(e) {
	e.preventDefault();
	socket.emit('message', $('.chat__input-field').val());
	$('.chat__input-field').val('');
});

// Imprimir Bem vindo ao conectar
socket.on('connection', function() {
	printAsChatConsole("Bem vindo ao websockets-chat");
	printAsChatConsole("Digite '/help' pra listar os comandos");
});

// mostrar novas conexões
socket.on('new connection', function(data) {
	printAsChatConsole(data.name + " se juntou ao chat");
	bottom();
});

// mostrar o chat com as mensagens
socket.on('message', function(data) {
	$('.chat__text-field').append('<div class="message"><span class="message__timestamp">' + getShortTimestamp() + ' ~ ' + '</span>' + '<b>' + data.name + '</b>: ' + data.message + '</div>');
	bottom();
});

// mostrar mudança dos nomes
socket.on('name change', function(data) {
	printAsChatConsole(data.previousName + " mudou seu nome para: " + data.newName);
	bottom();
});

// mostrar quando usuario se desconectar
socket.on('disconnect', function(data) {
	printAsChatConsole(data.name + " deixou o chat");
	bottom();
});

// hora no formato HH:MM
function getShortTimestamp() {
	var date = new Date();
	var hour = ('0' + date.getUTCHours().toString()).slice(-2);
	var minute = ('0' + date.getUTCMinutes().toString()).slice(-2);
	return hour + ":" + minute;
}

// data no formato MM/DD/YYYY HH:MM
function getFullTimestamp() {
	var date = new Date();
	var month = ('0' + date.getMonth().toString()).slice(-2);
	var day = ('0' + date.getDate().toString()).slice(-2);
	var year = date.getFullYear();
	return month + "/" + day + "/" + year + " " + getShortTimestamp();
}

// enviar novas mensagens ao chat
// como um bate-papo
function printAsChatConsole(text) {
	$('.chat__text-field').append('<div class="message"><span class="message__timestamp">' + getShortTimestamp() + ' # ' + '</span>' + '<em>' + text + "</em></div>");
}

// permitir rolagem da pagina
function bottom() {
	window.scrollTo(0,document.body.scrollHeight);
}
