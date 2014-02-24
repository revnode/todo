var pages_todo = {
	
	'public render_todo':			function()
	{
		r.inject(
			div({c:'align_center'},
				this.dom.message = div({c:'message'}),
				this.dom.form = form({
						method:		'post',
						e:
						{
							submit:	this.event_submit_todo.bind(this)
						}
					},
					br, br,
					input({name:'state', type:'hidden', value:'uncompleted'}),
					input({name:'priority', placeholder:'priority', type:'text', required:'true', pattern:'\\d{1,4}', autocomplete:'off'}),
					span('&nbsp;&nbsp;&nbsp;'),
					input({name:'due', placeholder:'due', type:'date', required:'true', autocomplete:'off'}),
					span('&nbsp;&nbsp;&nbsp;'),
					input({name:'text', placeholder:'todo', type:'text', required:'true', autocomplete:'off', s:{width:'25%'}}),
					span('&nbsp;&nbsp;&nbsp;'),
					button({type:'submit'},
						span({c:['fa', 'fa-plus']}),
						span(' Add Todo')
					)
				),
				br,
				div({c:'table'},
					div({c:'column_10'}, 'done'),
					div({c:'column_10'},
						span('priority&nbsp;'),
						span('&nbsp;&nbsp;'),
						span({
							c:['a', 'fa', 'fa-sort-desc'],
							e:
							{
								click:	this.event_change_order.bind(this, 'due', 'DESC')
							}
						}),
						span('&nbsp;&nbsp;'),
						span({
							c:['a', 'fa', 'fa-sort-asc'],
							e:
							{
								click:	this.event_change_order.bind(this, 'due', 'ASC')
							}
						})
					),
					div({c:'column_10'},
						span('due&nbsp;'),
						span('&nbsp;&nbsp;'),
						span({
							c:['a', 'fa', 'fa-sort-desc'],
							e:
							{
								click:	this.event_change_order.bind(this, 'due', 'DESC')
							}
						}),
						span('&nbsp;&nbsp;'),
						span({
							c:['a', 'fa', 'fa-sort-asc'],
							e:
							{
								click:	this.event_change_order.bind(this, 'due', 'ASC')
							}
						})
					),
					div({c:'column_50'}, 'todo'),
					div({c:'column_20'}, '&nbsp;'),
					div({c:'column'}, hr),
					function()
					{
						var display = [], todos = [];
						
						r.each(this.local.todos, function(todo, id)
						{
							todo.id = id;
							todos.push(todo);
						}, this);
						
						todos.sort(function(a, b)
						{
							switch(this.local.sort.column)
							{
								case 'priority':
									switch(this.local.sort.order)
									{
										case 'ASC':
											if(a.priority > b.priority) return 1;
											if(a.priority < b.priority) return -1;
											return 0;
											break;
										
										case 'DESC':
											if(a.priority > b.priority) return -1;
											if(a.priority < b.priority) return 1;
											return 0;
											break;
									}
									break;
								
								case 'due':
									switch(this.local.sort.order)
									{
										case 'ASC':
											if(new Date(a.due) > new Date(b.due)) return 1;
											if(new Date(a.due) < new Date(b.due)) return -1;
											return 0;
											break;
										
										case 'DESC':
											if(new Date(a.due) > new Date(b.due)) return -1;
											if(new Date(a.due) < new Date(b.due)) return 1;
											return 0;
											break;
									}
									break;
							}
						}.bind(this));
						
						r.each(todos, function(todo)
						{
							display.push(
								div({c:'column_10'},
									input({
										name:			'state_' + todo.id,
										id:				'state_' + todo.id,
										type:			'checkbox',
										checked:		(todo.state == 'completed')
									})
								),
								div({c:'column_10'},
									input({
										name:			'priority_' + todo.id,
										id:				'priority_' + todo.id,
										placeholder:	'priority',
										type:			'text',
										required:		'true',
										pattern:		'\\d{1,4}',
										autocomplete:	'off',
										s:				{width:'80%'},
										value:			todo.priority
									})
								),
								div({c:'column_10'},
									input({
										name:			'due_' + todo.id,
										id:				'due_' + todo.id,
										placeholder:	'due',
										type:			'date',
										required:		'true',
										autocomplete:	'off',
										s:				{width:'80%'},
										value:			todo.due
									})
								),
								div({c:'column_50'},
									input({
										name:			'text_' + todo.id,
										id:				'text_' + todo.id,
										placeholder:	'todo',
										type:			'text',
										required:		'true',
										autocomplete:	'off',
										s:				{width:'90%'},
										value:			todo.text
									})
								),
								div({c:'column_20'},
									button({
											type:	'button',
											e:
											{
												click:	function(event)
												{
													var data = {
														user:		this.local.user,
														token:		this.local.token,
														id:			todo.id,
														state:		(
															r.$('#state_' + todo.id).checked
															?
															'completed'
															:
															'uncompleted'
														),
														priority:	r.$('#priority_' + todo.id).value,
														due:		r.$('#due_' + todo.id).value,
														text:		r.$('#text_' + todo.id).value
													};
													
													r.xhr.rpc('todo', 'PUT', data, this.rpc, this);
												}.bind(this)
											}
										},
										span({c:['fa', 'fa-save']}),
										span(' Save')
									),
									span('&nbsp;&nbsp;&nbsp;'),
									button({
											c:		'red',
											type:	'button',
											e:
											{
												click:	function(event)
												{
													var data = {
														user:		this.local.user,
														token:		this.local.token,
														id:			todo.id
													};
													
													r.xhr.rpc('todo', 'DELETE', data, this.rpc, this);
												}.bind(this)
											}
										},
										span({c:['fa', 'fa-ban']}),
										span(' Delete')
									)
								),
								div({c:'column'}, '&nbsp;')
							);
						}, this);
						return display;
					}.bind(this)
				)
			),
			r._(this.dom.content)
		);
	},
	
	'public event_change_order':		function(column, order, event)
	{
		this.local.sort.column	= column;
		this.local.sort.order	= order;
		this.render_todo();
	},
	
	'public event_submit_todo':		function(event)
	{
		event.preventDefault();
		r._(this.dom.message);
		var data = r.form.to(this.dom.form);
		
		data.user	= this.local.user;
		data.token	= this.local.token;
		data.id		= Date.now();
		
		r.xhr.rpc('todo', 'POST', data, this.rpc, this);
	}
	
};