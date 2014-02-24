var fs		= require('fs'),
	crypto	= require('crypto'),
	swagger = require('swagger-node-express');

module.exports = {
	spec:
	{
		description:	'Performs a lookup on the user data provided and returns a token for existing users.',
		notes:			'Performs a lookup on the user data provided and returns a token for existing users.',
		path:			'/api/' + GLOBAL.version + '/token',
		summary:		'Fetch Token',
		method:			'GET',
		responseClass:	'token',
		params:
		[
			// name, description, dataType, required, allowMultiple, allowableValues, defaultValue
			swagger.params.query(
				'user',
				'The user name to use for token generation.',
				'string',
				true
			),
			swagger.params.query(
				'password',
				'The password to use for token generation.',
				'string',
				true
			)
		],
		errorResponses:
		[
			swagger.errors.invalid('user'),
			swagger.errors.invalid('password'),
			swagger.errors.notFound('user')
		],
		nickname:		'get_token'
	},
	action:	function(req, res)
	{
		if(!req.query.user)
		{
			return res.send(swagger.errors.invalid('user'));
		}
		if(!req.query.password)
		{
			return res.send(swagger.errors.invalid('password'));
		}
		if(!fs.existsSync(__dirname + '/../data/' + req.query.user))
		{
			return res.send(swagger.errors.notFound('user'));
		}
		
		var token = crypto.createHash('sha512').update(
			req.query.user + req.query.password
		).digest('hex');
		
		if(!fs.existsSync(__dirname + '/../data/' + req.query.user + '/' + token))
		{
			return res.send(swagger.errors.invalid('password'));
		}
		
		return res.send({
			entity: 'token',
			method:	'GET',
			user:	req.query.user,
			token:	token
		});
	}
};