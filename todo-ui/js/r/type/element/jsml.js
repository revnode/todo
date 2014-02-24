(function()
{
	function jsml(a)
	{
		switch(r.type_of(a))
		{
			case 'object':
				r.each(a, function(v, k)
				{
					if(!r.is_null(v))
					{
						switch(k)
						{	
							case 'c':
							case 'classes':
								r.each((r.is_string(v) ? v.split(' ') : v), function(c)
								{
									this.classList.add(c);
								}, this);
								break;
							
							case 's':
							case 'styles':
								r.each(v, function(s, p)
								{
									this.style[p] = s;
								}, this);
								break;
							
							case 'e':
							case 'events':
								r.each(v, function(l, t)
								{
									r.element.on(this, t, l);
								}, this);
								break;
							
							default:
								if(v !== false && v !== undefined && v !== null)
								{
									this.setAttribute(k.replace('_', '-'), v);
								}
								break;
						}
					}
				}, this);
				break;
			
			case 'instance':
				var flagged = false;
				r.each(['element', 'array', 'string', 'number', 'function'], function(type)
				{
					if(!flagged && a['to_' + type])
					{
						jsml.call(this, a['to_' + type]());
						flagged = true;
					}
				}, this);
				break;
			
			case 'function':
				jsml.call(this, a());
				break;
			
			case 'array':
				r.each(a, function(b){jsml.call(this, b);}, this);
				break;
			
			case 'string':
			case 'number':
				this.innerHTML = a;
				break;
			
			case 'element':
				this.appendChild(a);
				break;
		}
	}
	
	r.each(
		[
			'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio',
			'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button',
			'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'command',
			'data', 'datagrid', 'datalist', 'dd', 'del', 'details', 'dfn', 'div', 'dl', 'dt',
			'em', 'embed', 'eventsource',
			'fieldset', 'figcaption', 'figure', 'footer', 'form',
			'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html',
			'i', 'iframe', 'img', 'input', 'ins',
			'kbd', 'keygen',
			'label', 'legend', 'li', 'link',
			'mark', 'map', 'menu', 'meta', 'meter',
			'nav', 'noscript',
			'object', 'ol', 'optgroup', 'option', 'output',
			'p', 'param', 'pre', 'progress',
			'q',
			'ruby', 'rp', 'rt',
			's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup',
			'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track',
			'u', 'ul',
			'var', 'video',
			'wbr'
		],
		function(t)
		{
			if(!window[t])
			{
				window[t] = this.bind(t);
			}
		},
		function()
		{
			var n = document.createElement(this);
				r.each(arguments, jsml, n);
			return n;
		}
	);
})();