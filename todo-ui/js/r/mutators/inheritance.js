r.implement({
	mutators:
	{
		'^ext$':		function(parent)
		{
			switch(r.type_of(parent))
			{
				case 'object':
					parent = new r.klass(parent);
					break;
				
				case 'string':
					parent = new r.klass(window[parent]);
					break;
			}
			
			this.parent = parent;
			parent.$prototyping = true;
			this.prototype = new parent;
			delete parent.$prototyping;
		},
	
		'^imp$':		function(items)
		{
			r.each(items, function(item)
			{
				switch(r.type_of(item))
				{
					case 'object':
						item = new r.klass(item);
						break;
					
					case 'string':
						item = new r.klass(window[item]);
						break;
				}
				
				item.$prototyping = true;
				
				var instance = new item;
				for(var key in instance)
				{
					this.implement.call(this, key, instance[key], true);
				}
			}, this);
		},
		
		'^use$':		function(items)
		{
			if(!r.empty(items))
			{
				this.mutators['^ext$'].apply(this, [items.shift()]);
				if(!r.empty(items))
				{
					this.mutators['^imp$'].apply(this, [items]);
				}
			}
		}
	}
});