var todo = r.singleton({
	
	use:
	[
		pages_login,
		pages_register,
		pages_todo
	],
	
	'private local':
	{
		token:						null,
		todos:						[],
		sort:
		{
			column:					'priority',
			order:					'ASC'
		}
	},
	
	'private dom':
	{
		content:					r.$('div#content'),
		form:						null,
		message:					null
	},
	
	'public initialize':			function()
	{
		this.render_login();
	},
	
	'public rpc':					function(response)
	{
		if(response.code)
		{
			this.render_error(response.reason, 'error');
		}
		else
		{
			switch(response.method + ' ' + response.entity)
			{
				case 'POST token':
				case 'GET token':
					this.local.user		= response.user;
					this.local.token	= response.token;
					
					r.xhr.rpc('todos', 'GET', {user:this.local.user, token:this.local.token}, this.rpc, this);
					break;
				
				case 'GET todos':
					this.local.todos	= response.todos;
					
					this.render_todo();
					break;
				
				case 'DELETE todo':
					delete this.local.todos[response.id];
					
					this.render_todo();
					break;
				
				case 'PUT todo':
				case 'POST todo':
					delete response.method;
					delete response.entity;
					
					var id = response.id;
					
					delete response.id;
					
					this.local.todos[id] = response;
					
					this.render_todo();
					break;
			}
		}
	},
	
	'private render_error':				function(message, type)
	{
		r.inject(
			div({c:['message', (type || 'info')]},
				div({c:'table'},
					div({c:'column_10'}, '&nbsp;'),
					div({c:'column_80'},
						message
					),
					div({c:['column_10', 'align_right']},
						a({
				            	c:['none', 'font_large', 'font_bold'],
				            	href:'#',
				            	e:
				            	{
				            		click: function(event)
				            		{
				            			event.preventDefault();
				            			r._(this.dom.message);
				            		}.bind(this)
				            	}
			            	},
			            	'×'
			            )
					)
				)
			),
			r._(this.dom.message)
		);
		return this;
	}
	
});