var pages_register = {
	
	'public render_register':		function()
	{
		r.inject(
			this.dom.form = form({
					c:['table', 'box', 'align_center'],
					e:
					{
						submit: this.event_submit_register.bind(this)
					}
				},
				div({c:['column', 'title']}, 'Please Register'),
				this.dom.message = div({c:['column', 'message']}),
				div({c:['column', 'body']},
					span({c:'label'},
						'A username can contain any combination of letters, numbers, or underscores.'
					),
					br, br,
					input({
						type:'text',
						name:'user',
						placeholder:'Username'
					}),
					br, br, br,
					
					span({c:'label'},
						'A password should be at least 4 characters.'
					),
					br, br,
					input({
						type:'password',
						name:'password',
						placeholder:'Password'
					}),
					br, br,
					
					span({c:'label'},
						'Please confirm password'
					),
					br, br,
					input({
						type:'password',
						name:'password_confirm',
						placeholder:'Password (Confirm)'
					}),
					br, br, br,
					
					button({
							type:'submit',
							name:'submit'
						},
						'Register'
					),
					
					br, br,
					
					span('If you already have an account, you can login '),
					span({c:'a', e:{click:this.render_login.bind(this)}}, 'here'),
					span('.')
				)
			),
			r._(this.dom.content)
		);
	},
	
	'public event_submit_register':		function(event)
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
		if(flag && (data.user == 'anonymous' || data.user == 'root'))
		{
			this.render_error('The username may not be anonymous or root!', 'error');
			flag = false;
		}
		if(flag && data.user.length > 64)
		{
			this.render_error('The username may not be larger than 64 characters!', 'error');
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
		
		if(flag && !data.password_confirm)
		{
			this.render_error('Please enter a confirmation password for the account!', 'error');
			flag = false;
		}
		if(flag && data.password != data.password_confirm)
		{
			this.render_error('Please enter a confirmation password that matches the original password!', 'error');
			flag = false;
		}
		
		if(flag)
		{
			r.xhr.rpc('token', 'POST', data, this.rpc, this);
		}
	}
	
};