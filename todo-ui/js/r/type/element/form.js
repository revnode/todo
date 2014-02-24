r.implement({
	form:
	{
		to:	function(target, type)
		{
			var query	= {object:{}, string:''};
				type	= (type ? type : 'object');
			r.each(r.$$('input, select, textarea', target), function(el)
			{
				if(
					!el.name
					||
					el.type == 'submit' || el.type == 'reset' || el.type == 'file' || el.type == 'image'
				)
				{
					return;
				}
				
				var value = (
					el.tagName == 'select'
					?
					el.options[el.selectedIndex].value
					:
					(
						((el.type == 'radio' || el.type == 'checkbox') && !el.checked)
						?
						null
						:
						el.value
					)
				);
				
				if(!r.empty(value))
				{
					switch(type)
					{
						case 'string':
							query.string += (empty(query.string) ? '' : '&')
								+ encodeURIComponent(el.name)
								+ '='
								+ encodeURIComponent(value);
							break;
						
						case 'object':
							query.object[el.name] = value;
							break;
					}
				}
			}, this);
			return query[type];
		}
	}
});