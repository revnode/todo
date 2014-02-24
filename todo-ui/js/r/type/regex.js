r.implement({
	regex:
	{
		options:
		{
			regex:			undefined,
			prefixes:		'',
			source:			'',
			suffixes:		'',
			modifiers:		'gm'
		},
		
		init:				function(options)
		{
			return r.object.merge(
				new RegExp(
					(options.regex || r.regex.options.regex),
					(options.modifiers || r.regex.options.modifiers)
				),
				r.regex,
				{options:options}
			);
		},
		
		sanitize:			function(v)
		{
			return (
				v.source
				?
				v.source
				:
				v.replace(/[^\w]/g, function(char){return "\\" + char;})
			);
		},
		
		add:				function(v)
		{
			this.options.regex = this.prefixes + (this.source += (v || '')) + this.suffixes;
			return this.init(this.options);
		},
		
		start_of_line:		function(on)
		{
			this.prefixes = (on ? '^' : '');
			return this.add();
		},
		
		end_of_line:		function(on)
		{
			this.suffixes = (on ? '$' : '');
			return this.add();
		},
		
		then:				function(v)
		{
			return this.add('(?:' + this.sanitize(v) + ')');
		},

		find:				function(v)
		{
			return this.then(v);
		},
		
		maybe:				function(v)
		{
			return this.add('(?:' + this.sanitize(v) + ')?');
		},
		
		anything:			function()
		{
			return this.add('(?:.*)');
		},
		
		anything_but:		function(v)
		{
			return this.add('(?:[^' + this.sanitize(v) + ']*)');
		},
		
		something:			function()
		{
			return this.add('(?:.+)');
		},
		
		something_but:		function(v)
		{
			return this.add('(?:[^' + this.sanitize(v) + ']+)');
		},
		
		replace:			function(s, v)
		{
			return s.toString().replace(this, v);
		},

		line_break:			function()
		{
			return this.add('(?:(?:\\n)|(?:\\r\\n))');
		},
		
		tab:				function()
		{
			return this.add('\\t');
		},

		word:				function()
		{
			return this.add('\\w+');
		},
		
		any_of:				function(v)
		{
			return this.add('[' + this.sanitize(v) + ']');
		},

		range:				function()
		{
			var value = '[';
			for(var _from = 0; _from < arguments.length; _from += 2)
			{
				var _to = _from + 1;
				if(arguments.length <= to)
				{
					break;
				}
			
				var from = this.sanitize(arguments[_from]);
				var to = this.sanitize(arguments[_to]);
			
				value += from + '-' + to;
			}
			return this.add(value + ']');
		},
		
		modifier:			function(m)
		{
			return this.modifier_toggle((this.modifiers.indexOf(m) < 0), m);
		},
		
		modifier_toggle:	function(on, m)
		{
			return (on ? this.modifier_on(m) : this.modifier_off(m));
		},
		
		modifier_on:		function(modifier)
		{
			this.modifiers += modifier;
			return this.add();
		},
		
		modifier_off:		function(modifier)
		{
			this.modifiers = this.modifiers.replace(modifier, '');
			return this.add();
		},
		
		with_any_case:		function(on)
		{
			return this.modifier_toggle(on, 'i');
		},

		stop_at_first:		function(on)
		{
			return this.modifier_toggle(on, 'g');
		},
		
		search_one_line:	function(on)
		{
			return this.modifier_toggle(on, 'm);
		},

		multiple:			function(v)
		{
			v = (v.source ? v.source : this.sanitize(v));
			switch(v.substr(-1))
			{
				case '*':
				case '+':
					break;
				
				default:
					v += '+';
					break;
			}
			return this.add(v);
		},
		
		or:					function(v)
		{
			this.prefixes += '(?:';
			this.suffixes = ')' + this.suffixes;
		
			this.add(')|(?:');
		
			return (v ? this.then(value) : this );
		},

		begin_capture:		function()
		{
			this.suffixes += ')';
			return this.add('(');
		},
		
		end_capture:		function()
		{
			this.suffixes = this.suffixes.substring(0, this.suffixes.length - 1);
			return this.add(')');
		}
	}
});