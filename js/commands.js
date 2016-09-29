// imprimir os comandos na tela
socket.on('help', function() {
  printAsChatConsole("/clear - Limpar a Tela");
  printAsChatConsole("/time - Imprimir Data e hora");
  printAsChatConsole("/users - Usuarios online");
  printAsChatConsole("/roll - jogar um dado");
  bottom();
});

// limpar tela
socket.on('clear', function(data) {
	$('.chat__text-field').html("");
});

// mostrar data e hora
socket.on('get time', function(data) {
	printAsChatConsole(data.name + ", a data é: " + getFullTimestamp());
	bottom();
});

// mostrar usuarios online
socket.on('get users', function(data) {
	printAsChatConsole(data.list.length.toString() + " usuarios online");
	printAsChatConsole(data.list);
	bottom();
});

// jogar um dado
socket.on('roll', function(data) {
	var dice = Math.floor(Math.random() * 6) + 1;
	printAsChatConsole(data.name + " jogou o " + dice.toString());
	bottom();
});
