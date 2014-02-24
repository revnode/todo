Class: Chain {#Chain}
=====================

A Utility Class which executes functions one after another, with forEach function firing after completion of the previous.
Its methods can be implemented with [Class:implement][] into any [Class][], and it is currently implemented in [Fx][] and [Request][].
In [Fx][], for example, it is used to create custom, complex animations.

Class: Chain {#Chain}
=====================
Extends the [Chain][] class.

### Tutorial/Demo

* [Online Tutorial/Demo][]
[Online Tutorial/Demo]:http://www.clientcide.com/wiki/cnet-libraries/01.1-class.extras/01-chain.wait

Chain Method: wait {#Chain:wait}
--------------------------------

Injects pauses between chained events.

### Syntax

	myClass.wait(duration);

### Arguments

1. duration - (*number*) The duration (in milliseconds) to pause the chain stack; defaults to *500*.

### Example

	new Fx.Tween('myElement', {
		property: 'width',
		link: 'chain'
	}).start(0).wait(400).start(100);

### Returns

* (*object*) - This instance of the class.

Chain Method: constructor {#Chain:constructor}
----------------------------------------------


### Syntax:

#### For new classes:

	var MyClass = new Class({ Implements: Chain });

#### For existing classes:

	MyClass.implement(Chain);

#### Stand alone

	var myChain = new Chain;

### Example:

		var Todo = new Class({
			Implements: Chain,
			initialize: function(){
				this.chain.apply(this, arguments);
			}
		});

		var myTodoList = new Todo(
			function(){ alert('get groceries');	},
			function(){ alert('go workout'); },
			function(){ alert('code mootools documentation until eyes close involuntarily'); },
			function(){ alert('sleep');	}
		);

### See Also:

- [Class][]



Chain Method: chain {#Chain:chain}
----------------------------------

Adds functions to the end of the call stack of the Chain instance.

### Syntax:

	myClass.chain(fn[, fn2[, fn3[, ...]]]);

### Arguments:

1. fn - (*function* or *array*) The function (or array of functions) to add to the chain call stack. Will accept and number of functions or arrays of functions.

### Returns:

* (*object*) The current Class instance. Calls to chain can also be chained.

### Example:
	//Fx.Tween has already implemented the Chain class because of inheritance of the Fx class.
	var myFx = new Fx.Tween('myElement', {property: 'opacity'});
	myFx.start(1,0).chain(
		//Notice that "this" refers to the calling object (in this case, the myFx object).
		function(){ this.start(0,1); },
		function(){ this.start(1,0); },
		function(){ this.start(0,1); }
	); //Will fade the Element out and in twice.


### See Also:

- [Fx][], [Fx.Tween][]



Chain Method: callChain {#Chain:callChain}
------------------------------------------

Removes the first function of the Chain instance stack and executes it. The next function will then become first in the array.

### Syntax:

	myClass.callChain([any arguments]);

### Arguments:

1. Any arguments passed in will be passed to the "next" function.

### Returns:

* (*mixed*) The return value of the "next" function or false when the chain was empty.

### Example:

	var myChain = new Chain();
	myChain.chain(
		function(){ alert('do dishes'); },
		function(){ alert('put away clean dishes'); }
	);
	myChain.callChain(); // alerts 'do dishes'.
	myChain.callChain(); // alerts 'put away clean dishes'.



Chain Method: clearChain {#Chain:clearChain}
--------------------------------------------

Clears the stack of a Chain instance.

### Syntax:

	myClass.clearChain();

### Returns:

* (*object*) The current Class instance.

### Example:

	var myFx = Fx.Tween('myElement', 'color'); // Fx.Tween inherited Fx's implementation of Chain.
	myFx.chain(function(){ while(true) alert("D'oh!"); }); // chains an infinite loop of alerts.
	myFx.clearChain(); // cancels the infinite loop of alerts before allowing it to begin.

### See Also:

- [Fx][], [Fx.Tween][]