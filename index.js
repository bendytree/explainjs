
var markdown = require("node-markdown").Markdown;

module.exports = function(js, callback){
    
    "use strict";
    
    //validate
    if (typeof js === 'undefined' || !js){
        callback('invalid source: script should not be blank');
        return;
    }
    if (typeof js !== 'string'){
        callback('invalid source: script should be a string');
        return;
    }
    
    //replace tabs with spaces
    js = js.replace(/[\t]/g, '  ');
    
    //trim blank lines
    js = js.replace(/^(\n| )+/, '');
                
    // Convert asterisk style comments to whack-whack style.
    js = js.replace(/\/\*!?((?:[^*]|\*+[^*/])*)\*+\//g, function(match, comment){
        comment = comment.replace(/^ *[\r\n]+/g, '')
                         .replace(/^ *[*]+/gm, '')
                         .replace(/[ *]+$/mg, '')
                         .replace(/^ +(?=[=])/igm, '')
                         .replace(/^/mg, '//');
        return comment;
    });
    
    // Now break lines up into sections
    var sections = [],
        lines = js.split(/^/m),
        section = { comments:[], code:[] },
        breakOnNextComment = false,
        lastWasComment = true;
    
    sections.push(section);
    
    for (var i=0; i<lines.length; i++){
                
        var line = lines[i],
            blank = /^[ \r\n]*$/.test(line),
            comment = (line.match(/^ *\/\/(.*)/)||[])[1];
        
        if (blank) {
            if (lastWasComment === false) {
                section.code.push(''); //retain lines between code blocks
            }
            breakOnNextComment = true;
            continue;
        }
        
        if (typeof comment === 'undefined'){
            section.code.push(line.replace(/([ \r\n]+$)/g, ''));
            breakOnNextComment = true;
            lastWasComment = false;
        }else{
            if (breakOnNextComment){
                breakOnNextComment = false;
                section = { comments:[], code:[] };
                sections.push(section);
            }
            section.comments.push(comment);
            lastWasComment = true;
        }
    }
    
    var escapeHtml = function(html){
          return String(html)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');  
    };
        
    //convert comments to markdown
    for (var i=0; i<sections.length; i++){
        var section = sections[i];
        
        var comments = section.comments.join(i===0?'\n\n':'\n');
        try{
            var md = escapeHtml(comments)
                       .replace(/^( *[@])/mg, '\n$1');
            section.comments = markdown(md).replace(/[\n]+/gm,' ');
        }catch(ex){ 
            section.comments = comments;
        }
        section.code = section.code.join('\n');
    }
    
    callback(null, {sections:sections});
};

