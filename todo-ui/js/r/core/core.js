var r = {
	seed:		+(new Date),
	
	implement:	function(o)
	{
		for(var k in o)
		{
			r[k] = (r[k] ? r.object.merge(r[k], o[k]) : o[k]);
		}
		return r;
	},
	
	type_of:	function(a)
	{
		if(a && a.$type)
		{
			return a.$type;
		}
		else
		{
			var t = Object.prototype.toString.call(a).slice(8, -1).toLowerCase();
			return (t.indexOf('html') > -1 ? 'element' : t);
		}
	},
	
	empty:		function(a)
	{
		switch(r.type_of(a))
		{
			case 'string':
				return (
					a == ''
					||
					a == '0'
					||
					a.toLowerCase() == 'false'
					||
					a.toLowerCase() == 'null'
				);
			
			case 'object':
				return r.empty(Object.keys(a));
			
			case 'arguments':
			case 'array':
				return (a.length == 0);
				
			case 'element':
				return !a.hasChildNodes();
			
			case 'number':
				return (a == 0);
				
			case 'boolean':
				return !a;
			
			case 'function':
				return (a.toString() == (function(){}).toString());
			
			case 'klass':
			case 'date':
			case 'textnode':
			case 'regexp':
				return false;
			
			case 'whitespace':
			default:
				return true;
		}
	},
	
	each:		function(o, i, c)
	{
		switch(r.type_of(o))
		{
			case 'arguments':
				r.each(Array.prototype.slice.call(o, 0), i, c);
				break;
				
			case 'array':
			case 'nodelist':
				if(o.forEach)
				{
					o.forEach(i, c);
				}
				else
				{
					for(var k = 0; k < o.length; k++)
					{
						i.call(c, o[k], k);
					}
				}
				break;
			
			case 'object':
				for(var k in o)
				{
					i.call(c, o[k], k);
				}
				break;
			
			case 'string':
				r.each(o.split(''), i, c);
				break;
		}
		return o;
	},
	
	map:		function(o, i, c)
	{
		switch(r.type_of(o))
		{
			case 'arguments':
				return r.map(Array.prototype.slice.call(o, 0), i, c);
				
			case 'array':
			case 'nodelist':
				if(o.map)
				{
					return o.map(i, c);
				}
				else
				{
					for(var k = 0; k < o.length; k++)
					{
						o[k] = i.call(c, o[k], k);
					}
				}
				return o;
			
			case 'object':
				for(var k in o)
				{
					o[k] = i.call(c, o[k], k);
				}
				return o;
			
			case 'string':
				return r.map(o.split(''), i, c).join('');
		}
	},
	
	every:		function(o, i, c)
	{
		switch(r.type_of(o))
		{
			case 'arguments':
				return r.every(Array.prototype.slice.call(o, 0), i, c);
				
			case 'array':
			case 'nodelist':
				if(o.every)
				{
					return o.every(i, c);
				}
				else
				{
					for(var k = 0; k < o.length; k++)
					{
						if(!i.call(c, o[k], k))
						{
							return false;
						}
					}
				}
				return true;
			
			case 'object':
				for(var k in o)
				{
					if(!i.call(c, o[k], k))
					{
						return false;
					}
				}
				return true;
			
			case 'string':
				return r.every(o.split(''), i, c);
		}
	},
	
	some:		function(o, i, c)
	{
		switch(r.type_of(o))
		{
			case 'arguments':
				return r.some(Array.prototype.slice.call(o, 0), i, c);
				
			case 'array':
			case 'nodelist':
				if(o.some)
				{
					return o.some(i, c);
				}
				else
				{
					for(var k = 0; k < o.length; k++)
					{
						if(i.call(c, o[k], k))
						{
							return true;
						}
					}
				}
				return false;
			
			case 'object':
				for(var k in o)
				{
					if(i.call(c, o[k], k))
					{
						return true;
					}
				}
				return false;
			
			case 'string':
				return r.some(o.split(''), i, c);
		}
	},
	
	filter:		function(o, i, c)
	{
		switch(r.type_of(o))
		{
			case 'arguments':
				return r.filter(Array.prototype.slice.call(o, 0), i, c);
				
			case 'array':
			case 'nodelist':
				if(o.filter)
				{
					return o.filter(i, c);
				}
				else
				{
					for(var k = 0; k < o.length; k++)
					{
						if(!i.call(c, o[k], k))
						{
							delete o[k];
						}
					}
				}
				return o;
			
			case 'object':
				for(var k in o)
				{
					if(!i.call(c, o[k], k))
					{
						delete o[k];
					}
				}
				return o;
			
			case 'string':
				return r.filter(o.split(''), i, c).join('');
		}
	},
	
	cull:		function(o, i)
	{
		switch(r.type_of(o))
		{
			case 'arguments':
				return r.cull(Array.prototype.slice.call(o, 0), i);
				
			case 'array':
			case 'nodelist':
				switch(i)
				{
					case 'last':	return o[o.length - 1];
					case 'random':	return o[r.random(0, o.length - 1)];
					default:		return o[i];
				}
			
			case 'object':
				return r.cull(r.object.values(o), i);
			
			case 'string':
				return r.cull(o.split(''), i);
		}
	},
	
		first:		function(o)
		{
			return r.cull(o, 0);
		},
		
		last:		function(o)
		{
			return r.cull(o, 'last');
		},
		
		random:		function(min, max)
		{
			if(is_number(min))
			{
				return Math.floor(Math.random() * (max - min + 1) + min);
			}
			else
			{
				return r.cull(min, 'random');
			}
		},
	
	uid:		function()
	{
		return (r.seed++).toString(36);
	},
	
	object:
	{
		merge:	function(o)
		{
			r.each(Array.prototype.slice.call(arguments, 1), function(s)
			{
				if(r.is_object(s))
				{
					for(var k in s)
					{
						if(r.is_object(o[k]) && r.is_object(s[k]))
						{
							r.object.merge(o[k], s[k]);
						}
						else
						{
							o[k] = s[k];
						}
					}
				}
			}, this);
			return o;
		},
		
		values:	function(o)
		{
			var v = [];
			for(var k in o)
			{
				v.push(o[k]);
			}
			return v;
		}
	}
};

r.each(
	[
		'klass',
		'element',
		'arguments',
		'array',
		'object',
		'string',
		'number',
		'date',
		'boolean',
		'function',
		'regexp',
		'null',
		'undefined'
	],
	function(t)
	{
		r['is_' + t] = function(a)
		{
			return (t == r.type_of(a));
		};
	}
);