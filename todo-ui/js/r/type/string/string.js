r.implement({
	string:
	{
		escape_reg_exp:	function(str)
		{
			return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
		}
	}
});