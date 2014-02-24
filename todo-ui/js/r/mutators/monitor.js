r.implement({
	mutators:
	{
		'^monitor\\s(\\w+)':	function(value, key)
		{
			if(r.is_function(value))
			{
				value = function()
				{
					console.warn(
						"${r.name_of(this)}::${key}     scope: ",
						this,
						'     args: ',
						arguments
					);
					return value.apply(this, arguments);
				};
			}
			this.implement(key, value);
		}
	}
});