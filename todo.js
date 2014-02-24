/*
	Could you write me a todo list management web application where:
	 - As complementary to the last item, one should be able to create users in the system via an interface,
	   probably a signup/register screen.
	 - I can have my todo list displayed.
	 - I can manipulate my list (add/remove/modify entries).
	 - Assign priorities and due dates to the entries.
	 - I can sort my entry lists using due date and priority.
	 - I can mark an entry as completed.
	 - Minimal UI/UX design is needed.
	 - I need every client operation done using JavaScript, reloading the page is not an option.
	 - Write a RESTful API which will allow a third-party application to trigger actions on your app (same actions available on the webpage).
	 - You need to be able to pass credentials to both the webpage and the API.

	http://expressjs.com/api.html
	https://github.com/wordnik/swagger-node-express
*/

GLOBAL.version	= 1;

var os			= require('os'),
	express		= require('express'),
	url			= require('url'),
	fs			= require('fs'),
	swagger		= require('swagger-node-express'),
	models		= {},
	app			= express(),
	port		= 8080,
	host		= 'http://vpc:' + port;

app.use(express.json());
app.use(express.urlencoded());

swagger.setHeaders = function setHeaders(res)
{
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	res.header('Content-Type', 'application/json; charset=utf-8');
};

swagger.setAppHandler(app);

fs.readdirSync(__dirname + '/models').forEach(function(model)
{
	models[model.split('.')[0]] = require('./models/' + model);
});
swagger.addModels(models);

fs.readdirSync(__dirname + '/methods').forEach(function(method)
{
	var verb = method.split('_')[0];
	swagger['add' + verb.charAt(0).toUpperCase() + verb.slice(1)](require('./methods/' + method));
});

app.use('/', express.static(__dirname + '/todo-ui/'));
app.use('/docs/' + GLOBAL.version + '/', express.static(__dirname + '/swagger-ui/'));

swagger.configureSwaggerPaths('', '/spec/' + GLOBAL.version, '');
swagger.configure(host, GLOBAL.version + '.0');

app.listen(port);
console.log('Todo Server started on port ' + port + '.');

process
	.on('SIGINT', function()
	{
		console.log('Shutting down Todo Server.');
		process.exit(0);
	})
	.on('uncaughtException', function(err)
	{
		console.log('Exception: ' + err.stack);
	});