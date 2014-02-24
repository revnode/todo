var fs		= require('fs'),
	swagger = require('swagger-node-express'),
	moment	= require('moment');

module.exports = {
	spec:
	{
		description:	'Updates a todo entry.',
		notes:			'Updates a todo entry.',
		path:			'/api/' + GLOBAL.version + '/todo',
		summary:		'Update Todo',
		method:			'PUT',
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
				'The id of the todo to update.',
				'string',
				true
			),
			swagger.params.query(
				'state',
				'The state of the todo to update.',
				'string',
				true,
				false,
				'LIST[uncompleted,completed]',
				'uncompleted'
			),
			swagger.params.body(
				'priority',
				'The priority of the todo to update.',
				'integer'
			),
			swagger.params.body(
				'due',
				'The due date of the todo to update.',
				'date'
			),
			swagger.params.body(
				'text',
				'The text of the todo to update.',
				'string'
			)
		],
		errorResponses:
		[
			swagger.errors.invalid('user'),
			swagger.errors.invalid('token'),
			swagger.errors.invalid('id'),
			swagger.errors.invalid('state'),
			swagger.errors.invalid('priority'),
			swagger.errors.invalid('due'),
			swagger.errors.notFound('user'),
			swagger.errors.notFound('token'),
			swagger.errors.notFound('id')
		],
		nickname:		'put_todo'
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
		
		if(!req.body.state)
		{
			return res.send(swagger.errors.invalid('state'));
		}
		if(
			req.body.state != 'uncompleted'
			&&
			req.body.state != 'completed'
		)
		{
			return res.send(swagger.errors.invalid('state'));
		}
		
		if(req.body.priority && (req.body.priority < 1 || req.body.priority > 100))
		{
			return res.send(swagger.errors.invalid('priority'));
		}
		
		if(req.body.due && !moment(req.body.due).isValid())
		{
			return res.send(swagger.errors.invalid('due'));
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
		
		todos[req.body.id] = {
			"id":		req.body.id,
			"state":	req.body.state,
			"priority":	(req.body.priority || 1),
			"due":		(req.body.due || ''),
			"text":		(req.body.text || '')
		};
		
		fs.writeFileSync(
			__dirname + '/../data/' + req.body.user + '/' + req.body.token + '/primary.json',
			JSON.stringify(todos)
		);
		
		todos[req.body.id].entity	= 'todo';
		todos[req.body.id].method	= 'PUT';
		
		return res.send(todos[req.body.id]);
	}
};