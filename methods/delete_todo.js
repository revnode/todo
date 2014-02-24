var fs		= require('fs'),
	swagger = require('swagger-node-express');

module.exports = {
	spec:
	{
		description:	'Deletes a todo entry.',
		notes:			'Deletes a todo entry.',
		path:			'/api/' + GLOBAL.version + '/todo',
		summary:		'Delete Todo',
		method:			'DELETE',
		responseClass:	'todo',
		params:
		[
			// name, description, dataType, required, allowMultiple, allowableValues, defaultValue
			swagger.params.body(
				'user',
				'The user name to use for identifying the todo collection.',
				'string',
				true
			),
			swagger.params.body(
				'token',
				'The token to use for identifying the todo collection.',
				'string',
				true
			),
			swagger.params.body(
				'id',
				'The id of the todo to delete.',
				'string',
				true
			)
		],
		errorResponses:
		[
			swagger.errors.invalid('user'),
			swagger.errors.invalid('token'),
			swagger.errors.invalid('id'),
			swagger.errors.notFound('user'),
			swagger.errors.notFound('token'),
			swagger.errors.notFound('id')
		],
		nickname:		'delete_todo'
	},
	action:	function(req, res)
	{
		if(!req.body.user)
		{
			return res.send(swagger.errors.invalid('user'));
		}
		if(!fs.existsSync(__dirname + '/../data/' + req.body.user))
		{
			return res.send(swagger.errors.notFound('user'));
		}
		if(!req.body.token)
		{
			return res.send(swagger.errors.invalid('token'));
		}
		if(!fs.existsSync(__dirname + '/../data/' + req.body.user + '/' + req.body.token))
		{
			return res.send(swagger.errors.notFound('token'));
		}
		
		var todos = JSON.parse(fs.readFileSync(
			__dirname + '/../data/' + req.body.user + '/' + req.body.token + '/primary.json',
			'utf8'
		));
		
		if(!req.body.id)
		{
			return res.send(swagger.errors.invalid('id'));
		}
		if(!todos[req.body.id])
		{
			return res.send(swagger.errors.notFound('id'));
		}
		
		var todo = todos[req.body.id];
		
		delete todos[req.body.id];
		
		fs.writeFileSync(
			__dirname + '/../data/' + req.body.user + '/' + req.body.token + '/primary.json',
			JSON.stringify(todos)
		);
		
		todo.entity = 'todo';
		todo.method = 'DELETE';
		todo.id		= req.body.id;
		
		return res.send(todo);
	}
};