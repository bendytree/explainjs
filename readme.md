
# ExplainJS

Generate a side-by-side view of your comments and code. Works on JavaScript files, CSS, and other similar languages.

More info at http://www.explainjs.com


	var explainjs = require('explainjs');

	var js = '//My Library\n doSomething();';

	explainjs(js, function(error, results){
	  // <p>My Library</p>
	  console.log(results.sections[0].comments);
	
	  // doSomething();
	  console.log(results.sections[0].code);
	});

Here's how it looks:

![ExplainJS Screenshot](http://www.explainjs.com/static/images/screenshot.jpg)
