
var should = require("should");
var explainjs = require('../index.js');


    it('should handle // comment and code block', function(done){
        var js = "//hi\ngo();";
        explainjs(js, function(err, results){
            results.sections.length.should.equal(1);
            results.sections[0].comments.should.equal('<p>hi</p>');
            results.sections[0].code.should.equal('go();');
            done();
        });
    });
    
    it('should handle /* */ comment', function(done){
        var js = "/* hi */\ngo();";
        explainjs(js, function(err, results){
            results.sections.length.should.equal(1);
            results.sections[0].comments.should.equal('<p>hi</p>');
            results.sections[0].code.should.equal('go();');
            done();
        });
    });
    
    it('should handle new line in comment', function(done){
        var js = "/* \n* hi */\ngo();";
        explainjs(js, function(err, results){
            results.sections.length.should.equal(1);
            results.sections[0].comments.should.equal('<p>hi</p>');
            results.sections[0].code.should.equal('go();');
            done();
        });
    });
    
    it('should handle special characters in comment', function(done){
        var js = "/* \n* `hi` */\ngo();";
        explainjs(js, function(err, results){
            results.sections.length.should.equal(1);
            results.sections[0].comments.should.equal('<p><code>hi</code></p>');
            results.sections[0].code.should.equal('go();');
            done();
        });
    });
    

    it('two comments', function(done){
        var js = "/* a */\ngo();\n/* b */\ngo2();";
        explainjs(js, function(err, results){
            results.sections.length.should.equal(2);
            results.sections[0].comments.should.equal('<p>a</p>');
            results.sections[0].code.should.equal('go();');
            results.sections[1].comments.should.equal('<p>b</p>');
            results.sections[1].code.should.equal('go2();');
            done();
        });
    });
    
    it('first comment should enforce newlines', function(done){
        var js = "/* a\nb */\ngo();\n/* a\nb */\ngo2();";
        explainjs(js, function(err, results){
            results.sections.length.should.equal(2);
            results.sections[0].comments.should.equal('<p>a</p> <p>b</p>');
            results.sections[0].code.should.equal('go();');
            results.sections[1].comments.should.equal('<p>a b</p>');
            results.sections[1].code.should.equal('go2();');
            done();
        });
    });
    
    it('retain spaces preceding code', function(done){
        var js = "// hi\n  go();";
        explainjs(js, function(err, results){
            results.sections.length.should.equal(1);
            results.sections[0].comments.should.equal('<p>hi</p>');
            results.sections[0].code.should.equal('  go();');
            done();
        });
    });
    
    it('does not put dangling // in code', function(done){
        var js = "// \ngo();";
        explainjs(js, function(err, results){
            results.sections.length.should.equal(1);
            results.sections[0].comments.should.equal('');
            results.sections[0].code.should.equal('go();');
            done();
        });
    });
    
    it('single linebreak in comment should be ignored', function(done){
        var js = "//a\na();\n/*a\nb*/\nb();";
        explainjs(js, function(err, results){
            results.sections.length.should.equal(2);
            results.sections[1].comments.should.equal('<p>a b</p>');
            results.sections[1].code.should.equal('b();');
            done();
        });
    });
    
    it('retain double linebreak in comment', function(done){
        var js = "//a\na();\n/*a\n\nb*/\nb();";
        explainjs(js, function(err, results){
            results.sections.length.should.equal(2);
            results.sections[1].comments.should.equal('<p>a</p> <p>b</p>');
            results.sections[1].code.should.equal('b();');
            done();
        });
    });
    
    it('retain double linebreak in code', function(done){
        var js = "a();\n\nb();";
        explainjs(js, function(err, results){
            results.sections[0].code.should.equal('a();\n\nb();');
            done();
        });
    });
    
    it('leading newlines are trimmed', function(done){
        var js = "\n//hi";
        explainjs(js, function(err, results){
            results.sections.length.should.equal(1);
            results.sections[0].comments.should.equal('<p>hi</p>');
            done();
        });
    });
    
    it('======= dont dangle on 2nd comment', function(done){
        var js = "//a\n\n/* X\n * ====== */";
        explainjs(js, function(err, results){
            results.sections.length.should.equal(2);
            results.sections[1].comments.should.equal('<h1> X</h1>');
            done();
        });
    });
    
    it('murders trailing bang on start of multi line comment', function(done){
        var js = "/*! \n * X */";
        explainjs(js, function(err, results){
            results.sections.length.should.equal(1);
            results.sections[0].comments.should.equal('<p>X</p>');
            done();
        });
    });
    
    it('converts tabs to 2 spaces', function(done){
        var js = "//hi\n\ta();";
        explainjs(js, function(err, results){
            results.sections[0].code.should.equal('  a();');
            done();
        });
    });
    
    it('retains spaces AFTER a comments whacks', function(done){
        var js = "//    hi\na();";
        explainjs(js, function(err, results){
            results.sections[0].comments.should.equal('<pre><code>hi </code></pre>');
            done();
        });
    });
    
    it('retains spaces AFTER a stars comments', function(done){
        var js = "//x\n\n/*\n *    hi\n */";
        explainjs(js, function(err, results){
            results.sections[1].comments.should.equal('<pre><code>hi </code></pre>');
            done();
        });
    });
    
    it('pukes because of markdown', function(){
        var txt = '[push]';
        var markdown = require('node-markdown').Markdown;
        //var html = markdown(txt);
    });
    
    it('handles HTML in comments', function(done){
        var js = "// <table> \n1;";
        explainjs(js, function(err, results){
            results.sections[0].comments.should.equal('<p>&lt;table&gt; </p>');
            done();
        });
    });
    
    it('forces JSDoc style @properties to newline', function(done){
        var js = "//x\n1;\n//a\n//  @b";
        explainjs(js, function(err, results){
            results.sections[1].comments.should.equal('<p>a</p> <p>@b</p>');
            done();
        });
    });
