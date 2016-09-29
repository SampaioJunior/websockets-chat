var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var sanitize = require('sanitize-html');

http.listen("192.168.1.100",8080);

// Usado para criar um nome de socket único para o usuario
var id = 1;

// Array pra armazenar os usuarios
var users = [];

// rotas
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');

	app.use(express.static(__dirname + '/css'));
	app.use(express.static(__dirname + '/js'));
});

io.on('connection', function(socket) {
	// nome padrão do usuario
	socket.name = "guest" + id.toString();
	id++;
	users.push(socket.name);

	socket.emit('connection');
	io.emit('new connection', {name: socket.name});

	// enviar mensagem
	socket.on('message', function(data){
		data = sanitize(data);

		if (data.charAt(0) === '/') {
			getCommand(data, socket);
		} else {
			io.emit('message', {message: data, name: socket.name});
		}
	});

	// mudar o nome
  	socket.on('name change', function(data) {
  		data = sanitize(data);

  		// busca o usuario no array e altera o nome dele
  		for (var i in users) {
  			if (users[i] === socket.name) {
  				users[i] = data;
  			}
  			// evito que o nome seja um ja existente
  			else if (users[i] === data) {
  				return;
  			}
  		}

  		io.emit('name change', {previousName: socket.name, newName: data});
  		socket.name = data;
  	});

	// Fechando o socket/disconnect
	socket.on('disconnect', function(data) {
		// remove o nome do array
		for (var i in users) {
			if (users[i] === socket.name) {
				users.splice(1, i);
			}
		}

		io.emit('disconnect', {name: socket.name});
	});
});

// comandos do chat
function getCommand(data, socket) {
	switch(data) {
		// imprimir todos os comandos
		case "/help":
			io.emit('help');
			break;

		case "/clear":
			io.emit('clear');
			break;

		case "/time":
			io.emit('get time', {name: socket.name});
			break;

		case "/users":
			io.emit('get users', {list: users});
			break;

		case "/roll":
			io.emit('roll', {name: socket.name});
			break;

		default: return;
	}
}
