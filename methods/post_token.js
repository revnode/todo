var fs		= require('fs'),
	crypto	= require('crypto'),
	swagger = require('swagger-node-express');

module.exports = {
	spec:
	{
		description:	'Creates a user entry for the user data provided and returns a token.',
		notes:			'Creates a user entry for the user data provided and returns a token.',
		path:			'/api/' + GLOBAL.version + '/token',
		summary:		'Create Token',
		method:			'POST',
		responseClass:	'token',
		params:
		[
			// name, description, dataType, required, allowMultiple, allowableValues, defaultValue
			swagger.params.body(
				'user',
				'The user name to use for token generation.',
				'string',
				true
			),
			swagger.params.body(
				'password',
				'The password to use for token generation.',
				'string',
				true
			)
		],
		errorResponses:
		[
			swagger.errors.invalid('user'),
			swagger.errors.invalid('password')
		],
		nickname:		'post_token'
	},
	action:	function(req, res)
	{
		if(!req.body.user)
		{
			return res.send(swagger.errors.invalid('user'));
		}
		if(!req.body.password)
		{
			return res.send(swagger.errors.invalid('password'));
		}
		if(fs.existsSync(__dirname + '/../data/' + req.body.user))
		{
			return res.send(swagger.errors.invalid('user'));
		}
		
		var token = crypto.createHash('sha512').update(
			req.body.user + req.body.password
		).digest('hex');
		
		fs.mkdirSync(__dirname + '/../data/' + req.body.user);
		fs.mkdirSync(__dirname + '/../data/' + req.body.user + '/' + token);
		fs.writeFileSync(
			__dirname + '/../data/' + req.body.user + '/' + token + '/primary.json',
			'{}'
		);
		
		return res.send({
			entity: 'token',
			method:	'POST',
			user:	req.body.user,
			token:	token
		});
	}
};