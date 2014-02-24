r.implement({
	name_of:		function(instance, context)
	{
		return Object.keyOf((context || window), (instance.constructor || instance));
	},

	instance_of:	function(item, object)
	{
		if(r.is_undefined(item) || r.is_null(item))
		{
			return false;
		}
		var constructor = (item.$constructor || item.constructor);
		while(constructor)
		{
			if(constructor === object)
			{
				return true;
			}
			constructor = constructor.parent;
		}
		return item instanceof object;
	},
	
	singleton:		function(s, o)
	{
		return new (new r.klass(s))(o);
	},
	
	klass:			function(params)
	{
		var klass = function()
		{
			var reset = function(object)
			{
				for(var key in object)
				{
					var value = object[key];
					switch(r.type_of(value))
					{
						case 'object':
							var F = function(){};
							F.prototype = value;
							object[key] = reset(new F);
							break;
						
						case 'array':
							object[key] = value.slice(0);
							break;
					}
				}
				return object;
			};
			
			reset(this);
			
			if(klass.$prototyping)
			{
				return this;
			}
			this.$caller = null;
			var value = (
				this.initialize
				?
				this.initialize.apply(this, arguments)
				:
				this
			);
			this.$caller = this.caller = null;
			return value;
		};
	
		klass.prototype.parent = function()
		{
			if(!this.$caller)
			{
				throw new Error("The method 'parent' cannot be called.");
			}
			
			var name		= this.$caller.$name,
				parent		= this.$caller.$owner.parent,
				previous	= (parent ? parent.prototype[name] : null);
			
			if(!previous)
			{
				throw new Error('The method ' + name + ' has no parent.');
			}
			return previous.apply(this, arguments);
		};
		
		klass.implement = function(key, value, retain)
		{
			var wrap = function(self, key, method)
			{
				if(method.$origin)
				{
					method = method.$origin;
				}
				
				var wrapper = r.object.merge(
					function()
					{
						if(method.$protected && !this.$caller)
						{
							throw new Error("The method '" + key + "' cannot be called.");
						}
						var caller		= this.caller,
							current		= this.$caller;
						
						this.caller		= current;
						this.$caller	= wrapper;
						
						var result		= method.apply(this, arguments);
						
						this.caller		= caller;
						this.$caller	= current;
						
						return result;
					},
					{
						$owner:		self,
						$origin:	method,
						$name:		key
					}
				);
				return wrapper;
			};
			
			var pure = true;
			r.some(klass.mutators, function(mutator, regex)
			{
				var match = key.match(new RegExp(regex));
				if(match)
				{
					pure = mutator.call(klass, value, match[1]);
					return true;
				}
			});
			if(!pure)
			{
				return this;
			}
			
			switch(r.type_of(value))
			{
				case 'function':
					if(value.$hidden)
					{
						return this;
					}
					if(value.$hide)
					{
						value.$hidden = true;
						delete value.$hide;
					}
					this.prototype[key] = (retain ? value : wrap(this, key, value));
					break;
				
				case 'object':
					if(this.prototype[key])
					{
						r.object.merge(this.prototype[key], value);
					}
					else
					{
						this.prototype[key] = value;
					}
					break;
				
				default:
					this.prototype[key] = value;
					break;
			}
		
			return this;
		};
	
		klass.$type						= 'klass';
		klass.prototype.$type			= 'instance';
		klass.$constructor				= r.klass;
		klass.prototype.$constructor	= klass;
		klass.mutators					= r.mutators;
		
		for(var key in params)
		{
			this[key] = klass.implement(key, params[key]);
		}
		
		return klass;
	},
	
	mutators:		{}
});