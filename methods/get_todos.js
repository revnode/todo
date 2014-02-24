var fs		= require('fs'),
	swagger = require('swagger-node-express');

module.exports = {
	spec:
	{
		description:	'Performs a lookup on the user data provided and returns todos.',
		notes:			'Performs a lookup on the user data provided and returns todos.',
		path:			'/api/' + GLOBAL.version + '/todos',
		summary:		'Fetch Todos',
		method:			'GET',
		responseClass:	'todos',
		params:
		[
			// name, description, dataType, required, allowMultiple, allowableValues, defaultValue
			swagger.params.query(
				'user',
				'The user name to use for fetching todos.',
				'string',
				true
			),
			swagger.params.query(
				'token',
				'The token to use for fetching todos.',
				'string',
				true
			)
		],
		errorResponses:
		[
			swagger.errors.invalid('user'),
			swagger.errors.invalid('token'),
			swagger.errors.notFound('user'),
			swagger.errors.notFound('token')
		],
		nickname:		'get_todos'
	},
	action:	function(req, res)
	{
		if(!req.query.user)
		{
			return res.send(swagger.errors.invalid('user'));
		}
		if(!fs.existsSync(__dirname + '/../data/' + req.query.user))
		{
			return res.send(swagger.errors.notFound('user'));
		}
		if(!req.query.token)
		{
			return res.send(swagger.errors.invalid('token'));
		}
		if(!fs.existsSync(__dirname + '/../data/' + req.query.user + '/' + req.query.token))
		{
			return res.send(swagger.errors.notFound('token'));
		}
		
		return res.send({
			entity: 'todos',
			method:	'GET',
			todos:	JSON.parse(fs.readFileSync(
				__dirname + '/../data/' + req.query.user + '/' + req.query.token + '/primary.json',
				'utf8'
			))
		});
	}
};