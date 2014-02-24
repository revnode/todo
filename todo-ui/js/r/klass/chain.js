var Chain = new Class({
	
	$chain:		[],
	
	chain:		function()
	{
		this.$chain.append(Array.flatten(arguments));
		return this;
	},
	
	callChain:	function()
	{
		return (
			this.$chain.length
			?
			this.$chain.shift().apply(this, arguments)
			:
			false
		);
	},
	
	clearChain:	function()
	{
		this.$chain.empty();
		return this;
	},
	
	wait:		function(duration)
	{
		return this.chain(function()
		{
			this.callChain.delay((empty(duration) ? 500 : duration), this);
			return this;
		}.bind(this));
	}
	
});