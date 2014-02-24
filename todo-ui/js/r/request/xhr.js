r.implement({
	xhr:
	{
		xhr:	function(options)
		{
			options = r.object.merge({
				method:		'GET',
				url:		'/',
				async:		true,
				headers:	{},
				data:		null,
				onload:		function(){}
			}, options);
			
			var x = new XMLHttpRequest();
				x.open(options.method, options.url, options.async);
				
				if(!r.empty(options.headers))
				{
					r.each(options.headers, function(v, k)
					{
						x.setRequestHeader(k, v);
					}, this);
				}
				
				if(!r.empty(options.onload))
				{
					x.onload = function(e)
					{
						if(x.readyState == 4 && x.status == 200)
						{
							options.onload((
								x.getResponseHeader('Content-Type').indexOf('json')
								?
								JSON.parse(x.responseText)
								:
								x.responseText
							));
						}
					}
				}
				
				if(options.data)
				{
					x.send(options.data);
				}
			return x;
		},
		
		json:	function(urls, callback, bind)
		{
			r.each((r.is_string(urls) ? [urls] : urls), function(url)
			{
				r.xhr.xhr({
					method:		'GET',
					url:		url,
					onload:		callback.bind((bind || this), url)
				}).send();
			});
		},
	
		rpc:	function(entity, method, data, callback, bind)
		{
			var url = '/api/1/' + entity;
			if(method == 'GET' && !r.empty(data))
			{
				r.each(data, function(value, key)
				{
					url += (url.indexOf('?') == -1 ? '?' : '&') + key + '=' + value;
				});
				url += '&cache=' + (Math.random() * 1000000);
			}
			r.xhr.xhr({
				method:				method,
				url:				url,
				headers:
				{
					'Content-Type':	'application/json;charset=UTF-8'
				},
				onload:				callback.bind(bind),
				data:				JSON.stringify(data)
			});
			return this;
		}
	}
});