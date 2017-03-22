/**
 * A Sierpi´nski triangle SVG generator. 
 *
 * Uses jQuery and FileSaver.js.
 *
 *
 * @author  Ikaros Kappler
 * @date    2017-03-21
 * @version 1.0.0
 **/


$(document).ready( function() {

    var $svg      = $('svg#sierpinski_svg');
    var svgWidth  = $svg.width();
    var svgHeight = $svg.height(); 

    
    
    $( 'button#build' ).click( function() {
	mkSierpinski();
    } );
    $( 'input#auto_update' ).click( function(e) {
	if( $(e.target).is(':checked') )
	    mkSierpinski();
    } );
    $( 'input#iterations' ).change( function() {
	if( $('input#auto_update').is(':checked') )
	    mkSierpinski();
    } );
    $( 'input#size' ).change( function() {
	if( $('input#auto_update').is(':checked') )
	    mkSierpinski();
    } );
    $( 'button#save_svg' ).click( function() {
	saveSVG();
    } );
    $( 'button#show_svg' ).click( function() {
	showSVG();
    } );

    var mkSierpinskiPath = function( position, size, iterations, $g, $pathTemplate, height ) {

	if( iterations > 0 ) {
	    mkSierpinskiPath( { x : position.x - size/4.0, y : position.y + height/4.0 },
			      size/2, iterations-1, $g, $pathTemplate, height/2.0 );
	    
	    mkSierpinskiPath( { x : position.x + size/4.0, y : position.y + height/4.0 },
			      size/2, iterations-1, $g, $pathTemplate, height/2.0 );
	    
	    mkSierpinskiPath( { x : position.x, y : position.y - height/4.0 },
			      size/2, iterations-1, $g, $pathTemplate, height/2.0 );
	    return;
	}


	var $path = $pathTemplate.clone().attr('id',null);
	var data = [];
	
	// Draw triangle:
	//  Move to (absolute)
	data.push( 'M' );
	data.push( position.x - size/2.0 );
	data.push( position.y + height/2.0 );

	data.push( 'L' );
	data.push( position.x );
	data.push( position.y - height/2.0 );

	data.push( 'L' );
	data.push( position.x + size/2.0 );
	data.push( position.y + height/2.0 );
	
	//  Close path
	data.push( 'Z' );

	$path.attr('d',data.join(' '));
	$g.append( $path );
    };

    var mkSierpinski = function() {
	var iterations    = parseInt( $('input#iterations').val() );
	var size          = parseInt( $('input#size').val() );
	var $g            = $svg.find('g');
	var $pathTemplate = $g.find('path#_p_template').first();
	var height        = Math.sqrt(3)/2 * size; // Height of a equilateral triangle :D
	
	// Clear old SVG data
	$g.empty().append( $pathTemplate );
	window.setTimeout( function() {
	    var path = mkSierpinskiPath( { x : svgWidth/2, y : svgHeight/2 },
					 size,
					 iterations,
					 $g,
					 $pathTemplate,
					 height
				       );
	    // Perimeter (length of the outlines) is:
	    //   P(n) = 3^(n + 1) / 2^n
	    $('span#out_length').empty().text( (Math.pow(3,iterations+1) / Math.pow(2,iterations)) * size );
	    // The area is (3/4)^n
	    $('span#out_area').empty().text( Math.pow(0.75,iterations) * (size*height/2) );
	}, 0 );
    };

    var getSVGCode = function() {
	var code = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="' + svgWidth + '" height="' + svgHeight + '">' + "\n" + $svg.html() + "</svg>";
	console.debug( 'SVG=' + code );
	return code;
    };
    
    // This funcions uses FileSaver.js
    var saveSVG = function() {
	var code = getSVGCode();
	var blob = new Blob([code], {type: 'image/svg+xml;charset=utf-8'});
	saveAs( blob, 'sierpinski_s'+$('input#size').val()+'_i'+$('input#iterations').val()+'.svg' );
    };
    
    // This function uses the WebAPIs btoa function.
    var showSVG = function() {
	var code = getSVGCode();
	var b64 = btoa(code);
	var contentType = 'image/svg+xml'; // 'application/xml';
        var a = document.createElement('a');
        var blob = new Blob( [code], { 'type' : contentType } );
	a.href = 'data:' + contentType + ';base64,' + b64;
	a.target = '_blank';
        a.click();
    };
    
    
    mkSierpinski();

} );

