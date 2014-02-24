r.implement({
	uri:
	{
		data:	{},
		
		get:	function(t)
		{
			return window.location[(t || 'href')];
		},
		
		set:	function(u, t)
		{
			return (
				window.location[(t || 'href')] = (u || r.uri.get(t))
			);
		},
		
		push:	function(u, t, s)
		{
			if(history.pushState)
			{
				history.pushState(
					r.object.merge({href:u}, (r.is_object(s) ? s : {})),
					t,
					u
				);
			}
			r.uri.split(u);
		},
		
		split:	function(u)
		{
			var h = (u || r.uri.get()),
				i = h.indexOf('?');
			
			r.uri.data = {};
			if(i > -1)
			{
				r.each(h.substring(i + 1).split('&'), function(e)
				{
					var m = e.split('=');
					r.uri.data[decodeURIComponent(m[0])] = decodeURIComponent(m[1]);
				}, this);
			}
		}
	}
});