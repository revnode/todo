var pages_login = {
	
	'public render_login':			function()
	{
		r.inject(
			this.dom.form = form({
					c:['table', 'box', 'align_center'],
					e:
					{
						submit: this.event_submit_login.bind(this)
					}
				},
				div({c:['column', 'title']}, 'Please Login'),
				this.dom.message = div({c:['column', 'message']}),
				div({c:['column', 'body']},
					input({
						type:			'text',
						name:			'user',
						placeholder:	'Username'
					}),
					span('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'),
					input({
						type:			'password',
						name:			'password',
						placeholder:	'Password'
					}),
					br, br,
					button({
							type:'submit',
							name:'submit'
						},
						'Login'
					),
					br, br,
					span('If you don\'t have an account, you can register '),
					span({c:'a', e:{click:this.render_register.bind(this)}}, 'here'),
					span('.')
				)
			),
			r._(this.dom.content)
		);
	},
	
	'public event_submit_login':		function(event)
	{
		event.preventDefault();
		r._(this.dom.message);
		
		var data = r.form.to(this.dom.form),
			flag = true;
		
		if(flag && !data.user)
		{
			this.render_error('Please enter a username!', 'error');
			flag = false;
		}
		if(flag && !/^[a-zA-Z_0-9]+$/.test(data.user))
		{
			this.render_error('The username must only have letters, numbers, or underscores!', 'error');
			flag = false;
		}
		
		if(flag && !data.password)
		{
			this.render_error('Please enter a password for the account!', 'error');
			flag = false;
		}
		if(flag && data.password.length < 4)
		{
			this.render_error('Please enter a password that is at least 4 characters!', 'error');
			flag = false;
		}
		
		if(flag)
		{
			r.xhr.rpc('token', 'GET', data, this.rpc, this);
		}
	}
	
};