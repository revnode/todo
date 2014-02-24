r.implement({
	mutators:
	{
		'^public\\s(\\w+)':		function(value, key)
		{
			this.implement(key, value);
		},
		
		'^private\\s(\\w+)':	function(value, key)
		{
			if(r.is_function(value))
			{
				value.$hide = true;
				value.$protected = true;
			}
			this.implement(key, value);
		},
		
		'^protected\\s(\\w+)':	function(value, key)
		{
			if(r.is_function(value))
			{
				value.$protected = true;
			}
			this.implement(key, value);
		}
	}
});