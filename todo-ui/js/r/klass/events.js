var Events = new Class({
	$events:		{},
	
	removeOn:		function(string)
	{
		return string.replace(/^on([A-Z])/, function(full, first)
		{
			return first.toLowerCase();
		});
	},
	
	addEvent:		function(type, fn, internal)
	{
		type = this.removeOn(type);
		this.$events[type] = (this.$events[type] || []).include(fn);
		if(internal)
		{
			fn.internal = true;
		}
		return this;
	},
	
	fireEvent:		function(type, args, delay)
	{
		type = this.removeOn(type);
		var events = this.$events[type];
		if(!events)
		{
			return this;
		}
		args = Array.from(args);
		events.forEach(function(fn)
		{
			if(delay)
			{
				fn.delay(delay, this, args);
			}
			else
			{
				fn.apply(this, args);
			}
		}, this);
		return this;
	},
	
	removeEvent:	function(type, fn)
	{
		type = this.removeOn(type);
		var events = this.$events[type];
		if(events && !fn.internal)
		{
			var index = events.indexOf(fn);
			if(index != -1)
			{
				delete events[index];
			}
		}
		return this;
	},
	
	removeEvents:	function(events)
	{
		var type;
		if(is_object(events))
		{
			for(type in events)
			{
				this.removeEvent(type, events[type]);
			}
			return this;
		}
		if(events)
		{
			events = this.removeOn(events);
		}
		for(type in this.$events)
		{
			if(events && events != type)
			{
				continue;
			}
			for(var fns = this.$events[type], i = fns.length; i--;)
			{
				if(i in fns)
				{
					this.removeEvent(type, fns[i]);
				}
			}
		}
		return this;
	}
});