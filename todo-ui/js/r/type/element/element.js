r.implement({
	$:			function(q, parent)
	{
		return (parent || document).querySelector(q);
	},
	
	$$:			function(q, parent)
	{
		return (parent || document).querySelectorAll(q);
	},
	
	_:			function(el)
	{
		while(el.firstChild)
		{
			el.removeChild(el.firstChild);
		}
		return el;
	},
	
	__:			function(el, target)
	{
		if(target)
		{
			target.parentNode.replaceChild(el, target);
		}
		else
		{
			el.parentNode.removeChild(el);
		}
	},
	
	inject:		function(el, target, where)
	{
		switch(r.type_of(el))
		{
			case 'instance':
				var flagged = false;
				r.each(['element', 'array', 'string', 'number', 'function'], function(type)
				{
					if(!flagged && el['to_' + type])
					{
						r.inject(el['to_' + type](), target, where);
						flagged = true;
					}
				}, this);
				break;
			
			case 'function':
				r.inject(el(), target, where);
				break;
			
			case 'array':
				r.each(el, function(sel){r.inject(sel, target, where);}, this);
				break;
			
			case 'element':
				switch(where)
				{
					case 'top':
						target = target.firstChild;
					case 'before':
						target.parentNode.insertBefore(el, target);
						break;
					
					case 'after':
						target = target.parentNode;
					default:
						target.appendChild(el);
						break;
				}
				break;
		}
	},
	
	element:
	{
		on:		function(e, t, l, u)
		{
			e.addEventListener(t, l, !!u);
			return e;
		},
		
		off:	function(e, t, l, u)
		{
			e.removeEventListener(t, l, !!u);
			return e;
		},
		
		emit:	function(e, t, b, c, d)
		{
			e.dispatchEvent(new CustomEvent(t, !!b, !!c, d || {}));
			return e;
		},
		
		open:			function(el)
		{
			switch(el.tagName)
			{
				case 'DIV':
				case 'OBJECT':
					el.style.display = 'block';
					break;
				
				case 'IMG':
				case 'SPAN':
					el.style.display = 'inline';
					break;
			}
			return el;
		},
		
		close:			function(el)
		{
			el.style.display = 'none';
			return el;
		},
		
		show:			function(el)
		{
			el.style.visibility = 'visible';
			return el;
		},
	
		hide:			function(el)
		{
			el.style.visibility = 'hidden';
			return el;
		},
		
		visible:		function(el)
		{
			return !(el.style.display == 'none' || el.style.visibility == 'hidden');
		}
	}
});