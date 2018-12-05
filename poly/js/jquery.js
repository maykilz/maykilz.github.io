(function(){
/*
 * jQuery @VERSION - New Wave Javascript
 *
 * Copyright (c) 2007 John Resig (jquery.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2007-10-21 01:04:06 +0300 (D, 21 oct. 2007) $
 * $Rev: 3701 $
 */

// Map over jQuery in case of overwrite
if ( window.jQuery )
	var _jQuery = window.jQuery;

var jQuery = window.jQuery = function( selector, context ) {
	// If the context is a namespace object, return a new object
	return this instanceof jQuery ?
		this.init( selector, context ) :
		new jQuery( selector, context );
};

// Map over the $ in case of overwrite
if ( window.$ )
	var _$ = window.$;
	
// Map the jQuery namespace to the '$' one
window.$ = jQuery;

// A simple way to check for HTML strings or ID strings
// (both of which we optimize for)
var quickExpr = /^[^<]*(<(.|\s)+>)[^>]*$|^#(\w+)$/;

jQuery.fn = jQuery.prototype = {
	init: function( selector, context ) {
		// Make sure that a selection was provided
		selector = selector || document;

		// Handle HTML strings
		if ( typeof selector  == "string" ) {
			// Are we dealing with HTML string or an ID?
			var match = quickExpr.exec( selector );

			// Verify a match, and that no context was specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] )
					selector = jQuery.clean( [ match[1] ], context );

				// HANDLE: $("#id")
				else {
					var elem = document.getElementById( match[3] );

					// Make sure an element was located
					if ( elem )
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id != match[3] )
							return jQuery().find( selector );

						// Otherwise, we inject the element directly into the jQuery object
						else {
							this[0] = elem;
							this.length = 1;
							return this;
						}

					else
						selector = [];
				}

			// HANDLE: $(expr, [context])
			// (which is just equivalent to: $(content).find(expr)
			} else
				return new jQuery( context ).find( selector );

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) )
			return new jQuery( document )[ jQuery.fn.ready ? "ready" : "load" ]( selector );

		return this.setArray(
			// HANDLE: $(array)
			selector.constructor == Array && selector ||

			// HANDLE: $(arraylike)
			// Watch for when an array-like object, contains DOM nodes, is passed in as the selector
			(selector.jquery || selector.length && selector != window && !selector.nodeType && selector[0] != undefined && selector[0].nodeType) && jQuery.makeArray( selector ) ||

			// HANDLE: $(*)
			[ selector ] );
	},
	
	// The current version of jQuery being used
	jquery: "@VERSION",

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},
	
	// The number of elements contained in the matched element set
	length: 0,

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == undefined ?

			// Return a 'clean' array
			jQuery.makeArray( this ) :

			// Return just the object
			this[ num ];
	},
	
	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {
		// Build a new jQuery matched element set
		var ret = jQuery( elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},
	
	// Force the current matched set of elements to become
	// the specified array of elements (destroying the stack in the process)
	// You should use pushStack() in order to do this, but maintain the stack
	setArray: function( elems ) {
		// Resetting the length to 0, then using the native Array push
		// is a super-fast way to populate an object with array-like properties
		this.length = 0;
		Array.prototype.push.apply( this, elems );
		
		return this;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	// Determine the position of an element within 
	// the matched set of elements
	index: function( elem ) {
		var ret = -1;

		// Locate the position of the desired element
		this.each(function(i){
			if ( this == elem )
				ret = i;
		});

		return ret;
	},

	attr: function( name, value, type ) {
		var options = name;
		
		// Look for the case where we're accessing a style value
		if ( name.constructor == String )
			if ( value == undefined )
				return this.length && jQuery[ type || "attr" ]( this[0], name ) || undefined;

			else {
				options = {};
				options[ name ] = value;
			}
		
		// Check to see if we're setting style values
		return this.each(function(i){
			// Set all the styles
			for ( name in options )
				jQuery.attr(
					type ?
						this.style :
						this,
					name, jQuery.prop( this, options[ name ], type, i, name )
				);
		});
	},

	css: function( key, value ) {
		return this.attr( key, value, "curCSS" );
	},

	text: function( text ) {
		if ( typeof text != "object" && text != null )
			return this.empty().append( document.createTextNode( text ) );

		var ret = "";

		jQuery.each( text || this, function(){
			jQuery.each( this.childNodes, function(){
				if ( this.nodeType != 8 )
					ret += this.nodeType != 1 ?
						this.nodeValue :
						jQuery.fn.text( [ this ] );
			});
		});

		return ret;
	},

	wrapAll: function( html ) {
		if ( this[0] )
			// The elements to wrap the target around
			jQuery( html, this[0].ownerDocument )
				.clone()
				.insertBefore( this[0] )
				.map(function(){
					var elem = this;

					while ( elem.firstChild )
						elem = elem.firstChild;

					return elem;
				})
				.append(this);

		return this;
	},

	wrapInner: function( html ) {
		return this.each(function(){
			jQuery( this ).contents().wrapAll( html );
		});
	},

	wrap: function( html ) {
		return this.each(function(){
			jQuery( this ).wrapAll( html );
		});
	},

	append: function() {
		return this.domManip(arguments, true, false, function(elem){
			this.appendChild( elem );
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, true, function(elem){
			this.insertBefore( elem, this.firstChild );
		});
	},
	
	before: function() {
		return this.domManip(arguments, false, false, function(elem){
			this.parentNode.insertBefore( elem, this );
		});
	},

	after: function() {
		return this.domManip(arguments, false, true, function(elem){
			this.parentNode.insertBefore( elem, this.nextSibling );
		});
	},

	end: function() {
		return this.prevObject || jQuery( [] );
	},

	find: function( selector ) {
		var elems = jQuery.map(this, function(elem){
			return jQuery.find( selector, elem );
		});

		return this.pushStack( /[^+>] [^+>]/.test( selector ) || selector.indexOf("..") > -1 ?
			jQuery.unique( elems ) :
			elems );
	},

	clone: function( events ) {
		// Do the clone
		var ret = this.map(function(){
			return this.outerHTML ?
				jQuery( this.outerHTML )[0] :
				this.cloneNode( true );
		});

		// Need to set the expando to null on the cloned set if it exists
		// removeData doesn't work here, IE removes it from the original as well
		// this is primarily for IE but the data expando shouldn't be copied over in any browser
		var clone = ret.find("*").andSelf().each(function(){
			if ( this[ expando ] != undefined )
				this[ expando ] = null;
		});
		
		// Copy the events from the original to the clone
		if ( events === true )
			this.find("*").andSelf().each(function(i){
				var events = jQuery.data( this, "events" );

				for ( var type in events )
					for ( var handler in events[ type ] )
						jQuery.event.add( clone[ i ], type, events[ type ][ handler ], events[ type ][ handler ].data );
			});

		// Return the cloned set
		return ret;
	},

	filter: function( selector ) {
		return this.pushStack(
			jQuery.isFunction( selector ) &&
			jQuery.grep(this, function(elem, i){
				return selector.call( elem, i );
			}) ||

			jQuery.multiFilter( selector, this ) );
	},

	not: function( selector ) {
		return this.pushStack(
			selector.constructor == String &&
			jQuery.multiFilter( selector, this, true ) ||

			jQuery.grep(this, function(elem) {
				return selector.constructor == Array || selector.jquery ?
					jQuery.inArray( elem, selector ) < 0 :
					elem != selector;
			}) );
	},

	add: function( selector ) {
		return this.pushStack( jQuery.merge( 
			this.get(),
			selector.constructor == String ? 
				jQuery( selector ).get() :
				selector.length != undefined && (!selector.nodeName || jQuery.nodeName(selector, "form")) ?
					selector : [selector] ) );
	},

	is: function( selector ) {
		return selector ?
			jQuery.multiFilter( selector, this ).length > 0 :
			false;
	},

	hasClass: function( selector ) {
		return this.is( "." + selector );
	},
	
	val: function( value ) {
		if ( value == undefined ) {

			if ( this.length ) {
				var elem = this[0];
		    	
				// We need to handle select boxes special
				if ( jQuery.nodeName( elem, "select" ) ) {
					var index = elem.selectedIndex,
						values = [],
						options = elem.options,
						one = elem.type == "select-one";
					
					// Nothing was selected
					if ( index < 0 )
						return null;

					// Loop through all the selected options
					for ( var i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++ ) {
						var option = options[ i ];

						if ( option.selected ) {
							// Get the specifc value for the option
							value = jQuery.browser.msie && !option.attributes.value.specified ? option.text : option.value;
							
							// We don't need an array for one selects
							if ( one )
								return value;
							
							// Multi-Selects return an array
							values.push( value );
						}
					}
					
					return values;
					
				// Everything else, we just grab the value
				} else
					return this[0].value.replace(/\r/g, "");

			}

		} else
			return this.each(function(){
				if ( value.constructor == Array && /radio|checkbox/.test( this.type ) )
					this.checked = (jQuery.inArray(this.value, value) >= 0 ||
						jQuery.inArray(this.name, value) >= 0);

				else if ( jQuery.nodeName( this, "select" ) ) {
					var values = value.constructor == Array ?
						value :
						[ value ];

					jQuery( "option", this ).each(function(){
						this.selected = (jQuery.inArray( this.value, values ) >= 0 ||
							jQuery.inArray( this.text, values ) >= 0);
					});

					if ( !values.length )
						this.selectedIndex = -1;

				} else
					this.value = value;
			});
	},
	
	html: function( value ) {
		return value == undefined ?
			(this.length ?
				this[0].innerHTML :
				null) :
			this.empty().append( value );
	},

	replaceWith: function( value ) {
		return this.after( value ).remove();
	},

	eq: function( i ) {
		return this.slice( i, i + 1 );
	},

	slice: function() {
		return this.pushStack( Array.prototype.slice.apply( this, arguments ) );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function(elem, i){
			return callback.call( elem, i, elem );
		}));
	},

	andSelf: function() {
		return this.add( this.prevObject );
	},
	
	domManip: function( args, table, reverse, callback ) {
		var clone = this.length > 1, elems; 

		return this.each(function(){
			if ( !elems ) {
				elems = jQuery.clean( args, this.ownerDocument );

				if ( reverse )
					elems.reverse();
			}

			var obj = this;

			if ( table && jQuery.nodeName( this, "table" ) && jQuery.nodeName( elems[0], "tr" ) )
				obj = this.getElementsByTagName("tbody")[0] || this.appendChild( document.createElement("tbody") );

			var scripts = jQuery( [] );

			jQuery.each(elems, function(){
				var elem = clone ?
					this.cloneNode( true ) :
					this;

				if ( jQuery.nodeName( elem, "script" ) ) {

					// If scripts are waiting to be executed, wait on this script as well
					if ( scripts.length )
						scripts = scripts.add( elem );

					// If nothing is waiting to be executed, run immediately
					else
						evalScript( 0, elem );

				} else {
					// Remove any inner scripts for later evaluation
					if ( elem.nodeType == 1 )
						scripts = scripts.add( jQuery( "script", elem ).remove() );

					// Inject the elements into the document
					callback.call( obj, elem );
				}
			});

			scripts.each( evalScript );
		});
	}
};

function evalScript( i, elem ) {
	if ( elem.src )
		jQuery.ajax({
			url: elem.src,
			async: false,
			dataType: "script"
		});

	else
		jQuery.globalEval( elem.text || elem.textContent || elem.innerHTML || "" );

	if ( elem.parentNode )
		elem.parentNode.removeChild( elem );
}

jQuery.extend = jQuery.fn.extend = function() {
	// copy reference to target object
	var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options;

	// Handle a deep copy situation
	if ( target.constructor == Boolean ) {
		deep = target;
		target = arguments[1] || {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length == 1 ) {
		target = this;
		i = 0;
	}

	for ( ; i < length; i++ )
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null )
			// Extend the base object
			for ( var name in options ) {
				// Prevent never-ending loop
				if ( target == options[ name ] )
					continue;

				// Recurse if we're merging object values
				if ( deep && typeof options[ name ] == "object" && target[ name ] && !options[ name ].nodeType )
					jQuery.extend( target[ name ], options[ name ] );

				// Don't bring in undefined values
				else if ( options[ name ] != undefined )
					target[ name ] = options[ name ];

			}

	// Return the modified object
	return target;
};

var expando = "jQuery" + (new Date()).getTime(), uuid = 0, windowData = {};

// exclude the following css properties to add px
var exclude = /z-?index|font-?weight|opacity|zoom|line-?height/i;

jQuery.extend({
	noConflict: function( deep ) {
		window.$ = _$;

		if ( deep )
			window.jQuery = _jQuery;

		return jQuery;
	},

	// This may seem like some crazy code, but trust me when I say that this
	// is the only cross-browser way to do this. --John
	isFunction: function( fn ) {
		return !!fn && typeof fn != "string" && !fn.nodeName && 
			fn.constructor != Array && /function/i.test( fn + "" );
	},
	
	// check if an element is in a (or is an) XML document
	isXMLDoc: function( elem ) {
		return elem.documentElement && !elem.body ||
			elem.tagName && elem.ownerDocument && !elem.ownerDocument.body;
	},

	// Evalulates a script in a global context
	// Evaluates Async. in Safari 2 :-(
	globalEval: function( data ) {
		data = jQuery.trim( data );

		if ( data ) {
			// Inspired by code by Andrea Giammarchi
			// http://webreflection.blogspot.com/2007/08/global-scope-evaluation-and-dom.html
			var head = document.getElementsByTagName("head")[0] || document.documentElement,
				script = document.createElement("script");

			script.type = "text/javascript";
			if ( jQuery.browser.msie )
				script.text = data;
			else
				script.appendChild( document.createTextNode( data ) );

			head.appendChild( script );
			head.removeChild( script );
		}
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() == name.toUpperCase();
	},
	
	cache: {},
	
	data: function( elem, name, data ) {
		elem = elem == window ?
			windowData :
			elem;

		var id = elem[ expando ];

		// Compute a unique ID for the element
		if ( !id ) 
			id = elem[ expando ] = ++uuid;

		// Only generate the data cache if we're
		// trying to access or manipulate it
		if ( name && !jQuery.cache[ id ] )
			jQuery.cache[ id ] = {};
		
		// Prevent overriding the named cache with undefined values
		if ( data != undefined )
			jQuery.cache[ id ][ name ] = data;
		
		// Return the named cache data, or the ID for the element	
		return name ?
			jQuery.cache[ id ][ name ] :
			id;
	},
	
	removeData: function( elem, name ) {
		elem = elem == window ?
			windowData :
			elem;

		var id = elem[ expando ];

		// If we want to remove a specific section of the element's data
		if ( name ) {
			if ( jQuery.cache[ id ] ) {
				// Remove the section of cache data
				delete jQuery.cache[ id ][ name ];

				// If we've removed all the data, remove the element's cache
				name = "";

				for ( name in jQuery.cache[ id ] )
					break;

				if ( !name )
					jQuery.removeData( elem );
			}

		// Otherwise, we want to remove all of the element's data
		} else {
			// Clean up the element expando
			try {
				delete elem[ expando ];
			} catch(e){
				// IE has trouble directly removing the expando
				// but it's ok with using removeAttribute
				if ( elem.removeAttribute )
					elem.removeAttribute( expando );
			}

			// Completely remove the data cache
			delete jQuery.cache[ id ];
		}
	},

	// args is for internal usage only
	each: function( object, callback, args ) {
		if ( args ) {
			if ( object.length == undefined )
				for ( var name in object )
					callback.apply( object[ name ], args );
			else
				for ( var i = 0, length = object.length; i < length; i++ )
					if ( callback.apply( object[ i ], args ) === false )
						break;

		// A special, fast, case for the most common use of each
		} else {
			if ( object.length == undefined )
				for ( var name in object )
					callback.call( object[ name ], name, object[ name ] );
			else
				for ( var i = 0, length = object.length, value = object[0]; 
					i < length && callback.call( value, i, value ) !== false; value = object[++i] ){}
		}

		return object;
	},
	
	prop: function( elem, value, type, i, name ) {
			// Handle executable functions
			if ( jQuery.isFunction( value ) )
				value = value.call( elem, i );
				
			// Handle passing in a number to a CSS property
			return value && value.constructor == Number && type == "curCSS" && !exclude.test( name ) ?
				value + "px" :
				value;
	},

	className: {
		// internal only, use addClass("class")
		add: function( elem, classNames ) {
			jQuery.each((classNames || "").split(/\s+/), function(i, className){
				if ( !jQuery.className.has( elem.className, className ) )
					elem.className += (elem.className ? " " : "") + className;
			});
		},

		// internal only, use removeClass("class")
		remove: function( elem, classNames ) {
			elem.className = classNames != undefined ?
				jQuery.grep(elem.className.split(/\s+/), function(className){
					return !jQuery.className.has( classNames, className );	
				}).join(" ") :
				"";
		},

		// internal only, use is(".class")
		has: function( elem, className ) {
			return jQuery.inArray( className, (elem.className || elem).toString().split(/\s+/) ) > -1;
		}
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback ) {
		// Remember the old values, and insert the new ones
		for ( var name in options ) {
			elem.style[ "old" + name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		callback.call( elem );

		// Revert the old values
		for ( var name in options )
			elem.style[ name ] = elem.style[ "old" + name ];
	},

	css: function( elem, name ) {
		if ( name == "height" || name == "width" ) {
			var old = {}, height, width;

			// Revert the padding and border widths to get the
			// correct height/width values
			jQuery.each([ "Top", "Bottom", "Right", "Left" ], function(){
				old[ "padding" + this ] = 0;
				old[ "border" + this + "Width" ] = 0;
			});

			// Swap out the padding/border values temporarily
			jQuery.swap( elem, old, function() {

				// If the element is visible, then the calculation is easy
				if ( jQuery( elem ).is(":visible") ) {
					height = elem.offsetHeight;
					width = elem.offsetWidth;

				// Otherwise, we need to flip out more values
				} else {
					elem = jQuery( elem.cloneNode(true) )
						.find(":radio").removeAttr("checked").end()
						.css({
							visibility: "hidden",
							position: "absolute",
							display: "block",
							right: "0",
							left: "0"
						}).appendTo( elem.parentNode )[0];

					var position = jQuery.css( elem.parentNode, "position" ) || "static";
					if ( position == "static" )
						elem.parentNode.style.position = "relative";

					height = elem.clientHeight;
					width = elem.clientWidth;

					if ( position == "static" )
						elem.parentNode.style.position = "static";

					elem.parentNode.removeChild( elem );
				}
			});

			return name == "height" ?
				height :
				width;
		}

		return jQuery.curCSS( elem, name );
	},

	curCSS: function( elem, name, force ) {
		var ret;

		// A helper method for determining if an element's values are broken
		function color( elem ) {
			if ( !jQuery.browser.safari )
				return false;

			var ret = document.defaultView.getComputedStyle( elem, null );
			return !ret || ret.getPropertyValue("color") == "";
		}

		// We need to handle opacity special in IE
		if ( name == "opacity" && jQuery.browser.msie ) {
			ret = jQuery.attr( elem.style, "opacity" );

			return ret == "" ?
				"1" :
				ret;
		}
		
		// Make sure we're using the right name for getting the float value
		if ( name.match( /float/i ) )
			name = styleFloat;

		if ( !force && elem.style[ name ] )
			ret = elem.style[ name ];

		else if ( document.defaultView && document.defaultView.getComputedStyle ) {

			// Only "float" is needed here
			if ( name.match( /float/i ) )
				name = "float";

			name = name.replace( /([A-Z])/g, "-$1" ).toLowerCase();

			var getComputedStyle = document.defaultView.getComputedStyle( elem, null );

			if ( getComputedStyle && !color( elem ) )
				ret = getComputedStyle.getPropertyValue( name );

			// If the element isn't reporting its values properly in Safari
			// then some display: none elements are involved
			else {
				var swap = [], stack = [];

				// Locate all of the parent display: none elements
				for ( var a = elem; a && color(a); a = a.parentNode )
					stack.unshift(a);

				// Go through and make them visible, but in reverse
				// (It would be better if we knew the exact display type that they had)
				for ( var i = 0; i < stack.length; i++ )
					if ( color( stack[ i ] ) ) {
						swap[ i ] = stack[ i ].style.display;
						stack[ i ].style.display = "block";
					}

				// Since we flip the display style, we have to handle that
				// one special, otherwise get the value
				ret = name == "display" && swap[ stack.length - 1 ] != null ?
					"none" :
					( getComputedStyle && getComputedStyle.getPropertyValue( name ) ) || "";

				// Finally, revert the display styles back
				for ( var i = 0; i < swap.length; i++ )
					if ( swap[ i ] != null )
						stack[ i ].style.display = swap[ i ];
			}

			// We should always get a number back from opacity
			if ( name == "opacity" && ret == "" )
				ret = "1";

		} else if ( elem.currentStyle ) {
			var camelCase = name.replace(/\-(\w)/g, function(all, letter){
				return letter.toUpperCase();
			});

			ret = elem.currentStyle[ name ] || elem.currentStyle[ camelCase ];

			// From the awesome hack by Dean Edwards
			// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

			// If we're not dealing with a regular pixel number
			// but a number that has a weird ending, we need to convert it to pixels
			if ( !/^\d+(px)?$/i.test( ret ) && /^\d/.test( ret ) ) {
				// Remember the original values
				var style = elem.style.left, runtimeStyle = elem.runtimeStyle.left;

				// Put in the new values to get a computed value out
				elem.runtimeStyle.left = elem.currentStyle.left;
				elem.style.left = ret || 0;
				ret = elem.style.pixelLeft + "px";

				// Revert the changed values
				elem.style.left = style;
				elem.runtimeStyle.left = runtimeStyle;
			}
		}

		return ret;
	},
	
	clean: function( elems, context ) {
		var ret = [];
		context = context || document;

		jQuery.each(elems, function(i, elem){
			if ( !elem )
				return;

			if ( elem.constructor == Number )
				elem = elem.toString();
			
			// Convert html string into DOM nodes
			if ( typeof elem == "string" ) {
				// Fix "XHTML"-style tags in all browsers
				elem = elem.replace(/(<(\w+)[^>]*?)\/>/g, function(all, front, tag){
					return tag.match(/^(abbr|br|col|img|input|link|meta|param|hr|area)$/i) ?
						all :
						front + "></" + tag + ">";
				});

				// Trim whitespace, otherwise indexOf won't work as expected
				var tags = jQuery.trim( elem ).toLowerCase(), div = context.createElement("div");

				var wrap =
					// option or optgroup
					!tags.indexOf("<opt") &&
					[ 1, "<select>", "</select>" ] ||
					
					!tags.indexOf("<leg") &&
					[ 1, "<fieldset>", "</fieldset>" ] ||
					
					tags.match(/^<(thead|tbody|tfoot|colg|cap)/) &&
					[ 1, "<table>", "</table>" ] ||
					
					!tags.indexOf("<tr") &&
					[ 2, "<table><tbody>", "</tbody></table>" ] ||
					
				 	// <thead> matched above
					(!tags.indexOf("<td") || !tags.indexOf("<th")) &&
					[ 3, "<table><tbody><tr>", "</tr></tbody></table>" ] ||
					
					!tags.indexOf("<col") &&
					[ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ] ||

					// IE can't serialize <link> and <script> tags normally
					jQuery.browser.msie &&
					[ 1, "div<div>", "</div>" ] ||
					
					[ 0, "", "" ];

				// Go to html and back, then peel off extra wrappers
				div.innerHTML = wrap[1] + elem + wrap[2];
				
				// Move to the right depth
				while ( wrap[0]-- )
					div = div.lastChild;
				
				// Remove IE's autoinserted <tbody> from table fragments
				if ( jQuery.browser.msie ) {
					
					// String was a <table>, *may* have spurious <tbody>
					var tbody = !tags.indexOf("<table") && tags.indexOf("<tbody") < 0 ?
						div.firstChild && div.firstChild.childNodes :
						
						// String was a bare <thead> or <tfoot>
						wrap[1] == "<table>" && tags.indexOf("<tbody") < 0 ?
							div.childNodes :
							[];
				
					for ( var i = tbody.length - 1; i >= 0 ; --i )
						if ( jQuery.nodeName( tbody[ i ], "tbody" ) && !tbody[ i ].childNodes.length )
							tbody[ i ].parentNode.removeChild( tbody[ i ] );
					
					// IE completely kills leading whitespace when innerHTML is used	
					if ( /^\s/.test( elem ) )	
						div.insertBefore( context.createTextNode( elem.match(/^\s*/)[0] ), div.firstChild );
				
				}
				
				elem = jQuery.makeArray( div.childNodes );
			}

			if ( elem.length === 0 && (!jQuery.nodeName( elem, "form" ) && !jQuery.nodeName( elem, "select" )) )
				return;

			if ( elem[0] == undefined || jQuery.nodeName( elem, "form" ) || elem.options )
				ret.push( elem );

			else
				ret = jQuery.merge( ret, elem );

		});

		return ret;
	},
	
	attr: function( elem, name, value ) {
		var fix = jQuery.isXMLDoc( elem ) ?
			{} :
			jQuery.props;

		// Safari mis-reports the default selected property of a hidden option
		// Accessing the parent's selectedIndex property fixes it
		if ( name == "selected" && jQuery.browser.safari )
			elem.parentNode.selectedIndex;
		
		// Certain attributes only work when accessed via the old DOM 0 way
		if ( fix[ name ] ) {
			if ( value != undefined )
				elem[ fix[ name ] ] = value;

			return elem[ fix[ name ] ];

		} else if ( jQuery.browser.msie && name == "style" )
			return jQuery.attr( elem.style, "cssText", value );

		else if ( value == undefined && jQuery.browser.msie && jQuery.nodeName( elem, "form" ) && (name == "action" || name == "method") )
			return elem.getAttributeNode( name ).nodeValue;

		// IE elem.getAttribute passes even for style
		else if ( elem.tagName ) {

			if ( value != undefined ) {
				// We can't allow the type property to be changed (since it causes problems in IE)
				if ( name == "type" && jQuery.nodeName( elem, "input" ) && elem.parentNode )
					throw "type property can't be changed";

				elem.setAttribute( name, value );
			}

			if ( jQuery.browser.msie && /href|src/.test( name ) && !jQuery.isXMLDoc( elem ) ) 
				return elem.getAttribute( name, 2 );

			return elem.getAttribute( name );

		// elem is actually elem.style ... set the style
		} else {
			// IE actually uses filters for opacity
			if ( name == "opacity" && jQuery.browser.msie ) {
				if ( value != undefined ) {
					// IE has trouble with opacity if it does not have layout
					// Force it by setting the zoom level
					elem.zoom = 1; 
	
					// Set the alpha filter to set the opacity
					elem.filter = (elem.filter || "").replace( /alpha\([^)]*\)/, "" ) +
						(parseFloat( value ).toString() == "NaN" ? "" : "alpha(opacity=" + value * 100 + ")");
				}
	
				return elem.filter ? 
					(parseFloat( elem.filter.match(/opacity=([^)]*)/)[1] ) / 100).toString() :
					"";
			}

			name = name.replace(/-([a-z])/ig, function(all, letter){
				return letter.toUpperCase();
			});

			if ( value != undefined )
				elem[ name ] = value;

			return elem[ name ];
		}
	},
	
	trim: function( text ) {
		return (text || "").replace( /^\s+|\s+$/g, "" );
	},

	makeArray: function( array ) {
		var ret = [];

		// Need to use typeof to fight Safari childNodes crashes
		if ( typeof array != "array" )
			for ( var i = 0, length = array.length; i < length; i++ )
				ret.push( array[ i ] );
		else
			ret = array.slice( 0 );

		return ret;
	},

	inArray: function( elem, array ) {
		for ( var i = 0, length = array.length; i < length; i++ )
			if ( array[ i ] == elem )
				return i;

		return -1;
	},

	merge: function( first, second ) {
		// We have to loop this way because IE & Opera overwrite the length
		// expando of getElementsByTagName

		// Also, we need to make sure that the correct elements are being returned
		// (IE returns comment nodes in a '*' query)
		if ( jQuery.browser.msie ) {
			for ( var i = 0; second[ i ]; i++ )
				if ( second[ i ].nodeType != 8 )
					first.push( second[ i ] );

		} else
			for ( var i = 0; second[ i ]; i++ )
				first.push( second[ i ] );

		return first;
	},

	unique: function( array ) {
		var ret = [], done = {};

		try {

			for ( var i = 0, length = array.length; i < length; i++ ) {
				var id = jQuery.data( array[ i ] );

				if ( !done[ id ] ) {
					done[ id ] = true;
					ret.push( array[ i ] );
				}
			}

		} catch( e ) {
			ret = array;
		}

		return ret;
	},

	grep: function( elems, callback, inv ) {
		// If a string is passed in for the function, make a function
		// for it (a handy shortcut)
		if ( typeof callback == "string" )
			callback = eval("false||function(a,i){return " + callback + "}");

		var ret = [];

		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0, length = elems.length; i < length; i++ )
			if ( !inv && callback( elems[ i ], i ) || inv && !callback( elems[ i ], i ) )
				ret.push( elems[ i ] );

		return ret;
	},

	map: function( elems, callback ) {
		var ret = [];

		// Go through the array, translating each of the items to their
		// new value (or values).
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			var value = callback( elems[ i ], i );

			if ( value !== null && value != undefined ) {
				if ( value.constructor != Array )
					value = [ value ];

				ret = ret.concat( value );
			}
		}

		return ret;
	}
});

var userAgent = navigator.userAgent.toLowerCase();

// Figure out what browser is being used
jQuery.browser = {
	version: (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [])[1],
	safari: /webkit/.test( userAgent ),
	opera: /opera/.test( userAgent ),
	msie: /msie/.test( userAgent ) && !/opera/.test( userAgent ),
	mozilla: /mozilla/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent )
};

var styleFloat = jQuery.browser.msie ?
	"styleFloat" :
	"cssFloat";
	
jQuery.extend({
	// Check to see if the W3C box model is being used
	boxModel: !jQuery.browser.msie || document.compatMode == "CSS1Compat",
	
	props: {
		"for": "htmlFor",
		"class": "className",
		"float": styleFloat,
		cssFloat: styleFloat,
		styleFloat: styleFloat,
		innerHTML: "innerHTML",
		className: "className",
		value: "value",
		disabled: "disabled",
		checked: "checked",
		readonly: "readOnly",
		selected: "selected",
		maxlength: "maxLength",
		selectedIndex: "selectedIndex"
	}
});

jQuery.each({
	parent: "elem.parentNode",
	parents: "jQuery.dir(elem,'parentNode')",
	next: "jQuery.nth(elem,2,'nextSibling')",
	prev: "jQuery.nth(elem,2,'previousSibling')",
	nextAll: "jQuery.dir(elem,'nextSibling')",
	prevAll: "jQuery.dir(elem,'previousSibling')",
	siblings: "jQuery.sibling(elem.parentNode.firstChild,elem)",
	children: "jQuery.sibling(elem.firstChild)",
	contents: "jQuery.nodeName(elem,'iframe')?elem.contentDocument||elem.contentWindow.document:jQuery.makeArray(elem.childNodes)"
}, function(name, fn){
	fn = eval("false||function(elem){return " + fn + "}");

	jQuery.fn[ name ] = function( selector ) {
		var ret = jQuery.map( this, fn );

		if ( selector && typeof selector == "string" )
			ret = jQuery.multiFilter( selector, ret );

		return this.pushStack( jQuery.unique( ret ) );
	};
});

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function(name, original){
	jQuery.fn[ name ] = function() {
		var args = arguments;

		return this.each(function(){
			for ( var i = 0, length = args.length; i < length; i++ )
				jQuery( args[ i ] )[ original ]( this );
		});
	};
});

jQuery.each({
	removeAttr: function( name ) {
		jQuery.attr( this, name, "" );
		this.removeAttribute( name );
	},

	addClass: function( classNames ) {
		jQuery.className.add( this, classNames );
	},

	removeClass: function( classNames ) {
		jQuery.className.remove( this, classNames );
	},

	toggleClass: function( classNames ) {
		jQuery.className[ jQuery.className.has( this, classNames ) ? "remove" : "add" ]( this, classNames );
	},

	remove: function( selector ) {
		if ( !selector || jQuery.filter( selector, [ this ] ).r.length ) {
			// Prevent memory leaks
			jQuery( "*", this ).add(this).each(function(){
				jQuery.event.remove(this);
				jQuery.removeData(this);
			});
			this.parentNode.removeChild( this );
		}
	},

	empty: function() {
		// Remove element nodes and prevent memory leaks
		jQuery( ">*", this ).remove();
		
		// Remove any remaining nodes
		while ( this.firstChild )
			this.removeChild( this.firstChild );
	}
}, function(name, fn){
	jQuery.fn[ name ] = function(){
		return this.each( fn, arguments );
	};
});

jQuery.each([ "Height", "Width" ], function(i, name){
	var type = name.toLowerCase();
	
	jQuery.fn[ type ] = function( size ) {
		// Get window width or height
		return this[0] == window ?
			// Opera reports document.body.client[Width/Height] properly in both quirks and standards
			jQuery.browser.opera && document.body[ "client" + name ] || 
			
			// Safari reports inner[Width/Height] just fine (Mozilla and Opera include scroll bar widths)
			jQuery.browser.safari && window[ "inner" + name ] ||
			
			// Everyone else use document.documentElement or document.body depending on Quirks vs Standards mode
			document.compatMode == "CSS1Compat" && document.documentElement[ "client" + name ] || document.body[ "client" + name ] :
		
			// Get document width or height
			this[0] == document ?
				// Either scroll[Width/Height] or offset[Width/Height], whichever is greater (Mozilla reports scrollWidth the same as offsetWidth)
				Math.max( document.body[ "scroll" + name ], document.body[ "offset" + name ] ) :
        
				// Get or set width or height on the element
				size == undefined ?
					// Get width or height on the element
					(this.length ? jQuery.css( this[0], type ) : null) :

					// Set the width or height on the element (default to pixels if value is unitless)
					this.css( type, size.constructor == String ? size : size + "px" );
	};
});

var chars = jQuery.browser.safari && parseInt(jQuery.browser.version) < 417 ?
		"(?:[\\w*_-]|\\\\.)" :
		"(?:[\\w\u0128-\uFFFF*_-]|\\\\.)",
	quickChild = new RegExp("^>\\s*(" + chars + "+)"),
	quickID = new RegExp("^(" + chars + "+)(#)(" + chars + "+)"),
	quickClass = new RegExp("^([#.]?)(" + chars + "*)");

jQuery.extend({
	expr: {
		"": "m[2]=='*'||jQuery.nodeName(a,m[2])",
		"#": "a.getAttribute('id')==m[2]",
		":": {
			// Position Checks
			lt: "i<m[3]-0",
			gt: "i>m[3]-0",
			nth: "m[3]-0==i",
			eq: "m[3]-0==i",
			first: "i==0",
			last: "i==r.length-1",
			even: "i%2==0",
			odd: "i%2",

			// Child Checks
			"first-child": "a.parentNode.getElementsByTagName('*')[0]==a",
			"last-child": "jQuery.nth(a.parentNode.lastChild,1,'previousSibling')==a",
			"only-child": "!jQuery.nth(a.parentNode.lastChild,2,'previousSibling')",

			// Parent Checks
			parent: "a.firstChild",
			empty: "!a.firstChild",

			// Text Check
			contains: "(a.textContent||a.innerText||jQuery(a).text()||'').indexOf(m[3])>=0",

			// Visibility
			visible: '"hidden"!=a.type&&jQuery.css(a,"display")!="none"&&jQuery.css(a,"visibility")!="hidden"',
			hidden: '"hidden"==a.type||jQuery.css(a,"display")=="none"||jQuery.css(a,"visibility")=="hidden"',

			// Form attributes
			enabled: "!a.disabled",
			disabled: "a.disabled",
			checked: "a.checked",
			selected: "a.selected||jQuery.attr(a,'selected')",

			// Form elements
			text: "'text'==a.type",
			radio: "'radio'==a.type",
			checkbox: "'checkbox'==a.type",
			file: "'file'==a.type",
			password: "'password'==a.type",
			submit: "'submit'==a.type",
			image: "'image'==a.type",
			reset: "'reset'==a.type",
			button: '"button"==a.type||jQuery.nodeName(a,"button")',
			input: "/input|select|textarea|button/i.test(a.nodeName)",

			// :has()
			has: "jQuery.find(m[3],a).length",

			// :header
			header: "/h\\d/i.test(a.nodeName)",

			// :animated
			animated: "jQuery.grep(jQuery.timers,function(fn){return a==fn.elem;}).length"
		}
	},
	
	// The regular expressions that power the parsing engine
	parse: [
		// Match: [@value='test'], [@foo]
		/^(\[) *@?([\w-]+) *([!*$^~=]*) *('?"?)(.*?)\4 *\]/,

		// Match: :contains('foo')
		/^(:)([\w-]+)\("?'?(.*?(\(.*?\))?[^(]*?)"?'?\)/,

		// Match: :even, :last-chlid, #id, .class
		new RegExp("^([:.#]*)(" + chars + "+)")
	],

	multiFilter: function( expr, elems, not ) {
		var old, cur = [];

		while ( expr && expr != old ) {
			old = expr;
			var f = jQuery.filter( expr, elems, not );
			expr = f.t.replace(/^\s*,\s*/, "" );
			cur = not ? elems = f.r : jQuery.merge( cur, f.r );
		}

		return cur;
	},

	find: function( t, context ) {
		// Quickly handle non-string expressions
		if ( typeof t != "string" )
			return [ t ];

		// Make sure that the context is a DOM Element
		if ( context && !context.nodeType )
			context = null;

		// Set the correct context (if none is provided)
		context = context || document;

		// Initialize the search
		var ret = [context], done = [], last;

		// Continue while a selector expression exists, and while
		// we're no longer looping upon ourselves
		while ( t && last != t ) {
			var r = [];
			last = t;

			t = jQuery.trim(t);

			var foundToken = false;

			// An attempt at speeding up child selectors that
			// point to a specific element tag
			var re = quickChild;
			var m = re.exec(t);

			if ( m ) {
				var nodeName = m[1].toUpperCase();

				// Perform our own iteration and filter
				for ( var i = 0; ret[i]; i++ )
					for ( var c = ret[i].firstChild; c; c = c.nextSibling )
						if ( c.nodeType == 1 && (nodeName == "*" || c.nodeName.toUpperCase() == nodeName.toUpperCase()) )
							r.push( c );

				ret = r;
				t = t.replace( re, "" );
				if ( t.indexOf(" ") == 0 ) continue;
				foundToken = true;
			} else {
				re = /^([>+~])\s*(\w*)/i;

				if ( (m = re.exec(t)) != null ) {
					r = [];

					var nodeName = m[2], merge = {};
					m = m[1];

					for ( var j = 0, rl = ret.length; j < rl; j++ ) {
						var n = m == "~" || m == "+" ? ret[j].nextSibling : ret[j].firstChild;
						for ( ; n; n = n.nextSibling )
							if ( n.nodeType == 1 ) {
								var id = jQuery.data(n);

								if ( m == "~" && merge[id] ) break;
								
								if (!nodeName || n.nodeName.toUpperCase() == nodeName.toUpperCase() ) {
									if ( m == "~" ) merge[id] = true;
									r.push( n );
								}
								
								if ( m == "+" ) break;
							}
					}

					ret = r;

					// And remove the token
					t = jQuery.trim( t.replace( re, "" ) );
					foundToken = true;
				}
			}

			// See if there's still an expression, and that we haven't already
			// matched a token
			if ( t && !foundToken ) {
				// Handle multiple expressions
				if ( !t.indexOf(",") ) {
					// Clean the result set
					if ( context == ret[0] ) ret.shift();

					// Merge the result sets
					done = jQuery.merge( done, ret );

					// Reset the context
					r = ret = [context];

					// Touch up the selector string
					t = " " + t.substr(1,t.length);

				} else {
					// Optimize for the case nodeName#idName
					var re2 = quickID;
					var m = re2.exec(t);
					
					// Re-organize the results, so that they're consistent
					if ( m ) {
					   m = [ 0, m[2], m[3], m[1] ];

					} else {
						// Otherwise, do a traditional filter check for
						// ID, class, and element selectors
						re2 = quickClass;
						m = re2.exec(t);
					}

					m[2] = m[2].replace(/\\/g, "");

					var elem = ret[ret.length-1];

					// Try to do a global search by ID, where we can
					if ( m[1] == "#" && elem && elem.getElementById && !jQuery.isXMLDoc(elem) ) {
						// Optimization for HTML document case
						var oid = elem.getElementById(m[2]);
						
						// Do a quick check for the existence of the actual ID attribute
						// to avoid selecting by the name attribute in IE
						// also check to insure id is a string to avoid selecting an element with the name of 'id' inside a form
						if ( (jQuery.browser.msie||jQuery.browser.opera) && oid && typeof oid.id == "string" && oid.id != m[2] )
							oid = jQuery('[@id="'+m[2]+'"]', elem)[0];

						// Do a quick check for node name (where applicable) so
						// that div#foo searches will be really fast
						ret = r = oid && (!m[3] || jQuery.nodeName(oid, m[3])) ? [oid] : [];
					} else {
						// We need to find all descendant elements
						for ( var i = 0; ret[i]; i++ ) {
							// Grab the tag name being searched for
							var tag = m[1] == "#" && m[3] ? m[3] : m[1] != "" || m[0] == "" ? "*" : m[2];

							// Handle IE7 being really dumb about <object>s
							if ( tag == "*" && ret[i].nodeName.toLowerCase() == "object" )
								tag = "param";

							r = jQuery.merge( r, ret[i].getElementsByTagName( tag ));
						}

						// It's faster to filter by class and be done with it
						if ( m[1] == "." )
							r = jQuery.classFilter( r, m[2] );

						// Same with ID filtering
						if ( m[1] == "#" ) {
							var tmp = [];

							// Try to find the element with the ID
							for ( var i = 0; r[i]; i++ )
								if ( r[i].getAttribute("id") == m[2] ) {
									tmp = [ r[i] ];
									break;
								}

							r = tmp;
						}

						ret = r;
					}

					t = t.replace( re2, "" );
				}

			}

			// If a selector string still exists
			if ( t ) {
				// Attempt to filter it
				var val = jQuery.filter(t,r);
				ret = r = val.r;
				t = jQuery.trim(val.t);
			}
		}

		// An error occurred with the selector;
		// just return an empty set instead
		if ( t )
			ret = [];

		// Remove the root context
		if ( ret && context == ret[0] )
			ret.shift();

		// And combine the results
		done = jQuery.merge( done, ret );

		return done;
	},

	classFilter: function(r,m,not){
		m = " " + m + " ";
		var tmp = [];
		for ( var i = 0; r[i]; i++ ) {
			var pass = (" " + r[i].className + " ").indexOf( m ) >= 0;
			if ( !not && pass || not && !pass )
				tmp.push( r[i] );
		}
		return tmp;
	},

	filter: function(t,r,not) {
		var last;

		// Look for common filter expressions
		while ( t  && t != last ) {
			last = t;

			var p = jQuery.parse, m;

			for ( var i = 0; p[i]; i++ ) {
				m = p[i].exec( t );

				if ( m ) {
					// Remove what we just matched
					t = t.substring( m[0].length );

					m[2] = m[2].replace(/\\/g, "");
					break;
				}
			}

			if ( !m )
				break;

			// :not() is a special case that can be optimized by
			// keeping it out of the expression list
			if ( m[1] == ":" && m[2] == "not" )
				r = jQuery.filter(m[3], r, true).r;

			// We can get a big speed boost by filtering by class here
			else if ( m[1] == "." )
				r = jQuery.classFilter(r, m[2], not);

			else if ( m[1] == "[" ) {
				var tmp = [], type = m[3];
				
				for ( var i = 0, rl = r.length; i < rl; i++ ) {
					var a = r[i], z = a[ jQuery.props[m[2]] || m[2] ];
					
					if ( z == null || /href|src|selected/.test(m[2]) )
						z = jQuery.attr(a,m[2]) || '';

					if ( (type == "" && !!z ||
						 type == "=" && z == m[5] ||
						 type == "!=" && z != m[5] ||
						 type == "^=" && z && !z.indexOf(m[5]) ||
						 type == "$=" && z.substr(z.length - m[5].length) == m[5] ||
						 (type == "*=" || type == "~=") && z.indexOf(m[5]) >= 0) ^ not )
							tmp.push( a );
				}
				
				r = tmp;

			// We can get a speed boost by handling nth-child here
			} else if ( m[1] == ":" && m[2] == "nth-child" ) {
				var merge = {}, tmp = [],
					test = /(\d*)n\+?(\d*)/.exec(
						m[3] == "even" && "2n" || m[3] == "odd" && "2n+1" ||
						!/\D/.test(m[3]) && "n+" + m[3] || m[3]),
					first = (test[1] || 1) - 0, last = test[2] - 0;

				for ( var i = 0, rl = r.length; i < rl; i++ ) {
					var node = r[i], parentNode = node.parentNode, id = jQuery.data(parentNode);

					if ( !merge[id] ) {
						var c = 1;

						for ( var n = parentNode.firstChild; n; n = n.nextSibling )
							if ( n.nodeType == 1 )
								n.nodeIndex = c++;

						merge[id] = true;
					}

					var add = false;

					if ( first == 1 ) {
						if ( last == 0 || node.nodeIndex == last )
							add = true;
					} else if ( (node.nodeIndex + last) % first == 0 )
						add = true;

					if ( add ^ not )
						tmp.push( node );
				}

				r = tmp;

			// Otherwise, find the expression to execute
			} else {
				var f = jQuery.expr[m[1]];
				if ( typeof f != "string" )
					f = jQuery.expr[m[1]][m[2]];

				// Build a custom macro to enclose it
				f = eval("false||function(a,i){return " + f + "}");

				// Execute it against the current filter
				r = jQuery.grep( r, f, not );
			}
		}

		// Return an array of filtered elements (r)
		// and the modified expression string (t)
		return { r: r, t: t };
	},

	dir: function( elem, dir ){
		var matched = [];
		var cur = elem[dir];
		while ( cur && cur != document ) {
			if ( cur.nodeType == 1 )
				matched.push( cur );
			cur = cur[dir];
		}
		return matched;
	},
	
	nth: function(cur,result,dir,elem){
		result = result || 1;
		var num = 0;

		for ( ; cur; cur = cur[dir] )
			if ( cur.nodeType == 1 && ++num == result )
				break;

		return cur;
	},
	
	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType == 1 && (!elem || n != elem) )
				r.push( n );
		}

		return r;
	}
});
/*
 * A number of helper functions used for managing events.
 * Many of the ideas behind this code orignated from 
 * Dean Edwards' addEvent library.
 */
jQuery.event = {

	// Bind an event to an element
	// Original by Dean Edwards
	add: function(element, type, handler, data) {
		// For whatever reason, IE has trouble passing the window object
		// around, causing it to be cloned in the process
		if ( jQuery.browser.msie && element.setInterval != undefined )
			element = window;

		// Make sure that the function being executed has a unique ID
		if ( !handler.guid )
			handler.guid = this.guid++;
			
		// if data is passed, bind to handler 
		if( data != undefined ) { 
        		// Create temporary function pointer to original handler 
			var fn = handler; 

			// Create unique handler function, wrapped around original handler 
			handler = function() { 
				// Pass arguments and context to original handler 
				return fn.apply(this, arguments); 
			};

			// Store data in unique handler 
			handler.data = data;

			// Set the guid of unique handler to the same of original handler, so it can be removed 
			handler.guid = fn.guid;
		}

		// Namespaced event handlers
		var parts = type.split(".");
		type = parts[0];
		handler.type = parts[1];

		// Init the element's event structure
		var events = jQuery.data(element, "events") || jQuery.data(element, "events", {});
		
		var handle = jQuery.data(element, "handle") || jQuery.data(element, "handle", function(){
			// returned undefined or false
			var val;

			// Handle the second event of a trigger and when
			// an event is called after a page has unloaded
			if ( typeof jQuery == "undefined" || jQuery.event.triggered )
				return val;
			
			val = jQuery.event.handle.apply(element, arguments);
			
			return val;
		});

		// Get the current list of functions bound to this event
		var handlers = events[type];

		// Init the event handler queue
		if (!handlers) {
			handlers = events[type] = {};	
			
			// And bind the global event handler to the element
			if (element.addEventListener)
				element.addEventListener(type, handle, false);
			else
				element.attachEvent("on" + type, handle);
		}

		// Add the function to the element's handler list
		handlers[handler.guid] = handler;

		// Keep track of which events have been used, for global triggering
		this.global[type] = true;
	},

	guid: 1,
	global: {},

	// Detach an event or set of events from an element
	remove: function(element, type, handler) {
		var events = jQuery.data(element, "events"), ret, index;

		// Namespaced event handlers
		if ( typeof type == "string" ) {
			var parts = type.split(".");
			type = parts[0];
		}

		if ( events ) {
			// type is actually an event object here
			if ( type && type.type ) {
				handler = type.handler;
				type = type.type;
			}
			
			if ( !type ) {
				for ( type in events )
					this.remove( element, type );

			} else if ( events[type] ) {
				// remove the given handler for the given type
				if ( handler )
					delete events[type][handler.guid];
				
				// remove all handlers for the given type
				else
					for ( handler in events[type] )
						// Handle the removal of namespaced events
						if ( !parts[1] || events[type][handler].type == parts[1] )
							delete events[type][handler];

				// remove generic event handler if no more handlers exist
				for ( ret in events[type] ) break;
				if ( !ret ) {
					if (element.removeEventListener)
						element.removeEventListener(type, jQuery.data(element, "handle"), false);
					else
						element.detachEvent("on" + type, jQuery.data(element, "handle"));
					ret = null;
					delete events[type];
				}
			}

			// Remove the expando if it's no longer used
			for ( ret in events ) break;
			if ( !ret ) {
				jQuery.removeData( element, "events" );
				jQuery.removeData( element, "handle" );
			}
		}
	},

	trigger: function(type, data, element, donative, extra) {
		// Clone the incoming data, if any
		data = jQuery.makeArray(data || []);

		// Handle a global trigger
		if ( !element ) {
			// Only trigger if we've ever bound an event for it
			if ( this.global[type] )
				jQuery("*").add([window, document]).trigger(type, data);

		// Handle triggering a single element
		} else {
			var val, ret, fn = jQuery.isFunction( element[ type ] || null ),
				// Check to see if we need to provide a fake event, or not
				event = !data[0] || !data[0].preventDefault;
			
			// Pass along a fake event
			if ( event )
				data.unshift( this.fix({ type: type, target: element }) );

			// Enforce the right trigger type
			data[0].type = type;

			// Trigger the event
			if ( jQuery.isFunction( jQuery.data(element, "handle") ) )
				val = jQuery.data(element, "handle").apply( element, data );

			// Handle triggering native .onfoo handlers
			if ( !fn && element["on"+type] && element["on"+type].apply( element, data ) === false )
				val = false;

			// Extra functions don't get the custom event object
			if ( event )
				data.shift();

			// Handle triggering of extra function
			if ( extra && extra.apply( element, data ) === false )
				val = false;

			// Trigger the native events (except for clicks on links)
			if ( fn && donative !== false && val !== false && !(jQuery.nodeName(element, 'a') && type == "click") ) {
				this.triggered = true;
				element[ type ]();
			}

			this.triggered = false;
		}

		return val;
	},

	handle: function(event) {
		// returned undefined or false
		var val;

		// Empty object is for triggered events with no data
		event = jQuery.event.fix( event || window.event || {} ); 

		// Namespaced event handlers
		var parts = event.type.split(".");
		event.type = parts[0];

		var handlers = jQuery.data(this, "events") && jQuery.data(this, "events")[event.type], args = Array.prototype.slice.call( arguments, 1 );
		args.unshift( event );

		for ( var j in handlers ) {
			var handler = handlers[j];
			// Pass in a reference to the handler function itself
			// So that we can later remove it
			args[0].handler = handler;
			args[0].data = handler.data;

			// Filter the functions by class
			if ( !parts[1] || handler.type == parts[1] ) {
				var ret = handler.apply( this, args );

				if ( val !== false )
					val = ret;

				if ( ret === false ) {
					event.preventDefault();
					event.stopPropagation();
				}
			}
		}

		// Clean up added properties in IE to prevent memory leak
		if (jQuery.browser.msie)
			event.target = event.preventDefault = event.stopPropagation =
				event.handler = event.data = null;

		return val;
	},

	fix: function(event) {
		// store a copy of the original event object 
		// and clone to set read-only properties
		var originalEvent = event;
		event = jQuery.extend({}, originalEvent);
		
		// add preventDefault and stopPropagation since 
		// they will not work on the clone
		event.preventDefault = function() {
			// if preventDefault exists run it on the original event
			if (originalEvent.preventDefault)
				originalEvent.preventDefault();
			// otherwise set the returnValue property of the original event to false (IE)
			originalEvent.returnValue = false;
		};
		event.stopPropagation = function() {
			// if stopPropagation exists run it on the original event
			if (originalEvent.stopPropagation)
				originalEvent.stopPropagation();
			// otherwise set the cancelBubble property of the original event to true (IE)
			originalEvent.cancelBubble = true;
		};
		
		// Fix target property, if necessary
		if ( !event.target && event.srcElement )
			event.target = event.srcElement;
				
		// check if target is a textnode (safari)
		if (jQuery.browser.safari && event.target.nodeType == 3)
			event.target = originalEvent.target.parentNode;

		// Add relatedTarget, if necessary
		if ( !event.relatedTarget && event.fromElement )
			event.relatedTarget = event.fromElement == event.target ? event.toElement : event.fromElement;

		// Calculate pageX/Y if missing and clientX/Y available
		if ( event.pageX == null && event.clientX != null ) {
			var doc = document.documentElement, body = document.body;
			event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc.clientLeft || 0);
			event.pageY = event.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc.clientLeft || 0);
		}
			
		// Add which for key events
		if ( !event.which && (event.charCode || event.keyCode) )
			event.which = event.charCode || event.keyCode;
		
		// Add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
		if ( !event.metaKey && event.ctrlKey )
			event.metaKey = event.ctrlKey;

		// Add which for click: 1 == left; 2 == middle; 3 == right
		// Note: button is not normalized, so don't use it
		if ( !event.which && event.button )
			event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));
			
		return event;
	}
};

jQuery.fn.extend({
	bind: function( type, data, fn ) {
		return type == "unload" ? this.one(type, data, fn) : this.each(function(){
			jQuery.event.add( this, type, fn || data, fn && data );
		});
	},
	
	one: function( type, data, fn ) {
		return this.each(function(){
			jQuery.event.add( this, type, function(event) {
				jQuery(this).unbind(event);
				return (fn || data).apply( this, arguments);
			}, fn && data);
		});
	},

	unbind: function( type, fn ) {
		return this.each(function(){
			jQuery.event.remove( this, type, fn );
		});
	},

	trigger: function( type, data, fn ) {
		return this.each(function(){
			jQuery.event.trigger( type, data, this, true, fn );
		});
	},

	triggerHandler: function( type, data, fn ) {
		if ( this[0] )
			return jQuery.event.trigger( type, data, this[0], false, fn );
	},

	toggle: function() {
		// Save reference to arguments for access in closure
		var args = arguments;

		return this.click(function(event) {
			// Figure out which function to execute
			this.lastToggle = 0 == this.lastToggle ? 1 : 0;
			
			// Make sure that clicks stop
			event.preventDefault();
			
			// and execute the function
			return args[this.lastToggle].apply( this, [event] ) || false;
		});
	},

	hover: function(fnOver, fnOut) {
		
		// A private function for handling mouse 'hovering'
		function handleHover(event) {
			// Check if mouse(over|out) are still within the same parent element
			var parent = event.relatedTarget;
	
			// Traverse up the tree
			while ( parent && parent != this ) try { parent = parent.parentNode; } catch(error) { parent = this; };
			
			// If we actually just moused on to a sub-element, ignore it
			if ( parent == this ) return false;
			
			// Execute the right function
			return (event.type == "mouseover" ? fnOver : fnOut).apply(this, [event]);
		}
		
		// Bind the function to the two event listeners
		return this.mouseover(handleHover).mouseout(handleHover);
	},
	
	ready: function(fn) {
		// Attach the listeners
		bindReady();

		// If the DOM is already ready
		if ( jQuery.isReady )
			// Execute the function immediately
			fn.apply( document, [jQuery] );
			
		// Otherwise, remember the function for later
		else
			// Add the function to the wait list
			jQuery.readyList.push( function() { return fn.apply(this, [jQuery]); } );
	
		return this;
	}
});

jQuery.extend({
	/*
	 * All the code that makes DOM Ready work nicely.
	 */
	isReady: false,
	readyList: [],
	
	// Handle when the DOM is ready
	ready: function() {
		// Make sure that the DOM is not already loaded
		if ( !jQuery.isReady ) {
			// Remember that the DOM is ready
			jQuery.isReady = true;
			
			// If there are functions bound, to execute
			if ( jQuery.readyList ) {
				// Execute all of them
				jQuery.each( jQuery.readyList, function(){
					this.apply( document );
				});
				
				// Reset the list of functions
				jQuery.readyList = null;
			}
			// Remove event listener to avoid memory leak
			if ( jQuery.browser.mozilla || jQuery.browser.opera )
				document.removeEventListener( "DOMContentLoaded", jQuery.ready, false );
		}
	}
});


jQuery.each( ("blur,focus,load,resize,scroll,unload,click,dblclick," +
	"mousedown,mouseup,mousemove,mouseover,mouseout,change,select," + 
	"submit,keydown,keypress,keyup,error").split(","), function(i, name){
	
	// Handle event binding
	jQuery.fn[name] = function(fn){
		return fn ? this.bind(name, fn) : this.trigger(name);
	};
});

var readyBound = false;

function bindReady(){
	if ( readyBound ) return;
	readyBound = true;

	// If Mozilla is used
	if ( jQuery.browser.mozilla || jQuery.browser.opera )
		// Use the handy event callback
		document.addEventListener( "DOMContentLoaded", jQuery.ready, false );
	
	// If Safari or IE is used
	// Continually check to see if the document is ready
	else (function(){
		try {
			// If IE is used, use the trick by Diego Perini
			// http://javascript.nwbox.com/IEContentLoaded/
			if ( jQuery.browser.msie || document.readyState != "loaded" && document.readyState != "complete" )
				document.documentElement.doScroll("left");
		} catch( error ) {
			return setTimeout( arguments.callee, 0 );
		}

		// and execute any waiting functions
		jQuery.ready();
	})();

	// A fallback to window.onload, that will always work
	jQuery.event.add( window, "load", jQuery.ready );
}

// Prevent memory leaks in IE
if ( jQuery.browser.msie )
	jQuery(window).bind("unload", function() {
		$("*").add([document, window]).unbind();
	});jQuery.fn.extend({
	load: function( url, params, callback ) {
		if ( jQuery.isFunction( url ) )
			return this.bind("load", url);

		var off = url.indexOf(" ");
		if ( off >= 0 ) {
			var selector = url.slice(off, url.length);
			url = url.slice(0, off);
		}

		callback = callback || function(){};

		// Default to a GET request
		var type = "GET";

		// If the second parameter was provided
		if ( params )
			// If it's a function
			if ( jQuery.isFunction( params ) ) {
				// We assume that it's the callback
				callback = params;
				params = null;

			// Otherwise, build a param string
			} else {
				params = jQuery.param( params );
				type = "POST";
			}

		var self = this;

		// Request the remote document
		jQuery.ajax({
			url: url,
			type: type,
			data: params,
			complete: function(res, status){
				// If successful, inject the HTML into all the matched elements
				if ( status == "success" || status == "notmodified" )
					// See if a selector was specified
					self.html( selector ?
						// Create a dummy div to hold the results
						jQuery("<div/>")
							// inject the contents of the document in, removing the scripts
							// to avoid any 'Permission Denied' errors in IE
							.append(res.responseText.replace(/<script(.|\s)*?\/script>/g, ""))

							// Locate the specified elements
							.find(selector) :

						// If not, just inject the full result
						res.responseText );

				// Add delay to account for Safari's delay in globalEval
				setTimeout(function(){
					self.each( callback, [res.responseText, status, res] );
				}, 13);
			}
		});
		return this;
	},

	serialize: function() {
		return jQuery.param(this.serializeArray());
	},
	serializeArray: function() {
		return this.map(function(){
			return jQuery.nodeName(this, "form") ?
				jQuery.makeArray(this.elements) : this;
		})
		.filter(function(){
			return this.name && !this.disabled && 
				(this.checked || /select|textarea/i.test(this.nodeName) || 
					/text|hidden|password/i.test(this.type));
		})
		.map(function(i, elem){
			var val = jQuery(this).val();
			return val == null ? null :
				val.constructor == Array ?
					jQuery.map( val, function(val, i){
						return {name: elem.name, value: val};
					}) :
					{name: elem.name, value: val};
		}).get();
	}
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart,ajaxStop,ajaxComplete,ajaxError,ajaxSuccess,ajaxSend".split(","), function(i,o){
	jQuery.fn[o] = function(f){
		return this.bind(o, f);
	};
});

var jsc = (new Date).getTime();

jQuery.extend({
	get: function( url, data, callback, type ) {
		// shift arguments if data argument was ommited
		if ( jQuery.isFunction( data ) ) {
			callback = data;
			data = null;
		}
		
		return jQuery.ajax({
			type: "GET",
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	},

	getScript: function( url, callback ) {
		return jQuery.get(url, null, callback, "script");
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get(url, data, callback, "json");
	},

	post: function( url, data, callback, type ) {
		if ( jQuery.isFunction( data ) ) {
			callback = data;
			data = {};
		}

		return jQuery.ajax({
			type: "POST",
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	},

	ajaxSetup: function( settings ) {
		jQuery.extend( jQuery.ajaxSettings, settings );
	},

	ajaxSettings: {
		global: true,
		type: "GET",
		timeout: 0,
		contentType: "application/x-www-form-urlencoded",
		processData: true,
		async: true,
		data: null
	},
	
	// Last-Modified header cache for next request
	lastModified: {},

	ajax: function( s ) {
		var jsonp, jsre = /=(\?|%3F)/g, status, data;

		// Extend the settings, but re-extend 's' so that it can be
		// checked again later (in the test suite, specifically)
		s = jQuery.extend(true, s, jQuery.extend(true, {}, jQuery.ajaxSettings, s));

		// convert data if not already a string
		if ( s.data && s.processData && typeof s.data != "string" )
			s.data = jQuery.param(s.data);

		// Handle JSONP Parameter Callbacks
		if ( s.dataType == "jsonp" ) {
			if ( s.type.toLowerCase() == "get" ) {
				if ( !s.url.match(jsre) )
					s.url += (s.url.match(/\?/) ? "&" : "?") + (s.jsonp || "callback") + "=?";
			} else if ( !s.data || !s.data.match(jsre) )
				s.data = (s.data ? s.data + "&" : "") + (s.jsonp || "callback") + "=?";
			s.dataType = "json";
		}

		// Build temporary JSONP function
		if ( s.dataType == "json" && (s.data && jsre.test( s.data ) || s.url.match(jsre)) ) {
			jsonp = "jsonp" + jsc++;

			// Replace the =? sequence both in the query string and the data
			if ( s.data )
				s.data = (s.data + "").replace(jsre, "=" + jsonp);
			s.url = s.url.replace(jsre, "=" + jsonp);

			// We need to make sure
			// that a JSONP style response is executed properly
			s.dataType = "script";

			// Handle JSONP-style loading
			window[ jsonp ] = function(tmp){
				data = tmp;
				success();
				complete();
				// Garbage collect
				window[ jsonp ] = undefined;
				try{ delete window[ jsonp ]; } catch(e){}
			};
		}

		if ( s.dataType == "script" && s.cache == null )
			s.cache = false;

		if ( s.cache === false && s.type.toLowerCase() == "get" )
			s.url += (s.url.match(/\?/) ? "&" : "?") + "_=" + (new Date()).getTime();

		// If data is available, append data to url for get requests
		if ( s.data && s.type.toLowerCase() == "get" ) {
			s.url += (s.url.match(/\?/) ? "&" : "?") + s.data;

			// IE likes to send both get and post data, prevent this
			s.data = null;
		}

		// Watch for a new set of requests
		if ( s.global && ! jQuery.active++ )
			jQuery.event.trigger( "ajaxStart" );

		// If we're requesting a remote document
		// and trying to load JSON or Script
		if ( !s.url.indexOf("http") && s.dataType == "script" ) {
			var head = document.getElementsByTagName("head")[0];
			var script = document.createElement("script");
			script.src = s.url;

			// Handle Script loading
			if ( !jsonp ) {
				var done = false;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function(){
					if ( !done && (!this.readyState || 
							this.readyState == "loaded" || this.readyState == "complete") ) {
						done = true;
						success();
						complete();
						head.removeChild( script );
					}
				};
			}

			head.appendChild(script);

			// We handle everything using the script element injection
			return;
		}

		var requestDone = false;

		// Create the request object; Microsoft failed to properly
		// implement the XMLHttpRequest in IE7, so we use the ActiveXObject when it is available
		var xml = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();

		// Open the socket
		xml.open(s.type, s.url, s.async);

		// Set the correct header, if data is being sent
		if ( s.data )
			xml.setRequestHeader("Content-Type", s.contentType);

		// Set the If-Modified-Since header, if ifModified mode.
		if ( s.ifModified )
			xml.setRequestHeader("If-Modified-Since",
				jQuery.lastModified[s.url] || "Thu, 01 Jan 1970 00:00:00 GMT" );

		// Set header so the called script knows that it's an XMLHttpRequest
		xml.setRequestHeader("X-Requested-With", "XMLHttpRequest");

		// Allow custom headers/mimetypes
		if ( s.beforeSend )
			s.beforeSend(xml);
			
		if ( s.global )
		    jQuery.event.trigger("ajaxSend", [xml, s]);

		// Wait for a response to come back
		var onreadystatechange = function(isTimeout){
			// The transfer is complete and the data is available, or the request timed out
			if ( !requestDone && xml && (xml.readyState == 4 || isTimeout == "timeout") ) {
				requestDone = true;
				
				// clear poll interval
				if (ival) {
					clearInterval(ival);
					ival = null;
				}
				
				status = isTimeout == "timeout" && "timeout" ||
					!jQuery.httpSuccess( xml ) && "error" ||
					s.ifModified && jQuery.httpNotModified( xml, s.url ) && "notmodified" ||
					"success";

				if ( status == "success" ) {
					// Watch for, and catch, XML document parse errors
					try {
						// process the data (runs the xml through httpData regardless of callback)
						data = jQuery.httpData( xml, s.dataType );
					} catch(e) {
						status = "parsererror";
					}
				}

				// Make sure that the request was successful or notmodified
				if ( status == "success" ) {
					// Cache Last-Modified header, if ifModified mode.
					var modRes;
					try {
						modRes = xml.getResponseHeader("Last-Modified");
					} catch(e) {} // swallow exception thrown by FF if header is not available
	
					if ( s.ifModified && modRes )
						jQuery.lastModified[s.url] = modRes;

					// JSONP handles its own success callback
					if ( !jsonp )
						success();	
				} else
					jQuery.handleError(s, xml, status);

				// Fire the complete handlers
				complete();

				// Stop memory leaks
				if ( s.async )
					xml = null;
			}
		};
		
		if ( s.async ) {
			// don't attach the handler to the request, just poll it instead
			var ival = setInterval(onreadystatechange, 13); 

			// Timeout checker
			if ( s.timeout > 0 )
				setTimeout(function(){
					// Check to see if the request is still happening
					if ( xml ) {
						// Cancel the request
						xml.abort();
	
						if( !requestDone )
							onreadystatechange( "timeout" );
					}
				}, s.timeout);
		}
			
		// Send the data
		try {
			xml.send(s.data);
		} catch(e) {
			jQuery.handleError(s, xml, null, e);
		}
		
		// firefox 1.5 doesn't fire statechange for sync requests
		if ( !s.async )
			onreadystatechange();
		
		// return XMLHttpRequest to allow aborting the request etc.
		return xml;

		function success(){
			// If a local callback was specified, fire it and pass it the data
			if ( s.success )
				s.success( data, status );

			// Fire the global callback
			if ( s.global )
				jQuery.event.trigger( "ajaxSuccess", [xml, s] );
		}

		function complete(){
			// Process result
			if ( s.complete )
				s.complete(xml, status);

			// The request was completed
			if ( s.global )
				jQuery.event.trigger( "ajaxComplete", [xml, s] );

			// Handle the global AJAX counter
			if ( s.global && ! --jQuery.active )
				jQuery.event.trigger( "ajaxStop" );
		}
	},

	handleError: function( s, xml, status, e ) {
		// If a local callback was specified, fire it
		if ( s.error ) s.error( xml, status, e );

		// Fire the global callback
		if ( s.global )
			jQuery.event.trigger( "ajaxError", [xml, s, e] );
	},

	// Counter for holding the number of active queries
	active: 0,

	// Determines if an XMLHttpRequest was successful or not
	httpSuccess: function( r ) {
		try {
			return !r.status && location.protocol == "file:" ||
				( r.status >= 200 && r.status < 300 ) || r.status == 304 ||
				jQuery.browser.safari && r.status == undefined;
		} catch(e){}
		return false;
	},

	// Determines if an XMLHttpRequest returns NotModified
	httpNotModified: function( xml, url ) {
		try {
			var xmlRes = xml.getResponseHeader("Last-Modified");

			// Firefox always returns 200. check Last-Modified date
			return xml.status == 304 || xmlRes == jQuery.lastModified[url] ||
				jQuery.browser.safari && xml.status == undefined;
		} catch(e){}
		return false;
	},

	httpData: function( r, type ) {
		var ct = r.getResponseHeader("content-type");
		var xml = type == "xml" || !type && ct && ct.indexOf("xml") >= 0;
		var data = xml ? r.responseXML : r.responseText;

		if ( xml && data.documentElement.tagName == "parsererror" )
			throw "parsererror";

		// If the type is "script", eval it in global context
		if ( type == "script" )
			jQuery.globalEval( data );

		// Get the JavaScript object, if JSON is used.
		if ( type == "json" )
			data = eval("(" + data + ")");

		return data;
	},

	// Serialize an array of form elements or a set of
	// key/values into a query string
	param: function( a ) {
		var s = [];

		// If an array was passed in, assume that it is an array
		// of form elements
		if ( a.constructor == Array || a.jquery )
			// Serialize the form elements
			jQuery.each( a, function(){
				s.push( encodeURIComponent(this.name) + "=" + encodeURIComponent( this.value ) );
			});

		// Otherwise, assume that it's an object of key/value pairs
		else
			// Serialize the key/values
			for ( var j in a )
				// If the value is an array then the key names need to be repeated
				if ( a[j] && a[j].constructor == Array )
					jQuery.each( a[j], function(){
						s.push( encodeURIComponent(j) + "=" + encodeURIComponent( this ) );
					});
				else
					s.push( encodeURIComponent(j) + "=" + encodeURIComponent( a[j] ) );

		// Return the resulting serialization
		return s.join("&").replace(/%20/g, "+");
	}

});
jQuery.fn.extend({
	show: function(speed,callback){
		return speed ?
			this.animate({
				height: "show", width: "show", opacity: "show"
			}, speed, callback) :
			
			this.filter(":hidden").each(function(){
				this.style.display = this.oldblock ? this.oldblock : "";
				if ( jQuery.css(this,"display") == "none" )
					this.style.display = "block";
			}).end();
	},
	
	hide: function(speed,callback){
		return speed ?
			this.animate({
				height: "hide", width: "hide", opacity: "hide"
			}, speed, callback) :
			
			this.filter(":visible").each(function(){
				this.oldblock = this.oldblock || jQuery.css(this,"display");
				if ( this.oldblock == "none" )
					this.oldblock = "block";
				this.style.display = "none";
			}).end();
	},

	// Save the old toggle function
	_toggle: jQuery.fn.toggle,
	
	toggle: function( fn, fn2 ){
		return jQuery.isFunction(fn) && jQuery.isFunction(fn2) ?
			this._toggle( fn, fn2 ) :
			fn ?
				this.animate({
					height: "toggle", width: "toggle", opacity: "toggle"
				}, fn, fn2) :
				this.each(function(){
					jQuery(this)[ jQuery(this).is(":hidden") ? "show" : "hide" ]();
				});
	},
	
	slideDown: function(speed,callback){
		return this.animate({height: "show"}, speed, callback);
	},
	
	slideUp: function(speed,callback){
		return this.animate({height: "hide"}, speed, callback);
	},

	slideToggle: function(speed, callback){
		return this.animate({height: "toggle"}, speed, callback);
	},
	
	fadeIn: function(speed, callback){
		return this.animate({opacity: "show"}, speed, callback);
	},
	
	fadeOut: function(speed, callback){
		return this.animate({opacity: "hide"}, speed, callback);
	},
	
	fadeTo: function(speed,to,callback){
		return this.animate({opacity: to}, speed, callback);
	},
	
	animate: function( prop, speed, easing, callback ) {
		var optall = jQuery.speed(speed, easing, callback);

		return this[ optall.queue === false ? "each" : "queue" ](function(){
			var opt = jQuery.extend({}, optall);
			var hidden = jQuery(this).is(":hidden"), self = this;
			
			for ( var p in prop ) {
				if ( prop[p] == "hide" && hidden || prop[p] == "show" && !hidden )
					return jQuery.isFunction(opt.complete) && opt.complete.apply(this);

				if ( p == "height" || p == "width" ) {
					// Store display property
					opt.display = jQuery.css(this, "display");

					// Make sure that nothing sneaks out
					opt.overflow = this.style.overflow;
				}
			}

			if ( opt.overflow != null )
				this.style.overflow = "hidden";

			opt.curAnim = jQuery.extend({}, prop);
			
			jQuery.each( prop, function(name, val){
				var e = new jQuery.fx( self, opt, name );

				if ( /toggle|show|hide/.test(val) )
					e[ val == "toggle" ? hidden ? "show" : "hide" : val ]( prop );
				else {
					var parts = val.toString().match(/^([+-]=)?([\d+-.]+)(.*)$/),
						start = e.cur(true) || 0;

					if ( parts ) {
						var end = parseFloat(parts[2]),
							unit = parts[3] || "px";

						// We need to compute starting value
						if ( unit != "px" ) {
							self.style[ name ] = (end || 1) + unit;
							start = ((end || 1) / e.cur(true)) * start;
							self.style[ name ] = start + unit;
						}

						// If a +=/-= token was provided, we're doing a relative animation
						if ( parts[1] )
							end = ((parts[1] == "-=" ? -1 : 1) * end) + start;

						e.custom( start, end, unit );
					} else
						e.custom( start, val, "" );
				}
			});

			// For JS strict compliance
			return true;
		});
	},
	
	queue: function(type, fn){
		if ( jQuery.isFunction(type) ) {
			fn = type;
			type = "fx";
		}

		if ( !type || (typeof type == "string" && !fn) )
			return queue( this[0], type );

		return this.each(function(){
			if ( fn.constructor == Array )
				queue(this, type, fn);
			else {
				queue(this, type).push( fn );
			
				if ( queue(this, type).length == 1 )
					fn.apply(this);
			}
		});
	},

	stop: function(){
		var timers = jQuery.timers;

		return this.each(function(){
			for ( var i = 0; i < timers.length; i++ )
				if ( timers[i].elem == this )
					timers.splice(i--, 1);
		}).dequeue();
	}

});

var queue = function( elem, type, array ) {
	if ( !elem )
		return;

	var q = jQuery.data( elem, type + "queue" );

	if ( !q || array )
		q = jQuery.data( elem, type + "queue", 
			array ? jQuery.makeArray(array) : [] );

	return q;
};

jQuery.fn.dequeue = function(type){
	type = type || "fx";

	return this.each(function(){
		var q = queue(this, type);

		q.shift();

		if ( q.length )
			q[0].apply( this );
	});
};

jQuery.extend({
	
	speed: function(speed, easing, fn) {
		var opt = speed && speed.constructor == Object ? speed : {
			complete: fn || !fn && easing || 
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && easing.constructor != Function && easing
		};

		opt.duration = (opt.duration && opt.duration.constructor == Number ? 
			opt.duration : 
			{ slow: 600, fast: 200 }[opt.duration]) || 400;
	
		// Queueing
		opt.old = opt.complete;
		opt.complete = function(){
			jQuery(this).dequeue();
			if ( jQuery.isFunction( opt.old ) )
				opt.old.apply( this );
		};
	
		return opt;
	},
	
	easing: {
		linear: function( p, n, firstNum, diff ) {
			return firstNum + diff * p;
		},
		swing: function( p, n, firstNum, diff ) {
			return ((-Math.cos(p*Math.PI)/2) + 0.5) * diff + firstNum;
		}
	},
	
	timers: [],

	fx: function( elem, options, prop ){
		this.options = options;
		this.elem = elem;
		this.prop = prop;

		if ( !options.orig )
			options.orig = {};
	}

});

jQuery.fx.prototype = {

	// Simple function for setting a style value
	update: function(){
		if ( this.options.step )
			this.options.step.apply( this.elem, [ this.now, this ] );

		(jQuery.fx.step[this.prop] || jQuery.fx.step._default)( this );

		// Set display property to block for height/width animations
		if ( this.prop == "height" || this.prop == "width" )
			this.elem.style.display = "block";
	},

	// Get the current size
	cur: function(force){
		if ( this.elem[this.prop] != null && this.elem.style[this.prop] == null )
			return this.elem[ this.prop ];

		var r = parseFloat(jQuery.curCSS(this.elem, this.prop, force));
		return r && r > -10000 ? r : parseFloat(jQuery.css(this.elem, this.prop)) || 0;
	},

	// Start an animation from one number to another
	custom: function(from, to, unit){
		this.startTime = (new Date()).getTime();
		this.start = from;
		this.end = to;
		this.unit = unit || this.unit || "px";
		this.now = this.start;
		this.pos = this.state = 0;
		this.update();

		var self = this;
		function t(){
			return self.step();
		}

		t.elem = this.elem;

		jQuery.timers.push(t);

		if ( jQuery.timers.length == 1 ) {
			var timer = setInterval(function(){
				var timers = jQuery.timers;
				
				for ( var i = 0; i < timers.length; i++ )
					if ( !timers[i]() )
						timers.splice(i--, 1);

				if ( !timers.length )
					clearInterval( timer );
			}, 13);
		}
	},

	// Simple 'show' function
	show: function(){
		// Remember where we started, so that we can go back to it later
		this.options.orig[this.prop] = jQuery.attr( this.elem.style, this.prop );
		this.options.show = true;

		// Begin the animation
		this.custom(0, this.cur());

		// Make sure that we start at a small width/height to avoid any
		// flash of content
		if ( this.prop == "width" || this.prop == "height" )
			this.elem.style[this.prop] = "1px";
		
		// Start by showing the element
		jQuery(this.elem).show();
	},

	// Simple 'hide' function
	hide: function(){
		// Remember where we started, so that we can go back to it later
		this.options.orig[this.prop] = jQuery.attr( this.elem.style, this.prop );
		this.options.hide = true;

		// Begin the animation
		this.custom(this.cur(), 0);
	},

	// Each step of an animation
	step: function(){
		var t = (new Date()).getTime();

		if ( t > this.options.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			this.options.curAnim[ this.prop ] = true;

			var done = true;
			for ( var i in this.options.curAnim )
				if ( this.options.curAnim[i] !== true )
					done = false;

			if ( done ) {
				if ( this.options.display != null ) {
					// Reset the overflow
					this.elem.style.overflow = this.options.overflow;
				
					// Reset the display
					this.elem.style.display = this.options.display;
					if ( jQuery.css(this.elem, "display") == "none" )
						this.elem.style.display = "block";
				}

				// Hide the element if the "hide" operation was done
				if ( this.options.hide )
					this.elem.style.display = "none";

				// Reset the properties, if the item has been hidden or shown
				if ( this.options.hide || this.options.show )
					for ( var p in this.options.curAnim )
						jQuery.attr(this.elem.style, p, this.options.orig[p]);
			}

			// If a callback was provided, execute it
			if ( done && jQuery.isFunction( this.options.complete ) )
				// Execute the complete function
				this.options.complete.apply( this.elem );

			return false;
		} else {
			var n = t - this.startTime;
			this.state = n / this.options.duration;

			// Perform the easing function, defaults to swing
			this.pos = jQuery.easing[this.options.easing || (jQuery.easing.swing ? "swing" : "linear")](this.state, n, 0, 1, this.options.duration);
			this.now = this.start + ((this.end - this.start) * this.pos);

			// Perform the next step of the animation
			this.update();
		}

		return true;
	}

};

jQuery.fx.step = {
	scrollLeft: function(fx){
		fx.elem.scrollLeft = fx.now;
	},

	scrollTop: function(fx){
		fx.elem.scrollTop = fx.now;
	},

	opacity: function(fx){
		jQuery.attr(fx.elem.style, "opacity", fx.now);
	},

	_default: function(fx){
		fx.elem.style[ fx.prop ] = fx.now + fx.unit;
	}
};
// The Offset Method
// Originally By Brandon Aaron, part of the Dimension Plugin
// http://jquery.com/plugins/project/dimensions
jQuery.fn.offset = function() {
	var left = 0, top = 0, elem = this[0], results;
	
	if ( elem ) with ( jQuery.browser ) {
		var	parent       = elem.parentNode, 
		    offsetChild  = elem,
		    offsetParent = elem.offsetParent, 
		    doc          = elem.ownerDocument,
		    safari2      = safari && parseInt(version) < 522,
		    fixed        = jQuery.css(elem, "position") == "fixed";
	
		// Use getBoundingClientRect if available
		if ( elem.getBoundingClientRect ) {
			var box = elem.getBoundingClientRect();
		
			// Add the document scroll offsets
			add(
				box.left + Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft),
				box.top  + Math.max(doc.documentElement.scrollTop,  doc.body.scrollTop)
			);
		
			// IE adds the HTML element's border, by default it is medium which is 2px
			// IE 6 and IE 7 quirks mode the border width is overwritable by the following css html { border: 0; }
			// IE 7 standards mode, the border is always 2px
			if ( msie ) {
				var border = jQuery("html").css("borderWidth");
				border = (border == "medium" || jQuery.boxModel && parseInt(version) >= 7) && 2 || border;
				add( -border, -border );
			}
	
		// Otherwise loop through the offsetParents and parentNodes
		} else {
		
			// Initial element offsets
			add( elem.offsetLeft, elem.offsetTop );
		
			// Get parent offsets
			while ( offsetParent ) {
				// Add offsetParent offsets
				add( offsetParent.offsetLeft, offsetParent.offsetTop );
			
				// Mozilla and Safari > 2 does not include the border on offset parents
				// However Mozilla adds the border for table or table cells
				if ( mozilla && !/^t(able|d|h)$/i.test(offsetParent.tagName) || safari && !safari2 )
					border( offsetParent );
					
				// Add the document scroll offsets if position is fixed on any offsetParent
				if ( !fixed && jQuery.css(offsetParent, "position") == "fixed" )
					fixed = true;
			
				// Set offsetChild to previous offsetParent unless it is the body element
				offsetChild  = /^body$/i.test(offsetParent.tagName) ? offsetChild : offsetParent;
				// Get next offsetParent
				offsetParent = offsetParent.offsetParent;
			}
		
			// Get parent scroll offsets
			while ( parent.tagName && !/^body|html$/i.test(parent.tagName) ) {
				// Remove parent scroll UNLESS that parent is inline or a table-row to work around Opera inline/table scrollLeft/Top bug
				if ( !/^inline|table-row.*$/i.test(jQuery.css(parent, "display")) )
					// Subtract parent scroll offsets
					add( -parent.scrollLeft, -parent.scrollTop );
			
				// Mozilla does not add the border for a parent that has overflow != visible
				if ( mozilla && jQuery.css(parent, "overflow") != "visible" )
					border( parent );
			
				// Get next parent
				parent = parent.parentNode;
			}
		
			// Safari <= 2 doubles body offsets with a fixed position element/offsetParent or absolutely positioned offsetChild
			// Mozilla doubles body offsets with a non-absolutely positioned offsetChild
			if ( (safari2 && (fixed || jQuery.css(offsetChild, "position") == "absolute")) || 
				(mozilla && jQuery.css(offsetChild, "position") != "absoltue") )
					add( -doc.body.offsetLeft, -doc.body.offsetTop );
			
			// Add the document scroll offsets if position is fixed
			if ( fixed )
				add(
					Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft),
					Math.max(doc.documentElement.scrollTop,  doc.body.scrollTop)
				);
		}

		// Return an object with top and left properties
		results = { top: top, left: left };
	}

	return results;

	function border(elem) {
		add( jQuery.css(elem, "borderLeftWidth"), jQuery.css(elem, "borderTopWidth") );
	}

	function add(l, t) {
		left += parseInt(l) || 0;
		top += parseInt(t) || 0;
	}
};
})();

/*
 * jQuery Color Animations
 * Copyright 2007 John Resig
 * Released under the MIT and GPL licenses.
 */

(function(jQuery){

	// We override the animation for all of these color styles
	jQuery.each(['backgroundColor', 'borderBottomColor', 'borderLeftColor', 'borderRightColor', 'borderTopColor', 'color', 'outlineColor'], function(i,attr){
		jQuery.fx.step[attr] = function(fx){
			if ( fx.state == 0 ) {
				fx.start = getColor( fx.elem, attr );
				fx.end = getRGB( fx.end );
			}

			fx.elem.style[attr] = "rgb(" + [
				Math.max(Math.min( parseInt((fx.pos * (fx.end[0] - fx.start[0])) + fx.start[0]), 255), 0),
				Math.max(Math.min( parseInt((fx.pos * (fx.end[1] - fx.start[1])) + fx.start[1]), 255), 0),
				Math.max(Math.min( parseInt((fx.pos * (fx.end[2] - fx.start[2])) + fx.start[2]), 255), 0)
			].join(",") + ")";
		}
	});

	// Color Conversion functions from highlightFade
	// By Blair Mitchelmore
	// http://jquery.offput.ca/highlightFade/

	// Parse strings looking for color tuples [255,255,255]
	function getRGB(color) {
		var result;

		// Check if we're already dealing with an array of colors
		if ( color && color.constructor == Array && color.length == 3 )
			return color;

		// Look for rgb(num,num,num)
		if (result = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color))
			return [parseInt(result[1]), parseInt(result[2]), parseInt(result[3])];

		// Look for rgb(num%,num%,num%)
		if (result = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(color))
			return [parseFloat(result[1])*2.55, parseFloat(result[2])*2.55, parseFloat(result[3])*2.55];

		// Look for #a0b1c2
		if (result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(color))
			return [parseInt(result[1],16), parseInt(result[2],16), parseInt(result[3],16)];

		// Look for #fff
		if (result = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(color))
			return [parseInt(result[1]+result[1],16), parseInt(result[2]+result[2],16), parseInt(result[3]+result[3],16)];

		// Otherwise, we're most likely dealing with a named color
		return colors[jQuery.trim(color).toLowerCase()];
	}
	
	function getColor(elem, attr) {
		var color;

		do {
			color = jQuery.curCSS(elem, attr);

			// Keep going until we find an element that has color, or we hit the body
			if ( color != '' && color != 'transparent' || jQuery.nodeName(elem, "body") )
				break; 

			attr = "backgroundColor";
		} while ( elem = elem.parentNode );

		return getRGB(color);
	};
	
	// Some named colors to work with
	// From Interface by Stefan Petre
	// http://interface.eyecon.ro/

	var colors = {
		aqua:[0,255,255],
		azure:[240,255,255],
		beige:[245,245,220],
		black:[0,0,0],
		blue:[0,0,255],
		brown:[165,42,42],
		cyan:[0,255,255],
		darkblue:[0,0,139],
		darkcyan:[0,139,139],
		darkgrey:[169,169,169],
		darkgreen:[0,100,0],
		darkkhaki:[189,183,107],
		darkmagenta:[139,0,139],
		darkolivegreen:[85,107,47],
		darkorange:[255,140,0],
		darkorchid:[153,50,204],
		darkred:[139,0,0],
		darksalmon:[233,150,122],
		darkviolet:[148,0,211],
		fuchsia:[255,0,255],
		gold:[255,215,0],
		green:[0,128,0],
		indigo:[75,0,130],
		khaki:[240,230,140],
		lightblue:[173,216,230],
		lightcyan:[224,255,255],
		lightgreen:[144,238,144],
		lightgrey:[211,211,211],
		lightpink:[255,182,193],
		lightyellow:[255,255,224],
		lime:[0,255,0],
		magenta:[255,0,255],
		maroon:[128,0,0],
		navy:[0,0,128],
		olive:[128,128,0],
		orange:[255,165,0],
		pink:[255,192,203],
		purple:[128,0,128],
		violet:[128,0,128],
		red:[255,0,0],
		silver:[192,192,192],
		white:[255,255,255],
		yellow:[255,255,0]
	};
	
})(jQuery);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJqcXVlcnkuanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7XHJcbi8qXHJcbiAqIGpRdWVyeSBAVkVSU0lPTiAtIE5ldyBXYXZlIEphdmFzY3JpcHRcclxuICpcclxuICogQ29weXJpZ2h0IChjKSAyMDA3IEpvaG4gUmVzaWcgKGpxdWVyeS5jb20pXHJcbiAqIER1YWwgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCAoTUlULUxJQ0VOU0UudHh0KVxyXG4gKiBhbmQgR1BMIChHUEwtTElDRU5TRS50eHQpIGxpY2Vuc2VzLlxyXG4gKlxyXG4gKiAkRGF0ZTogMjAwNy0xMC0yMSAwMTowNDowNiArMDMwMCAoRCwgMjEgb2N0LiAyMDA3KSAkXHJcbiAqICRSZXY6IDM3MDEgJFxyXG4gKi9cclxuXHJcbi8vIE1hcCBvdmVyIGpRdWVyeSBpbiBjYXNlIG9mIG92ZXJ3cml0ZVxyXG5pZiAoIHdpbmRvdy5qUXVlcnkgKVxyXG5cdHZhciBfalF1ZXJ5ID0gd2luZG93LmpRdWVyeTtcclxuXHJcbnZhciBqUXVlcnkgPSB3aW5kb3cualF1ZXJ5ID0gZnVuY3Rpb24oIHNlbGVjdG9yLCBjb250ZXh0ICkge1xyXG5cdC8vIElmIHRoZSBjb250ZXh0IGlzIGEgbmFtZXNwYWNlIG9iamVjdCwgcmV0dXJuIGEgbmV3IG9iamVjdFxyXG5cdHJldHVybiB0aGlzIGluc3RhbmNlb2YgalF1ZXJ5ID9cclxuXHRcdHRoaXMuaW5pdCggc2VsZWN0b3IsIGNvbnRleHQgKSA6XHJcblx0XHRuZXcgalF1ZXJ5KCBzZWxlY3RvciwgY29udGV4dCApO1xyXG59O1xyXG5cclxuLy8gTWFwIG92ZXIgdGhlICQgaW4gY2FzZSBvZiBvdmVyd3JpdGVcclxuaWYgKCB3aW5kb3cuJCApXHJcblx0dmFyIF8kID0gd2luZG93LiQ7XHJcblx0XHJcbi8vIE1hcCB0aGUgalF1ZXJ5IG5hbWVzcGFjZSB0byB0aGUgJyQnIG9uZVxyXG53aW5kb3cuJCA9IGpRdWVyeTtcclxuXHJcbi8vIEEgc2ltcGxlIHdheSB0byBjaGVjayBmb3IgSFRNTCBzdHJpbmdzIG9yIElEIHN0cmluZ3NcclxuLy8gKGJvdGggb2Ygd2hpY2ggd2Ugb3B0aW1pemUgZm9yKVxyXG52YXIgcXVpY2tFeHByID0gL15bXjxdKig8KC58XFxzKSs+KVtePl0qJHxeIyhcXHcrKSQvO1xyXG5cclxualF1ZXJ5LmZuID0galF1ZXJ5LnByb3RvdHlwZSA9IHtcclxuXHRpbml0OiBmdW5jdGlvbiggc2VsZWN0b3IsIGNvbnRleHQgKSB7XHJcblx0XHQvLyBNYWtlIHN1cmUgdGhhdCBhIHNlbGVjdGlvbiB3YXMgcHJvdmlkZWRcclxuXHRcdHNlbGVjdG9yID0gc2VsZWN0b3IgfHwgZG9jdW1lbnQ7XHJcblxyXG5cdFx0Ly8gSGFuZGxlIEhUTUwgc3RyaW5nc1xyXG5cdFx0aWYgKCB0eXBlb2Ygc2VsZWN0b3IgID09IFwic3RyaW5nXCIgKSB7XHJcblx0XHRcdC8vIEFyZSB3ZSBkZWFsaW5nIHdpdGggSFRNTCBzdHJpbmcgb3IgYW4gSUQ/XHJcblx0XHRcdHZhciBtYXRjaCA9IHF1aWNrRXhwci5leGVjKCBzZWxlY3RvciApO1xyXG5cclxuXHRcdFx0Ly8gVmVyaWZ5IGEgbWF0Y2gsIGFuZCB0aGF0IG5vIGNvbnRleHQgd2FzIHNwZWNpZmllZCBmb3IgI2lkXHJcblx0XHRcdGlmICggbWF0Y2ggJiYgKG1hdGNoWzFdIHx8ICFjb250ZXh0KSApIHtcclxuXHJcblx0XHRcdFx0Ly8gSEFORExFOiAkKGh0bWwpIC0+ICQoYXJyYXkpXHJcblx0XHRcdFx0aWYgKCBtYXRjaFsxXSApXHJcblx0XHRcdFx0XHRzZWxlY3RvciA9IGpRdWVyeS5jbGVhbiggWyBtYXRjaFsxXSBdLCBjb250ZXh0ICk7XHJcblxyXG5cdFx0XHRcdC8vIEhBTkRMRTogJChcIiNpZFwiKVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dmFyIGVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggbWF0Y2hbM10gKTtcclxuXHJcblx0XHRcdFx0XHQvLyBNYWtlIHN1cmUgYW4gZWxlbWVudCB3YXMgbG9jYXRlZFxyXG5cdFx0XHRcdFx0aWYgKCBlbGVtIClcclxuXHRcdFx0XHRcdFx0Ly8gSGFuZGxlIHRoZSBjYXNlIHdoZXJlIElFIGFuZCBPcGVyYSByZXR1cm4gaXRlbXNcclxuXHRcdFx0XHRcdFx0Ly8gYnkgbmFtZSBpbnN0ZWFkIG9mIElEXHJcblx0XHRcdFx0XHRcdGlmICggZWxlbS5pZCAhPSBtYXRjaFszXSApXHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGpRdWVyeSgpLmZpbmQoIHNlbGVjdG9yICk7XHJcblxyXG5cdFx0XHRcdFx0XHQvLyBPdGhlcndpc2UsIHdlIGluamVjdCB0aGUgZWxlbWVudCBkaXJlY3RseSBpbnRvIHRoZSBqUXVlcnkgb2JqZWN0XHJcblx0XHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXNbMF0gPSBlbGVtO1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMubGVuZ3RoID0gMTtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0c2VsZWN0b3IgPSBbXTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBIQU5ETEU6ICQoZXhwciwgW2NvbnRleHRdKVxyXG5cdFx0XHQvLyAod2hpY2ggaXMganVzdCBlcXVpdmFsZW50IHRvOiAkKGNvbnRlbnQpLmZpbmQoZXhwcilcclxuXHRcdFx0fSBlbHNlXHJcblx0XHRcdFx0cmV0dXJuIG5ldyBqUXVlcnkoIGNvbnRleHQgKS5maW5kKCBzZWxlY3RvciApO1xyXG5cclxuXHRcdC8vIEhBTkRMRTogJChmdW5jdGlvbilcclxuXHRcdC8vIFNob3J0Y3V0IGZvciBkb2N1bWVudCByZWFkeVxyXG5cdFx0fSBlbHNlIGlmICggalF1ZXJ5LmlzRnVuY3Rpb24oIHNlbGVjdG9yICkgKVxyXG5cdFx0XHRyZXR1cm4gbmV3IGpRdWVyeSggZG9jdW1lbnQgKVsgalF1ZXJ5LmZuLnJlYWR5ID8gXCJyZWFkeVwiIDogXCJsb2FkXCIgXSggc2VsZWN0b3IgKTtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5zZXRBcnJheShcclxuXHRcdFx0Ly8gSEFORExFOiAkKGFycmF5KVxyXG5cdFx0XHRzZWxlY3Rvci5jb25zdHJ1Y3RvciA9PSBBcnJheSAmJiBzZWxlY3RvciB8fFxyXG5cclxuXHRcdFx0Ly8gSEFORExFOiAkKGFycmF5bGlrZSlcclxuXHRcdFx0Ly8gV2F0Y2ggZm9yIHdoZW4gYW4gYXJyYXktbGlrZSBvYmplY3QsIGNvbnRhaW5zIERPTSBub2RlcywgaXMgcGFzc2VkIGluIGFzIHRoZSBzZWxlY3RvclxyXG5cdFx0XHQoc2VsZWN0b3IuanF1ZXJ5IHx8IHNlbGVjdG9yLmxlbmd0aCAmJiBzZWxlY3RvciAhPSB3aW5kb3cgJiYgIXNlbGVjdG9yLm5vZGVUeXBlICYmIHNlbGVjdG9yWzBdICE9IHVuZGVmaW5lZCAmJiBzZWxlY3RvclswXS5ub2RlVHlwZSkgJiYgalF1ZXJ5Lm1ha2VBcnJheSggc2VsZWN0b3IgKSB8fFxyXG5cclxuXHRcdFx0Ly8gSEFORExFOiAkKCopXHJcblx0XHRcdFsgc2VsZWN0b3IgXSApO1xyXG5cdH0sXHJcblx0XHJcblx0Ly8gVGhlIGN1cnJlbnQgdmVyc2lvbiBvZiBqUXVlcnkgYmVpbmcgdXNlZFxyXG5cdGpxdWVyeTogXCJAVkVSU0lPTlwiLFxyXG5cclxuXHQvLyBUaGUgbnVtYmVyIG9mIGVsZW1lbnRzIGNvbnRhaW5lZCBpbiB0aGUgbWF0Y2hlZCBlbGVtZW50IHNldFxyXG5cdHNpemU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMubGVuZ3RoO1xyXG5cdH0sXHJcblx0XHJcblx0Ly8gVGhlIG51bWJlciBvZiBlbGVtZW50cyBjb250YWluZWQgaW4gdGhlIG1hdGNoZWQgZWxlbWVudCBzZXRcclxuXHRsZW5ndGg6IDAsXHJcblxyXG5cdC8vIEdldCB0aGUgTnRoIGVsZW1lbnQgaW4gdGhlIG1hdGNoZWQgZWxlbWVudCBzZXQgT1JcclxuXHQvLyBHZXQgdGhlIHdob2xlIG1hdGNoZWQgZWxlbWVudCBzZXQgYXMgYSBjbGVhbiBhcnJheVxyXG5cdGdldDogZnVuY3Rpb24oIG51bSApIHtcclxuXHRcdHJldHVybiBudW0gPT0gdW5kZWZpbmVkID9cclxuXHJcblx0XHRcdC8vIFJldHVybiBhICdjbGVhbicgYXJyYXlcclxuXHRcdFx0alF1ZXJ5Lm1ha2VBcnJheSggdGhpcyApIDpcclxuXHJcblx0XHRcdC8vIFJldHVybiBqdXN0IHRoZSBvYmplY3RcclxuXHRcdFx0dGhpc1sgbnVtIF07XHJcblx0fSxcclxuXHRcclxuXHQvLyBUYWtlIGFuIGFycmF5IG9mIGVsZW1lbnRzIGFuZCBwdXNoIGl0IG9udG8gdGhlIHN0YWNrXHJcblx0Ly8gKHJldHVybmluZyB0aGUgbmV3IG1hdGNoZWQgZWxlbWVudCBzZXQpXHJcblx0cHVzaFN0YWNrOiBmdW5jdGlvbiggZWxlbXMgKSB7XHJcblx0XHQvLyBCdWlsZCBhIG5ldyBqUXVlcnkgbWF0Y2hlZCBlbGVtZW50IHNldFxyXG5cdFx0dmFyIHJldCA9IGpRdWVyeSggZWxlbXMgKTtcclxuXHJcblx0XHQvLyBBZGQgdGhlIG9sZCBvYmplY3Qgb250byB0aGUgc3RhY2sgKGFzIGEgcmVmZXJlbmNlKVxyXG5cdFx0cmV0LnByZXZPYmplY3QgPSB0aGlzO1xyXG5cclxuXHRcdC8vIFJldHVybiB0aGUgbmV3bHktZm9ybWVkIGVsZW1lbnQgc2V0XHJcblx0XHRyZXR1cm4gcmV0O1xyXG5cdH0sXHJcblx0XHJcblx0Ly8gRm9yY2UgdGhlIGN1cnJlbnQgbWF0Y2hlZCBzZXQgb2YgZWxlbWVudHMgdG8gYmVjb21lXHJcblx0Ly8gdGhlIHNwZWNpZmllZCBhcnJheSBvZiBlbGVtZW50cyAoZGVzdHJveWluZyB0aGUgc3RhY2sgaW4gdGhlIHByb2Nlc3MpXHJcblx0Ly8gWW91IHNob3VsZCB1c2UgcHVzaFN0YWNrKCkgaW4gb3JkZXIgdG8gZG8gdGhpcywgYnV0IG1haW50YWluIHRoZSBzdGFja1xyXG5cdHNldEFycmF5OiBmdW5jdGlvbiggZWxlbXMgKSB7XHJcblx0XHQvLyBSZXNldHRpbmcgdGhlIGxlbmd0aCB0byAwLCB0aGVuIHVzaW5nIHRoZSBuYXRpdmUgQXJyYXkgcHVzaFxyXG5cdFx0Ly8gaXMgYSBzdXBlci1mYXN0IHdheSB0byBwb3B1bGF0ZSBhbiBvYmplY3Qgd2l0aCBhcnJheS1saWtlIHByb3BlcnRpZXNcclxuXHRcdHRoaXMubGVuZ3RoID0gMDtcclxuXHRcdEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KCB0aGlzLCBlbGVtcyApO1xyXG5cdFx0XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHQvLyBFeGVjdXRlIGEgY2FsbGJhY2sgZm9yIGV2ZXJ5IGVsZW1lbnQgaW4gdGhlIG1hdGNoZWQgc2V0LlxyXG5cdC8vIChZb3UgY2FuIHNlZWQgdGhlIGFyZ3VtZW50cyB3aXRoIGFuIGFycmF5IG9mIGFyZ3MsIGJ1dCB0aGlzIGlzXHJcblx0Ly8gb25seSB1c2VkIGludGVybmFsbHkuKVxyXG5cdGVhY2g6IGZ1bmN0aW9uKCBjYWxsYmFjaywgYXJncyApIHtcclxuXHRcdHJldHVybiBqUXVlcnkuZWFjaCggdGhpcywgY2FsbGJhY2ssIGFyZ3MgKTtcclxuXHR9LFxyXG5cclxuXHQvLyBEZXRlcm1pbmUgdGhlIHBvc2l0aW9uIG9mIGFuIGVsZW1lbnQgd2l0aGluIFxyXG5cdC8vIHRoZSBtYXRjaGVkIHNldCBvZiBlbGVtZW50c1xyXG5cdGluZGV4OiBmdW5jdGlvbiggZWxlbSApIHtcclxuXHRcdHZhciByZXQgPSAtMTtcclxuXHJcblx0XHQvLyBMb2NhdGUgdGhlIHBvc2l0aW9uIG9mIHRoZSBkZXNpcmVkIGVsZW1lbnRcclxuXHRcdHRoaXMuZWFjaChmdW5jdGlvbihpKXtcclxuXHRcdFx0aWYgKCB0aGlzID09IGVsZW0gKVxyXG5cdFx0XHRcdHJldCA9IGk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gcmV0O1xyXG5cdH0sXHJcblxyXG5cdGF0dHI6IGZ1bmN0aW9uKCBuYW1lLCB2YWx1ZSwgdHlwZSApIHtcclxuXHRcdHZhciBvcHRpb25zID0gbmFtZTtcclxuXHRcdFxyXG5cdFx0Ly8gTG9vayBmb3IgdGhlIGNhc2Ugd2hlcmUgd2UncmUgYWNjZXNzaW5nIGEgc3R5bGUgdmFsdWVcclxuXHRcdGlmICggbmFtZS5jb25zdHJ1Y3RvciA9PSBTdHJpbmcgKVxyXG5cdFx0XHRpZiAoIHZhbHVlID09IHVuZGVmaW5lZCApXHJcblx0XHRcdFx0cmV0dXJuIHRoaXMubGVuZ3RoICYmIGpRdWVyeVsgdHlwZSB8fCBcImF0dHJcIiBdKCB0aGlzWzBdLCBuYW1lICkgfHwgdW5kZWZpbmVkO1xyXG5cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0b3B0aW9ucyA9IHt9O1xyXG5cdFx0XHRcdG9wdGlvbnNbIG5hbWUgXSA9IHZhbHVlO1xyXG5cdFx0XHR9XHJcblx0XHRcclxuXHRcdC8vIENoZWNrIHRvIHNlZSBpZiB3ZSdyZSBzZXR0aW5nIHN0eWxlIHZhbHVlc1xyXG5cdFx0cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbihpKXtcclxuXHRcdFx0Ly8gU2V0IGFsbCB0aGUgc3R5bGVzXHJcblx0XHRcdGZvciAoIG5hbWUgaW4gb3B0aW9ucyApXHJcblx0XHRcdFx0alF1ZXJ5LmF0dHIoXHJcblx0XHRcdFx0XHR0eXBlID9cclxuXHRcdFx0XHRcdFx0dGhpcy5zdHlsZSA6XHJcblx0XHRcdFx0XHRcdHRoaXMsXHJcblx0XHRcdFx0XHRuYW1lLCBqUXVlcnkucHJvcCggdGhpcywgb3B0aW9uc1sgbmFtZSBdLCB0eXBlLCBpLCBuYW1lIClcclxuXHRcdFx0XHQpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHJcblx0Y3NzOiBmdW5jdGlvbigga2V5LCB2YWx1ZSApIHtcclxuXHRcdHJldHVybiB0aGlzLmF0dHIoIGtleSwgdmFsdWUsIFwiY3VyQ1NTXCIgKTtcclxuXHR9LFxyXG5cclxuXHR0ZXh0OiBmdW5jdGlvbiggdGV4dCApIHtcclxuXHRcdGlmICggdHlwZW9mIHRleHQgIT0gXCJvYmplY3RcIiAmJiB0ZXh0ICE9IG51bGwgKVxyXG5cdFx0XHRyZXR1cm4gdGhpcy5lbXB0eSgpLmFwcGVuZCggZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoIHRleHQgKSApO1xyXG5cclxuXHRcdHZhciByZXQgPSBcIlwiO1xyXG5cclxuXHRcdGpRdWVyeS5lYWNoKCB0ZXh0IHx8IHRoaXMsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdGpRdWVyeS5lYWNoKCB0aGlzLmNoaWxkTm9kZXMsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0aWYgKCB0aGlzLm5vZGVUeXBlICE9IDggKVxyXG5cdFx0XHRcdFx0cmV0ICs9IHRoaXMubm9kZVR5cGUgIT0gMSA/XHJcblx0XHRcdFx0XHRcdHRoaXMubm9kZVZhbHVlIDpcclxuXHRcdFx0XHRcdFx0alF1ZXJ5LmZuLnRleHQoIFsgdGhpcyBdICk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIHJldDtcclxuXHR9LFxyXG5cclxuXHR3cmFwQWxsOiBmdW5jdGlvbiggaHRtbCApIHtcclxuXHRcdGlmICggdGhpc1swXSApXHJcblx0XHRcdC8vIFRoZSBlbGVtZW50cyB0byB3cmFwIHRoZSB0YXJnZXQgYXJvdW5kXHJcblx0XHRcdGpRdWVyeSggaHRtbCwgdGhpc1swXS5vd25lckRvY3VtZW50IClcclxuXHRcdFx0XHQuY2xvbmUoKVxyXG5cdFx0XHRcdC5pbnNlcnRCZWZvcmUoIHRoaXNbMF0gKVxyXG5cdFx0XHRcdC5tYXAoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdHZhciBlbGVtID0gdGhpcztcclxuXHJcblx0XHRcdFx0XHR3aGlsZSAoIGVsZW0uZmlyc3RDaGlsZCApXHJcblx0XHRcdFx0XHRcdGVsZW0gPSBlbGVtLmZpcnN0Q2hpbGQ7XHJcblxyXG5cdFx0XHRcdFx0cmV0dXJuIGVsZW07XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0XHQuYXBwZW5kKHRoaXMpO1xyXG5cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdHdyYXBJbm5lcjogZnVuY3Rpb24oIGh0bWwgKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7XHJcblx0XHRcdGpRdWVyeSggdGhpcyApLmNvbnRlbnRzKCkud3JhcEFsbCggaHRtbCApO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHJcblx0d3JhcDogZnVuY3Rpb24oIGh0bWwgKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7XHJcblx0XHRcdGpRdWVyeSggdGhpcyApLndyYXBBbGwoIGh0bWwgKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdGFwcGVuZDogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5kb21NYW5pcChhcmd1bWVudHMsIHRydWUsIGZhbHNlLCBmdW5jdGlvbihlbGVtKXtcclxuXHRcdFx0dGhpcy5hcHBlbmRDaGlsZCggZWxlbSApO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHJcblx0cHJlcGVuZDogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5kb21NYW5pcChhcmd1bWVudHMsIHRydWUsIHRydWUsIGZ1bmN0aW9uKGVsZW0pe1xyXG5cdFx0XHR0aGlzLmluc2VydEJlZm9yZSggZWxlbSwgdGhpcy5maXJzdENoaWxkICk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdFxyXG5cdGJlZm9yZTogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5kb21NYW5pcChhcmd1bWVudHMsIGZhbHNlLCBmYWxzZSwgZnVuY3Rpb24oZWxlbSl7XHJcblx0XHRcdHRoaXMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoIGVsZW0sIHRoaXMgKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdGFmdGVyOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiB0aGlzLmRvbU1hbmlwKGFyZ3VtZW50cywgZmFsc2UsIHRydWUsIGZ1bmN0aW9uKGVsZW0pe1xyXG5cdFx0XHR0aGlzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKCBlbGVtLCB0aGlzLm5leHRTaWJsaW5nICk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cclxuXHRlbmQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMucHJldk9iamVjdCB8fCBqUXVlcnkoIFtdICk7XHJcblx0fSxcclxuXHJcblx0ZmluZDogZnVuY3Rpb24oIHNlbGVjdG9yICkge1xyXG5cdFx0dmFyIGVsZW1zID0galF1ZXJ5Lm1hcCh0aGlzLCBmdW5jdGlvbihlbGVtKXtcclxuXHRcdFx0cmV0dXJuIGpRdWVyeS5maW5kKCBzZWxlY3RvciwgZWxlbSApO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMucHVzaFN0YWNrKCAvW14rPl0gW14rPl0vLnRlc3QoIHNlbGVjdG9yICkgfHwgc2VsZWN0b3IuaW5kZXhPZihcIi4uXCIpID4gLTEgP1xyXG5cdFx0XHRqUXVlcnkudW5pcXVlKCBlbGVtcyApIDpcclxuXHRcdFx0ZWxlbXMgKTtcclxuXHR9LFxyXG5cclxuXHRjbG9uZTogZnVuY3Rpb24oIGV2ZW50cyApIHtcclxuXHRcdC8vIERvIHRoZSBjbG9uZVxyXG5cdFx0dmFyIHJldCA9IHRoaXMubWFwKGZ1bmN0aW9uKCl7XHJcblx0XHRcdHJldHVybiB0aGlzLm91dGVySFRNTCA/XHJcblx0XHRcdFx0alF1ZXJ5KCB0aGlzLm91dGVySFRNTCApWzBdIDpcclxuXHRcdFx0XHR0aGlzLmNsb25lTm9kZSggdHJ1ZSApO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0Ly8gTmVlZCB0byBzZXQgdGhlIGV4cGFuZG8gdG8gbnVsbCBvbiB0aGUgY2xvbmVkIHNldCBpZiBpdCBleGlzdHNcclxuXHRcdC8vIHJlbW92ZURhdGEgZG9lc24ndCB3b3JrIGhlcmUsIElFIHJlbW92ZXMgaXQgZnJvbSB0aGUgb3JpZ2luYWwgYXMgd2VsbFxyXG5cdFx0Ly8gdGhpcyBpcyBwcmltYXJpbHkgZm9yIElFIGJ1dCB0aGUgZGF0YSBleHBhbmRvIHNob3VsZG4ndCBiZSBjb3BpZWQgb3ZlciBpbiBhbnkgYnJvd3NlclxyXG5cdFx0dmFyIGNsb25lID0gcmV0LmZpbmQoXCIqXCIpLmFuZFNlbGYoKS5lYWNoKGZ1bmN0aW9uKCl7XHJcblx0XHRcdGlmICggdGhpc1sgZXhwYW5kbyBdICE9IHVuZGVmaW5lZCApXHJcblx0XHRcdFx0dGhpc1sgZXhwYW5kbyBdID0gbnVsbDtcclxuXHRcdH0pO1xyXG5cdFx0XHJcblx0XHQvLyBDb3B5IHRoZSBldmVudHMgZnJvbSB0aGUgb3JpZ2luYWwgdG8gdGhlIGNsb25lXHJcblx0XHRpZiAoIGV2ZW50cyA9PT0gdHJ1ZSApXHJcblx0XHRcdHRoaXMuZmluZChcIipcIikuYW5kU2VsZigpLmVhY2goZnVuY3Rpb24oaSl7XHJcblx0XHRcdFx0dmFyIGV2ZW50cyA9IGpRdWVyeS5kYXRhKCB0aGlzLCBcImV2ZW50c1wiICk7XHJcblxyXG5cdFx0XHRcdGZvciAoIHZhciB0eXBlIGluIGV2ZW50cyApXHJcblx0XHRcdFx0XHRmb3IgKCB2YXIgaGFuZGxlciBpbiBldmVudHNbIHR5cGUgXSApXHJcblx0XHRcdFx0XHRcdGpRdWVyeS5ldmVudC5hZGQoIGNsb25lWyBpIF0sIHR5cGUsIGV2ZW50c1sgdHlwZSBdWyBoYW5kbGVyIF0sIGV2ZW50c1sgdHlwZSBdWyBoYW5kbGVyIF0uZGF0YSApO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHQvLyBSZXR1cm4gdGhlIGNsb25lZCBzZXRcclxuXHRcdHJldHVybiByZXQ7XHJcblx0fSxcclxuXHJcblx0ZmlsdGVyOiBmdW5jdGlvbiggc2VsZWN0b3IgKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5wdXNoU3RhY2soXHJcblx0XHRcdGpRdWVyeS5pc0Z1bmN0aW9uKCBzZWxlY3RvciApICYmXHJcblx0XHRcdGpRdWVyeS5ncmVwKHRoaXMsIGZ1bmN0aW9uKGVsZW0sIGkpe1xyXG5cdFx0XHRcdHJldHVybiBzZWxlY3Rvci5jYWxsKCBlbGVtLCBpICk7XHJcblx0XHRcdH0pIHx8XHJcblxyXG5cdFx0XHRqUXVlcnkubXVsdGlGaWx0ZXIoIHNlbGVjdG9yLCB0aGlzICkgKTtcclxuXHR9LFxyXG5cclxuXHRub3Q6IGZ1bmN0aW9uKCBzZWxlY3RvciApIHtcclxuXHRcdHJldHVybiB0aGlzLnB1c2hTdGFjayhcclxuXHRcdFx0c2VsZWN0b3IuY29uc3RydWN0b3IgPT0gU3RyaW5nICYmXHJcblx0XHRcdGpRdWVyeS5tdWx0aUZpbHRlciggc2VsZWN0b3IsIHRoaXMsIHRydWUgKSB8fFxyXG5cclxuXHRcdFx0alF1ZXJ5LmdyZXAodGhpcywgZnVuY3Rpb24oZWxlbSkge1xyXG5cdFx0XHRcdHJldHVybiBzZWxlY3Rvci5jb25zdHJ1Y3RvciA9PSBBcnJheSB8fCBzZWxlY3Rvci5qcXVlcnkgP1xyXG5cdFx0XHRcdFx0alF1ZXJ5LmluQXJyYXkoIGVsZW0sIHNlbGVjdG9yICkgPCAwIDpcclxuXHRcdFx0XHRcdGVsZW0gIT0gc2VsZWN0b3I7XHJcblx0XHRcdH0pICk7XHJcblx0fSxcclxuXHJcblx0YWRkOiBmdW5jdGlvbiggc2VsZWN0b3IgKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5wdXNoU3RhY2soIGpRdWVyeS5tZXJnZSggXHJcblx0XHRcdHRoaXMuZ2V0KCksXHJcblx0XHRcdHNlbGVjdG9yLmNvbnN0cnVjdG9yID09IFN0cmluZyA/IFxyXG5cdFx0XHRcdGpRdWVyeSggc2VsZWN0b3IgKS5nZXQoKSA6XHJcblx0XHRcdFx0c2VsZWN0b3IubGVuZ3RoICE9IHVuZGVmaW5lZCAmJiAoIXNlbGVjdG9yLm5vZGVOYW1lIHx8IGpRdWVyeS5ub2RlTmFtZShzZWxlY3RvciwgXCJmb3JtXCIpKSA/XHJcblx0XHRcdFx0XHRzZWxlY3RvciA6IFtzZWxlY3Rvcl0gKSApO1xyXG5cdH0sXHJcblxyXG5cdGlzOiBmdW5jdGlvbiggc2VsZWN0b3IgKSB7XHJcblx0XHRyZXR1cm4gc2VsZWN0b3IgP1xyXG5cdFx0XHRqUXVlcnkubXVsdGlGaWx0ZXIoIHNlbGVjdG9yLCB0aGlzICkubGVuZ3RoID4gMCA6XHJcblx0XHRcdGZhbHNlO1xyXG5cdH0sXHJcblxyXG5cdGhhc0NsYXNzOiBmdW5jdGlvbiggc2VsZWN0b3IgKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5pcyggXCIuXCIgKyBzZWxlY3RvciApO1xyXG5cdH0sXHJcblx0XHJcblx0dmFsOiBmdW5jdGlvbiggdmFsdWUgKSB7XHJcblx0XHRpZiAoIHZhbHVlID09IHVuZGVmaW5lZCApIHtcclxuXHJcblx0XHRcdGlmICggdGhpcy5sZW5ndGggKSB7XHJcblx0XHRcdFx0dmFyIGVsZW0gPSB0aGlzWzBdO1xyXG5cdFx0ICAgIFx0XHJcblx0XHRcdFx0Ly8gV2UgbmVlZCB0byBoYW5kbGUgc2VsZWN0IGJveGVzIHNwZWNpYWxcclxuXHRcdFx0XHRpZiAoIGpRdWVyeS5ub2RlTmFtZSggZWxlbSwgXCJzZWxlY3RcIiApICkge1xyXG5cdFx0XHRcdFx0dmFyIGluZGV4ID0gZWxlbS5zZWxlY3RlZEluZGV4LFxyXG5cdFx0XHRcdFx0XHR2YWx1ZXMgPSBbXSxcclxuXHRcdFx0XHRcdFx0b3B0aW9ucyA9IGVsZW0ub3B0aW9ucyxcclxuXHRcdFx0XHRcdFx0b25lID0gZWxlbS50eXBlID09IFwic2VsZWN0LW9uZVwiO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHQvLyBOb3RoaW5nIHdhcyBzZWxlY3RlZFxyXG5cdFx0XHRcdFx0aWYgKCBpbmRleCA8IDAgKVxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcclxuXHJcblx0XHRcdFx0XHQvLyBMb29wIHRocm91Z2ggYWxsIHRoZSBzZWxlY3RlZCBvcHRpb25zXHJcblx0XHRcdFx0XHRmb3IgKCB2YXIgaSA9IG9uZSA/IGluZGV4IDogMCwgbWF4ID0gb25lID8gaW5kZXggKyAxIDogb3B0aW9ucy5sZW5ndGg7IGkgPCBtYXg7IGkrKyApIHtcclxuXHRcdFx0XHRcdFx0dmFyIG9wdGlvbiA9IG9wdGlvbnNbIGkgXTtcclxuXHJcblx0XHRcdFx0XHRcdGlmICggb3B0aW9uLnNlbGVjdGVkICkge1xyXG5cdFx0XHRcdFx0XHRcdC8vIEdldCB0aGUgc3BlY2lmYyB2YWx1ZSBmb3IgdGhlIG9wdGlvblxyXG5cdFx0XHRcdFx0XHRcdHZhbHVlID0galF1ZXJ5LmJyb3dzZXIubXNpZSAmJiAhb3B0aW9uLmF0dHJpYnV0ZXMudmFsdWUuc3BlY2lmaWVkID8gb3B0aW9uLnRleHQgOiBvcHRpb24udmFsdWU7XHJcblx0XHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdFx0Ly8gV2UgZG9uJ3QgbmVlZCBhbiBhcnJheSBmb3Igb25lIHNlbGVjdHNcclxuXHRcdFx0XHRcdFx0XHRpZiAoIG9uZSApXHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gdmFsdWU7XHJcblx0XHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdFx0Ly8gTXVsdGktU2VsZWN0cyByZXR1cm4gYW4gYXJyYXlcclxuXHRcdFx0XHRcdFx0XHR2YWx1ZXMucHVzaCggdmFsdWUgKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRyZXR1cm4gdmFsdWVzO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0Ly8gRXZlcnl0aGluZyBlbHNlLCB3ZSBqdXN0IGdyYWIgdGhlIHZhbHVlXHJcblx0XHRcdFx0fSBlbHNlXHJcblx0XHRcdFx0XHRyZXR1cm4gdGhpc1swXS52YWx1ZS5yZXBsYWNlKC9cXHIvZywgXCJcIik7XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fSBlbHNlXHJcblx0XHRcdHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRpZiAoIHZhbHVlLmNvbnN0cnVjdG9yID09IEFycmF5ICYmIC9yYWRpb3xjaGVja2JveC8udGVzdCggdGhpcy50eXBlICkgKVxyXG5cdFx0XHRcdFx0dGhpcy5jaGVja2VkID0gKGpRdWVyeS5pbkFycmF5KHRoaXMudmFsdWUsIHZhbHVlKSA+PSAwIHx8XHJcblx0XHRcdFx0XHRcdGpRdWVyeS5pbkFycmF5KHRoaXMubmFtZSwgdmFsdWUpID49IDApO1xyXG5cclxuXHRcdFx0XHRlbHNlIGlmICggalF1ZXJ5Lm5vZGVOYW1lKCB0aGlzLCBcInNlbGVjdFwiICkgKSB7XHJcblx0XHRcdFx0XHR2YXIgdmFsdWVzID0gdmFsdWUuY29uc3RydWN0b3IgPT0gQXJyYXkgP1xyXG5cdFx0XHRcdFx0XHR2YWx1ZSA6XHJcblx0XHRcdFx0XHRcdFsgdmFsdWUgXTtcclxuXHJcblx0XHRcdFx0XHRqUXVlcnkoIFwib3B0aW9uXCIsIHRoaXMgKS5lYWNoKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHRcdHRoaXMuc2VsZWN0ZWQgPSAoalF1ZXJ5LmluQXJyYXkoIHRoaXMudmFsdWUsIHZhbHVlcyApID49IDAgfHxcclxuXHRcdFx0XHRcdFx0XHRqUXVlcnkuaW5BcnJheSggdGhpcy50ZXh0LCB2YWx1ZXMgKSA+PSAwKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdGlmICggIXZhbHVlcy5sZW5ndGggKVxyXG5cdFx0XHRcdFx0XHR0aGlzLnNlbGVjdGVkSW5kZXggPSAtMTtcclxuXHJcblx0XHRcdFx0fSBlbHNlXHJcblx0XHRcdFx0XHR0aGlzLnZhbHVlID0gdmFsdWU7XHJcblx0XHRcdH0pO1xyXG5cdH0sXHJcblx0XHJcblx0aHRtbDogZnVuY3Rpb24oIHZhbHVlICkge1xyXG5cdFx0cmV0dXJuIHZhbHVlID09IHVuZGVmaW5lZCA/XHJcblx0XHRcdCh0aGlzLmxlbmd0aCA/XHJcblx0XHRcdFx0dGhpc1swXS5pbm5lckhUTUwgOlxyXG5cdFx0XHRcdG51bGwpIDpcclxuXHRcdFx0dGhpcy5lbXB0eSgpLmFwcGVuZCggdmFsdWUgKTtcclxuXHR9LFxyXG5cclxuXHRyZXBsYWNlV2l0aDogZnVuY3Rpb24oIHZhbHVlICkge1xyXG5cdFx0cmV0dXJuIHRoaXMuYWZ0ZXIoIHZhbHVlICkucmVtb3ZlKCk7XHJcblx0fSxcclxuXHJcblx0ZXE6IGZ1bmN0aW9uKCBpICkge1xyXG5cdFx0cmV0dXJuIHRoaXMuc2xpY2UoIGksIGkgKyAxICk7XHJcblx0fSxcclxuXHJcblx0c2xpY2U6IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMucHVzaFN0YWNrKCBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApICk7XHJcblx0fSxcclxuXHJcblx0bWFwOiBmdW5jdGlvbiggY2FsbGJhY2sgKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5wdXNoU3RhY2soIGpRdWVyeS5tYXAodGhpcywgZnVuY3Rpb24oZWxlbSwgaSl7XHJcblx0XHRcdHJldHVybiBjYWxsYmFjay5jYWxsKCBlbGVtLCBpLCBlbGVtICk7XHJcblx0XHR9KSk7XHJcblx0fSxcclxuXHJcblx0YW5kU2VsZjogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5hZGQoIHRoaXMucHJldk9iamVjdCApO1xyXG5cdH0sXHJcblx0XHJcblx0ZG9tTWFuaXA6IGZ1bmN0aW9uKCBhcmdzLCB0YWJsZSwgcmV2ZXJzZSwgY2FsbGJhY2sgKSB7XHJcblx0XHR2YXIgY2xvbmUgPSB0aGlzLmxlbmd0aCA+IDEsIGVsZW1zOyBcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7XHJcblx0XHRcdGlmICggIWVsZW1zICkge1xyXG5cdFx0XHRcdGVsZW1zID0galF1ZXJ5LmNsZWFuKCBhcmdzLCB0aGlzLm93bmVyRG9jdW1lbnQgKTtcclxuXHJcblx0XHRcdFx0aWYgKCByZXZlcnNlIClcclxuXHRcdFx0XHRcdGVsZW1zLnJldmVyc2UoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIG9iaiA9IHRoaXM7XHJcblxyXG5cdFx0XHRpZiAoIHRhYmxlICYmIGpRdWVyeS5ub2RlTmFtZSggdGhpcywgXCJ0YWJsZVwiICkgJiYgalF1ZXJ5Lm5vZGVOYW1lKCBlbGVtc1swXSwgXCJ0clwiICkgKVxyXG5cdFx0XHRcdG9iaiA9IHRoaXMuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0Ym9keVwiKVswXSB8fCB0aGlzLmFwcGVuZENoaWxkKCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGJvZHlcIikgKTtcclxuXHJcblx0XHRcdHZhciBzY3JpcHRzID0galF1ZXJ5KCBbXSApO1xyXG5cclxuXHRcdFx0alF1ZXJ5LmVhY2goZWxlbXMsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dmFyIGVsZW0gPSBjbG9uZSA/XHJcblx0XHRcdFx0XHR0aGlzLmNsb25lTm9kZSggdHJ1ZSApIDpcclxuXHRcdFx0XHRcdHRoaXM7XHJcblxyXG5cdFx0XHRcdGlmICggalF1ZXJ5Lm5vZGVOYW1lKCBlbGVtLCBcInNjcmlwdFwiICkgKSB7XHJcblxyXG5cdFx0XHRcdFx0Ly8gSWYgc2NyaXB0cyBhcmUgd2FpdGluZyB0byBiZSBleGVjdXRlZCwgd2FpdCBvbiB0aGlzIHNjcmlwdCBhcyB3ZWxsXHJcblx0XHRcdFx0XHRpZiAoIHNjcmlwdHMubGVuZ3RoIClcclxuXHRcdFx0XHRcdFx0c2NyaXB0cyA9IHNjcmlwdHMuYWRkKCBlbGVtICk7XHJcblxyXG5cdFx0XHRcdFx0Ly8gSWYgbm90aGluZyBpcyB3YWl0aW5nIHRvIGJlIGV4ZWN1dGVkLCBydW4gaW1tZWRpYXRlbHlcclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0ZXZhbFNjcmlwdCggMCwgZWxlbSApO1xyXG5cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Ly8gUmVtb3ZlIGFueSBpbm5lciBzY3JpcHRzIGZvciBsYXRlciBldmFsdWF0aW9uXHJcblx0XHRcdFx0XHRpZiAoIGVsZW0ubm9kZVR5cGUgPT0gMSApXHJcblx0XHRcdFx0XHRcdHNjcmlwdHMgPSBzY3JpcHRzLmFkZCggalF1ZXJ5KCBcInNjcmlwdFwiLCBlbGVtICkucmVtb3ZlKCkgKTtcclxuXHJcblx0XHRcdFx0XHQvLyBJbmplY3QgdGhlIGVsZW1lbnRzIGludG8gdGhlIGRvY3VtZW50XHJcblx0XHRcdFx0XHRjYWxsYmFjay5jYWxsKCBvYmosIGVsZW0gKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0c2NyaXB0cy5lYWNoKCBldmFsU2NyaXB0ICk7XHJcblx0XHR9KTtcclxuXHR9XHJcbn07XHJcblxyXG5mdW5jdGlvbiBldmFsU2NyaXB0KCBpLCBlbGVtICkge1xyXG5cdGlmICggZWxlbS5zcmMgKVxyXG5cdFx0alF1ZXJ5LmFqYXgoe1xyXG5cdFx0XHR1cmw6IGVsZW0uc3JjLFxyXG5cdFx0XHRhc3luYzogZmFsc2UsXHJcblx0XHRcdGRhdGFUeXBlOiBcInNjcmlwdFwiXHJcblx0XHR9KTtcclxuXHJcblx0ZWxzZVxyXG5cdFx0alF1ZXJ5Lmdsb2JhbEV2YWwoIGVsZW0udGV4dCB8fCBlbGVtLnRleHRDb250ZW50IHx8IGVsZW0uaW5uZXJIVE1MIHx8IFwiXCIgKTtcclxuXHJcblx0aWYgKCBlbGVtLnBhcmVudE5vZGUgKVxyXG5cdFx0ZWxlbS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKCBlbGVtICk7XHJcbn1cclxuXHJcbmpRdWVyeS5leHRlbmQgPSBqUXVlcnkuZm4uZXh0ZW5kID0gZnVuY3Rpb24oKSB7XHJcblx0Ly8gY29weSByZWZlcmVuY2UgdG8gdGFyZ2V0IG9iamVjdFxyXG5cdHZhciB0YXJnZXQgPSBhcmd1bWVudHNbMF0gfHwge30sIGkgPSAxLCBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoLCBkZWVwID0gZmFsc2UsIG9wdGlvbnM7XHJcblxyXG5cdC8vIEhhbmRsZSBhIGRlZXAgY29weSBzaXR1YXRpb25cclxuXHRpZiAoIHRhcmdldC5jb25zdHJ1Y3RvciA9PSBCb29sZWFuICkge1xyXG5cdFx0ZGVlcCA9IHRhcmdldDtcclxuXHRcdHRhcmdldCA9IGFyZ3VtZW50c1sxXSB8fCB7fTtcclxuXHR9XHJcblxyXG5cdC8vIGV4dGVuZCBqUXVlcnkgaXRzZWxmIGlmIG9ubHkgb25lIGFyZ3VtZW50IGlzIHBhc3NlZFxyXG5cdGlmICggbGVuZ3RoID09IDEgKSB7XHJcblx0XHR0YXJnZXQgPSB0aGlzO1xyXG5cdFx0aSA9IDA7XHJcblx0fVxyXG5cclxuXHRmb3IgKCA7IGkgPCBsZW5ndGg7IGkrKyApXHJcblx0XHQvLyBPbmx5IGRlYWwgd2l0aCBub24tbnVsbC91bmRlZmluZWQgdmFsdWVzXHJcblx0XHRpZiAoIChvcHRpb25zID0gYXJndW1lbnRzWyBpIF0pICE9IG51bGwgKVxyXG5cdFx0XHQvLyBFeHRlbmQgdGhlIGJhc2Ugb2JqZWN0XHJcblx0XHRcdGZvciAoIHZhciBuYW1lIGluIG9wdGlvbnMgKSB7XHJcblx0XHRcdFx0Ly8gUHJldmVudCBuZXZlci1lbmRpbmcgbG9vcFxyXG5cdFx0XHRcdGlmICggdGFyZ2V0ID09IG9wdGlvbnNbIG5hbWUgXSApXHJcblx0XHRcdFx0XHRjb250aW51ZTtcclxuXHJcblx0XHRcdFx0Ly8gUmVjdXJzZSBpZiB3ZSdyZSBtZXJnaW5nIG9iamVjdCB2YWx1ZXNcclxuXHRcdFx0XHRpZiAoIGRlZXAgJiYgdHlwZW9mIG9wdGlvbnNbIG5hbWUgXSA9PSBcIm9iamVjdFwiICYmIHRhcmdldFsgbmFtZSBdICYmICFvcHRpb25zWyBuYW1lIF0ubm9kZVR5cGUgKVxyXG5cdFx0XHRcdFx0alF1ZXJ5LmV4dGVuZCggdGFyZ2V0WyBuYW1lIF0sIG9wdGlvbnNbIG5hbWUgXSApO1xyXG5cclxuXHRcdFx0XHQvLyBEb24ndCBicmluZyBpbiB1bmRlZmluZWQgdmFsdWVzXHJcblx0XHRcdFx0ZWxzZSBpZiAoIG9wdGlvbnNbIG5hbWUgXSAhPSB1bmRlZmluZWQgKVxyXG5cdFx0XHRcdFx0dGFyZ2V0WyBuYW1lIF0gPSBvcHRpb25zWyBuYW1lIF07XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdC8vIFJldHVybiB0aGUgbW9kaWZpZWQgb2JqZWN0XHJcblx0cmV0dXJuIHRhcmdldDtcclxufTtcclxuXHJcbnZhciBleHBhbmRvID0gXCJqUXVlcnlcIiArIChuZXcgRGF0ZSgpKS5nZXRUaW1lKCksIHV1aWQgPSAwLCB3aW5kb3dEYXRhID0ge307XHJcblxyXG4vLyBleGNsdWRlIHRoZSBmb2xsb3dpbmcgY3NzIHByb3BlcnRpZXMgdG8gYWRkIHB4XHJcbnZhciBleGNsdWRlID0gL3otP2luZGV4fGZvbnQtP3dlaWdodHxvcGFjaXR5fHpvb218bGluZS0/aGVpZ2h0L2k7XHJcblxyXG5qUXVlcnkuZXh0ZW5kKHtcclxuXHRub0NvbmZsaWN0OiBmdW5jdGlvbiggZGVlcCApIHtcclxuXHRcdHdpbmRvdy4kID0gXyQ7XHJcblxyXG5cdFx0aWYgKCBkZWVwIClcclxuXHRcdFx0d2luZG93LmpRdWVyeSA9IF9qUXVlcnk7XHJcblxyXG5cdFx0cmV0dXJuIGpRdWVyeTtcclxuXHR9LFxyXG5cclxuXHQvLyBUaGlzIG1heSBzZWVtIGxpa2Ugc29tZSBjcmF6eSBjb2RlLCBidXQgdHJ1c3QgbWUgd2hlbiBJIHNheSB0aGF0IHRoaXNcclxuXHQvLyBpcyB0aGUgb25seSBjcm9zcy1icm93c2VyIHdheSB0byBkbyB0aGlzLiAtLUpvaG5cclxuXHRpc0Z1bmN0aW9uOiBmdW5jdGlvbiggZm4gKSB7XHJcblx0XHRyZXR1cm4gISFmbiAmJiB0eXBlb2YgZm4gIT0gXCJzdHJpbmdcIiAmJiAhZm4ubm9kZU5hbWUgJiYgXHJcblx0XHRcdGZuLmNvbnN0cnVjdG9yICE9IEFycmF5ICYmIC9mdW5jdGlvbi9pLnRlc3QoIGZuICsgXCJcIiApO1xyXG5cdH0sXHJcblx0XHJcblx0Ly8gY2hlY2sgaWYgYW4gZWxlbWVudCBpcyBpbiBhIChvciBpcyBhbikgWE1MIGRvY3VtZW50XHJcblx0aXNYTUxEb2M6IGZ1bmN0aW9uKCBlbGVtICkge1xyXG5cdFx0cmV0dXJuIGVsZW0uZG9jdW1lbnRFbGVtZW50ICYmICFlbGVtLmJvZHkgfHxcclxuXHRcdFx0ZWxlbS50YWdOYW1lICYmIGVsZW0ub3duZXJEb2N1bWVudCAmJiAhZWxlbS5vd25lckRvY3VtZW50LmJvZHk7XHJcblx0fSxcclxuXHJcblx0Ly8gRXZhbHVsYXRlcyBhIHNjcmlwdCBpbiBhIGdsb2JhbCBjb250ZXh0XHJcblx0Ly8gRXZhbHVhdGVzIEFzeW5jLiBpbiBTYWZhcmkgMiA6LShcclxuXHRnbG9iYWxFdmFsOiBmdW5jdGlvbiggZGF0YSApIHtcclxuXHRcdGRhdGEgPSBqUXVlcnkudHJpbSggZGF0YSApO1xyXG5cclxuXHRcdGlmICggZGF0YSApIHtcclxuXHRcdFx0Ly8gSW5zcGlyZWQgYnkgY29kZSBieSBBbmRyZWEgR2lhbW1hcmNoaVxyXG5cdFx0XHQvLyBodHRwOi8vd2VicmVmbGVjdGlvbi5ibG9nc3BvdC5jb20vMjAwNy8wOC9nbG9iYWwtc2NvcGUtZXZhbHVhdGlvbi1hbmQtZG9tLmh0bWxcclxuXHRcdFx0dmFyIGhlYWQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF0gfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LFxyXG5cdFx0XHRcdHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XHJcblxyXG5cdFx0XHRzY3JpcHQudHlwZSA9IFwidGV4dC9qYXZhc2NyaXB0XCI7XHJcblx0XHRcdGlmICggalF1ZXJ5LmJyb3dzZXIubXNpZSApXHJcblx0XHRcdFx0c2NyaXB0LnRleHQgPSBkYXRhO1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0c2NyaXB0LmFwcGVuZENoaWxkKCBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSggZGF0YSApICk7XHJcblxyXG5cdFx0XHRoZWFkLmFwcGVuZENoaWxkKCBzY3JpcHQgKTtcclxuXHRcdFx0aGVhZC5yZW1vdmVDaGlsZCggc2NyaXB0ICk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0bm9kZU5hbWU6IGZ1bmN0aW9uKCBlbGVtLCBuYW1lICkge1xyXG5cdFx0cmV0dXJuIGVsZW0ubm9kZU5hbWUgJiYgZWxlbS5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpID09IG5hbWUudG9VcHBlckNhc2UoKTtcclxuXHR9LFxyXG5cdFxyXG5cdGNhY2hlOiB7fSxcclxuXHRcclxuXHRkYXRhOiBmdW5jdGlvbiggZWxlbSwgbmFtZSwgZGF0YSApIHtcclxuXHRcdGVsZW0gPSBlbGVtID09IHdpbmRvdyA/XHJcblx0XHRcdHdpbmRvd0RhdGEgOlxyXG5cdFx0XHRlbGVtO1xyXG5cclxuXHRcdHZhciBpZCA9IGVsZW1bIGV4cGFuZG8gXTtcclxuXHJcblx0XHQvLyBDb21wdXRlIGEgdW5pcXVlIElEIGZvciB0aGUgZWxlbWVudFxyXG5cdFx0aWYgKCAhaWQgKSBcclxuXHRcdFx0aWQgPSBlbGVtWyBleHBhbmRvIF0gPSArK3V1aWQ7XHJcblxyXG5cdFx0Ly8gT25seSBnZW5lcmF0ZSB0aGUgZGF0YSBjYWNoZSBpZiB3ZSdyZVxyXG5cdFx0Ly8gdHJ5aW5nIHRvIGFjY2VzcyBvciBtYW5pcHVsYXRlIGl0XHJcblx0XHRpZiAoIG5hbWUgJiYgIWpRdWVyeS5jYWNoZVsgaWQgXSApXHJcblx0XHRcdGpRdWVyeS5jYWNoZVsgaWQgXSA9IHt9O1xyXG5cdFx0XHJcblx0XHQvLyBQcmV2ZW50IG92ZXJyaWRpbmcgdGhlIG5hbWVkIGNhY2hlIHdpdGggdW5kZWZpbmVkIHZhbHVlc1xyXG5cdFx0aWYgKCBkYXRhICE9IHVuZGVmaW5lZCApXHJcblx0XHRcdGpRdWVyeS5jYWNoZVsgaWQgXVsgbmFtZSBdID0gZGF0YTtcclxuXHRcdFxyXG5cdFx0Ly8gUmV0dXJuIHRoZSBuYW1lZCBjYWNoZSBkYXRhLCBvciB0aGUgSUQgZm9yIHRoZSBlbGVtZW50XHRcclxuXHRcdHJldHVybiBuYW1lID9cclxuXHRcdFx0alF1ZXJ5LmNhY2hlWyBpZCBdWyBuYW1lIF0gOlxyXG5cdFx0XHRpZDtcclxuXHR9LFxyXG5cdFxyXG5cdHJlbW92ZURhdGE6IGZ1bmN0aW9uKCBlbGVtLCBuYW1lICkge1xyXG5cdFx0ZWxlbSA9IGVsZW0gPT0gd2luZG93ID9cclxuXHRcdFx0d2luZG93RGF0YSA6XHJcblx0XHRcdGVsZW07XHJcblxyXG5cdFx0dmFyIGlkID0gZWxlbVsgZXhwYW5kbyBdO1xyXG5cclxuXHRcdC8vIElmIHdlIHdhbnQgdG8gcmVtb3ZlIGEgc3BlY2lmaWMgc2VjdGlvbiBvZiB0aGUgZWxlbWVudCdzIGRhdGFcclxuXHRcdGlmICggbmFtZSApIHtcclxuXHRcdFx0aWYgKCBqUXVlcnkuY2FjaGVbIGlkIF0gKSB7XHJcblx0XHRcdFx0Ly8gUmVtb3ZlIHRoZSBzZWN0aW9uIG9mIGNhY2hlIGRhdGFcclxuXHRcdFx0XHRkZWxldGUgalF1ZXJ5LmNhY2hlWyBpZCBdWyBuYW1lIF07XHJcblxyXG5cdFx0XHRcdC8vIElmIHdlJ3ZlIHJlbW92ZWQgYWxsIHRoZSBkYXRhLCByZW1vdmUgdGhlIGVsZW1lbnQncyBjYWNoZVxyXG5cdFx0XHRcdG5hbWUgPSBcIlwiO1xyXG5cclxuXHRcdFx0XHRmb3IgKCBuYW1lIGluIGpRdWVyeS5jYWNoZVsgaWQgXSApXHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0aWYgKCAhbmFtZSApXHJcblx0XHRcdFx0XHRqUXVlcnkucmVtb3ZlRGF0YSggZWxlbSApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0Ly8gT3RoZXJ3aXNlLCB3ZSB3YW50IHRvIHJlbW92ZSBhbGwgb2YgdGhlIGVsZW1lbnQncyBkYXRhXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQvLyBDbGVhbiB1cCB0aGUgZWxlbWVudCBleHBhbmRvXHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0ZGVsZXRlIGVsZW1bIGV4cGFuZG8gXTtcclxuXHRcdFx0fSBjYXRjaChlKXtcclxuXHRcdFx0XHQvLyBJRSBoYXMgdHJvdWJsZSBkaXJlY3RseSByZW1vdmluZyB0aGUgZXhwYW5kb1xyXG5cdFx0XHRcdC8vIGJ1dCBpdCdzIG9rIHdpdGggdXNpbmcgcmVtb3ZlQXR0cmlidXRlXHJcblx0XHRcdFx0aWYgKCBlbGVtLnJlbW92ZUF0dHJpYnV0ZSApXHJcblx0XHRcdFx0XHRlbGVtLnJlbW92ZUF0dHJpYnV0ZSggZXhwYW5kbyApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBDb21wbGV0ZWx5IHJlbW92ZSB0aGUgZGF0YSBjYWNoZVxyXG5cdFx0XHRkZWxldGUgalF1ZXJ5LmNhY2hlWyBpZCBdO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdC8vIGFyZ3MgaXMgZm9yIGludGVybmFsIHVzYWdlIG9ubHlcclxuXHRlYWNoOiBmdW5jdGlvbiggb2JqZWN0LCBjYWxsYmFjaywgYXJncyApIHtcclxuXHRcdGlmICggYXJncyApIHtcclxuXHRcdFx0aWYgKCBvYmplY3QubGVuZ3RoID09IHVuZGVmaW5lZCApXHJcblx0XHRcdFx0Zm9yICggdmFyIG5hbWUgaW4gb2JqZWN0IClcclxuXHRcdFx0XHRcdGNhbGxiYWNrLmFwcGx5KCBvYmplY3RbIG5hbWUgXSwgYXJncyApO1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0Zm9yICggdmFyIGkgPSAwLCBsZW5ndGggPSBvYmplY3QubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKysgKVxyXG5cdFx0XHRcdFx0aWYgKCBjYWxsYmFjay5hcHBseSggb2JqZWN0WyBpIF0sIGFyZ3MgKSA9PT0gZmFsc2UgKVxyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHQvLyBBIHNwZWNpYWwsIGZhc3QsIGNhc2UgZm9yIHRoZSBtb3N0IGNvbW1vbiB1c2Ugb2YgZWFjaFxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0aWYgKCBvYmplY3QubGVuZ3RoID09IHVuZGVmaW5lZCApXHJcblx0XHRcdFx0Zm9yICggdmFyIG5hbWUgaW4gb2JqZWN0IClcclxuXHRcdFx0XHRcdGNhbGxiYWNrLmNhbGwoIG9iamVjdFsgbmFtZSBdLCBuYW1lLCBvYmplY3RbIG5hbWUgXSApO1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0Zm9yICggdmFyIGkgPSAwLCBsZW5ndGggPSBvYmplY3QubGVuZ3RoLCB2YWx1ZSA9IG9iamVjdFswXTsgXHJcblx0XHRcdFx0XHRpIDwgbGVuZ3RoICYmIGNhbGxiYWNrLmNhbGwoIHZhbHVlLCBpLCB2YWx1ZSApICE9PSBmYWxzZTsgdmFsdWUgPSBvYmplY3RbKytpXSApe31cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gb2JqZWN0O1xyXG5cdH0sXHJcblx0XHJcblx0cHJvcDogZnVuY3Rpb24oIGVsZW0sIHZhbHVlLCB0eXBlLCBpLCBuYW1lICkge1xyXG5cdFx0XHQvLyBIYW5kbGUgZXhlY3V0YWJsZSBmdW5jdGlvbnNcclxuXHRcdFx0aWYgKCBqUXVlcnkuaXNGdW5jdGlvbiggdmFsdWUgKSApXHJcblx0XHRcdFx0dmFsdWUgPSB2YWx1ZS5jYWxsKCBlbGVtLCBpICk7XHJcblx0XHRcdFx0XHJcblx0XHRcdC8vIEhhbmRsZSBwYXNzaW5nIGluIGEgbnVtYmVyIHRvIGEgQ1NTIHByb3BlcnR5XHJcblx0XHRcdHJldHVybiB2YWx1ZSAmJiB2YWx1ZS5jb25zdHJ1Y3RvciA9PSBOdW1iZXIgJiYgdHlwZSA9PSBcImN1ckNTU1wiICYmICFleGNsdWRlLnRlc3QoIG5hbWUgKSA/XHJcblx0XHRcdFx0dmFsdWUgKyBcInB4XCIgOlxyXG5cdFx0XHRcdHZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGNsYXNzTmFtZToge1xyXG5cdFx0Ly8gaW50ZXJuYWwgb25seSwgdXNlIGFkZENsYXNzKFwiY2xhc3NcIilcclxuXHRcdGFkZDogZnVuY3Rpb24oIGVsZW0sIGNsYXNzTmFtZXMgKSB7XHJcblx0XHRcdGpRdWVyeS5lYWNoKChjbGFzc05hbWVzIHx8IFwiXCIpLnNwbGl0KC9cXHMrLyksIGZ1bmN0aW9uKGksIGNsYXNzTmFtZSl7XHJcblx0XHRcdFx0aWYgKCAhalF1ZXJ5LmNsYXNzTmFtZS5oYXMoIGVsZW0uY2xhc3NOYW1lLCBjbGFzc05hbWUgKSApXHJcblx0XHRcdFx0XHRlbGVtLmNsYXNzTmFtZSArPSAoZWxlbS5jbGFzc05hbWUgPyBcIiBcIiA6IFwiXCIpICsgY2xhc3NOYW1lO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gaW50ZXJuYWwgb25seSwgdXNlIHJlbW92ZUNsYXNzKFwiY2xhc3NcIilcclxuXHRcdHJlbW92ZTogZnVuY3Rpb24oIGVsZW0sIGNsYXNzTmFtZXMgKSB7XHJcblx0XHRcdGVsZW0uY2xhc3NOYW1lID0gY2xhc3NOYW1lcyAhPSB1bmRlZmluZWQgP1xyXG5cdFx0XHRcdGpRdWVyeS5ncmVwKGVsZW0uY2xhc3NOYW1lLnNwbGl0KC9cXHMrLyksIGZ1bmN0aW9uKGNsYXNzTmFtZSl7XHJcblx0XHRcdFx0XHRyZXR1cm4gIWpRdWVyeS5jbGFzc05hbWUuaGFzKCBjbGFzc05hbWVzLCBjbGFzc05hbWUgKTtcdFxyXG5cdFx0XHRcdH0pLmpvaW4oXCIgXCIpIDpcclxuXHRcdFx0XHRcIlwiO1xyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBpbnRlcm5hbCBvbmx5LCB1c2UgaXMoXCIuY2xhc3NcIilcclxuXHRcdGhhczogZnVuY3Rpb24oIGVsZW0sIGNsYXNzTmFtZSApIHtcclxuXHRcdFx0cmV0dXJuIGpRdWVyeS5pbkFycmF5KCBjbGFzc05hbWUsIChlbGVtLmNsYXNzTmFtZSB8fCBlbGVtKS50b1N0cmluZygpLnNwbGl0KC9cXHMrLykgKSA+IC0xO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdC8vIEEgbWV0aG9kIGZvciBxdWlja2x5IHN3YXBwaW5nIGluL291dCBDU1MgcHJvcGVydGllcyB0byBnZXQgY29ycmVjdCBjYWxjdWxhdGlvbnNcclxuXHRzd2FwOiBmdW5jdGlvbiggZWxlbSwgb3B0aW9ucywgY2FsbGJhY2sgKSB7XHJcblx0XHQvLyBSZW1lbWJlciB0aGUgb2xkIHZhbHVlcywgYW5kIGluc2VydCB0aGUgbmV3IG9uZXNcclxuXHRcdGZvciAoIHZhciBuYW1lIGluIG9wdGlvbnMgKSB7XHJcblx0XHRcdGVsZW0uc3R5bGVbIFwib2xkXCIgKyBuYW1lIF0gPSBlbGVtLnN0eWxlWyBuYW1lIF07XHJcblx0XHRcdGVsZW0uc3R5bGVbIG5hbWUgXSA9IG9wdGlvbnNbIG5hbWUgXTtcclxuXHRcdH1cclxuXHJcblx0XHRjYWxsYmFjay5jYWxsKCBlbGVtICk7XHJcblxyXG5cdFx0Ly8gUmV2ZXJ0IHRoZSBvbGQgdmFsdWVzXHJcblx0XHRmb3IgKCB2YXIgbmFtZSBpbiBvcHRpb25zIClcclxuXHRcdFx0ZWxlbS5zdHlsZVsgbmFtZSBdID0gZWxlbS5zdHlsZVsgXCJvbGRcIiArIG5hbWUgXTtcclxuXHR9LFxyXG5cclxuXHRjc3M6IGZ1bmN0aW9uKCBlbGVtLCBuYW1lICkge1xyXG5cdFx0aWYgKCBuYW1lID09IFwiaGVpZ2h0XCIgfHwgbmFtZSA9PSBcIndpZHRoXCIgKSB7XHJcblx0XHRcdHZhciBvbGQgPSB7fSwgaGVpZ2h0LCB3aWR0aDtcclxuXHJcblx0XHRcdC8vIFJldmVydCB0aGUgcGFkZGluZyBhbmQgYm9yZGVyIHdpZHRocyB0byBnZXQgdGhlXHJcblx0XHRcdC8vIGNvcnJlY3QgaGVpZ2h0L3dpZHRoIHZhbHVlc1xyXG5cdFx0XHRqUXVlcnkuZWFjaChbIFwiVG9wXCIsIFwiQm90dG9tXCIsIFwiUmlnaHRcIiwgXCJMZWZ0XCIgXSwgZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRvbGRbIFwicGFkZGluZ1wiICsgdGhpcyBdID0gMDtcclxuXHRcdFx0XHRvbGRbIFwiYm9yZGVyXCIgKyB0aGlzICsgXCJXaWR0aFwiIF0gPSAwO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdC8vIFN3YXAgb3V0IHRoZSBwYWRkaW5nL2JvcmRlciB2YWx1ZXMgdGVtcG9yYXJpbHlcclxuXHRcdFx0alF1ZXJ5LnN3YXAoIGVsZW0sIG9sZCwgZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0XHRcdC8vIElmIHRoZSBlbGVtZW50IGlzIHZpc2libGUsIHRoZW4gdGhlIGNhbGN1bGF0aW9uIGlzIGVhc3lcclxuXHRcdFx0XHRpZiAoIGpRdWVyeSggZWxlbSApLmlzKFwiOnZpc2libGVcIikgKSB7XHJcblx0XHRcdFx0XHRoZWlnaHQgPSBlbGVtLm9mZnNldEhlaWdodDtcclxuXHRcdFx0XHRcdHdpZHRoID0gZWxlbS5vZmZzZXRXaWR0aDtcclxuXHJcblx0XHRcdFx0Ly8gT3RoZXJ3aXNlLCB3ZSBuZWVkIHRvIGZsaXAgb3V0IG1vcmUgdmFsdWVzXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGVsZW0gPSBqUXVlcnkoIGVsZW0uY2xvbmVOb2RlKHRydWUpIClcclxuXHRcdFx0XHRcdFx0LmZpbmQoXCI6cmFkaW9cIikucmVtb3ZlQXR0cihcImNoZWNrZWRcIikuZW5kKClcclxuXHRcdFx0XHRcdFx0LmNzcyh7XHJcblx0XHRcdFx0XHRcdFx0dmlzaWJpbGl0eTogXCJoaWRkZW5cIixcclxuXHRcdFx0XHRcdFx0XHRwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLFxyXG5cdFx0XHRcdFx0XHRcdGRpc3BsYXk6IFwiYmxvY2tcIixcclxuXHRcdFx0XHRcdFx0XHRyaWdodDogXCIwXCIsXHJcblx0XHRcdFx0XHRcdFx0bGVmdDogXCIwXCJcclxuXHRcdFx0XHRcdFx0fSkuYXBwZW5kVG8oIGVsZW0ucGFyZW50Tm9kZSApWzBdO1xyXG5cclxuXHRcdFx0XHRcdHZhciBwb3NpdGlvbiA9IGpRdWVyeS5jc3MoIGVsZW0ucGFyZW50Tm9kZSwgXCJwb3NpdGlvblwiICkgfHwgXCJzdGF0aWNcIjtcclxuXHRcdFx0XHRcdGlmICggcG9zaXRpb24gPT0gXCJzdGF0aWNcIiApXHJcblx0XHRcdFx0XHRcdGVsZW0ucGFyZW50Tm9kZS5zdHlsZS5wb3NpdGlvbiA9IFwicmVsYXRpdmVcIjtcclxuXHJcblx0XHRcdFx0XHRoZWlnaHQgPSBlbGVtLmNsaWVudEhlaWdodDtcclxuXHRcdFx0XHRcdHdpZHRoID0gZWxlbS5jbGllbnRXaWR0aDtcclxuXHJcblx0XHRcdFx0XHRpZiAoIHBvc2l0aW9uID09IFwic3RhdGljXCIgKVxyXG5cdFx0XHRcdFx0XHRlbGVtLnBhcmVudE5vZGUuc3R5bGUucG9zaXRpb24gPSBcInN0YXRpY1wiO1xyXG5cclxuXHRcdFx0XHRcdGVsZW0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCggZWxlbSApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gbmFtZSA9PSBcImhlaWdodFwiID9cclxuXHRcdFx0XHRoZWlnaHQgOlxyXG5cdFx0XHRcdHdpZHRoO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBqUXVlcnkuY3VyQ1NTKCBlbGVtLCBuYW1lICk7XHJcblx0fSxcclxuXHJcblx0Y3VyQ1NTOiBmdW5jdGlvbiggZWxlbSwgbmFtZSwgZm9yY2UgKSB7XHJcblx0XHR2YXIgcmV0O1xyXG5cclxuXHRcdC8vIEEgaGVscGVyIG1ldGhvZCBmb3IgZGV0ZXJtaW5pbmcgaWYgYW4gZWxlbWVudCdzIHZhbHVlcyBhcmUgYnJva2VuXHJcblx0XHRmdW5jdGlvbiBjb2xvciggZWxlbSApIHtcclxuXHRcdFx0aWYgKCAhalF1ZXJ5LmJyb3dzZXIuc2FmYXJpIClcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblxyXG5cdFx0XHR2YXIgcmV0ID0gZG9jdW1lbnQuZGVmYXVsdFZpZXcuZ2V0Q29tcHV0ZWRTdHlsZSggZWxlbSwgbnVsbCApO1xyXG5cdFx0XHRyZXR1cm4gIXJldCB8fCByZXQuZ2V0UHJvcGVydHlWYWx1ZShcImNvbG9yXCIpID09IFwiXCI7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gV2UgbmVlZCB0byBoYW5kbGUgb3BhY2l0eSBzcGVjaWFsIGluIElFXHJcblx0XHRpZiAoIG5hbWUgPT0gXCJvcGFjaXR5XCIgJiYgalF1ZXJ5LmJyb3dzZXIubXNpZSApIHtcclxuXHRcdFx0cmV0ID0galF1ZXJ5LmF0dHIoIGVsZW0uc3R5bGUsIFwib3BhY2l0eVwiICk7XHJcblxyXG5cdFx0XHRyZXR1cm4gcmV0ID09IFwiXCIgP1xyXG5cdFx0XHRcdFwiMVwiIDpcclxuXHRcdFx0XHRyZXQ7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vIE1ha2Ugc3VyZSB3ZSdyZSB1c2luZyB0aGUgcmlnaHQgbmFtZSBmb3IgZ2V0dGluZyB0aGUgZmxvYXQgdmFsdWVcclxuXHRcdGlmICggbmFtZS5tYXRjaCggL2Zsb2F0L2kgKSApXHJcblx0XHRcdG5hbWUgPSBzdHlsZUZsb2F0O1xyXG5cclxuXHRcdGlmICggIWZvcmNlICYmIGVsZW0uc3R5bGVbIG5hbWUgXSApXHJcblx0XHRcdHJldCA9IGVsZW0uc3R5bGVbIG5hbWUgXTtcclxuXHJcblx0XHRlbHNlIGlmICggZG9jdW1lbnQuZGVmYXVsdFZpZXcgJiYgZG9jdW1lbnQuZGVmYXVsdFZpZXcuZ2V0Q29tcHV0ZWRTdHlsZSApIHtcclxuXHJcblx0XHRcdC8vIE9ubHkgXCJmbG9hdFwiIGlzIG5lZWRlZCBoZXJlXHJcblx0XHRcdGlmICggbmFtZS5tYXRjaCggL2Zsb2F0L2kgKSApXHJcblx0XHRcdFx0bmFtZSA9IFwiZmxvYXRcIjtcclxuXHJcblx0XHRcdG5hbWUgPSBuYW1lLnJlcGxhY2UoIC8oW0EtWl0pL2csIFwiLSQxXCIgKS50b0xvd2VyQ2FzZSgpO1xyXG5cclxuXHRcdFx0dmFyIGdldENvbXB1dGVkU3R5bGUgPSBkb2N1bWVudC5kZWZhdWx0Vmlldy5nZXRDb21wdXRlZFN0eWxlKCBlbGVtLCBudWxsICk7XHJcblxyXG5cdFx0XHRpZiAoIGdldENvbXB1dGVkU3R5bGUgJiYgIWNvbG9yKCBlbGVtICkgKVxyXG5cdFx0XHRcdHJldCA9IGdldENvbXB1dGVkU3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSggbmFtZSApO1xyXG5cclxuXHRcdFx0Ly8gSWYgdGhlIGVsZW1lbnQgaXNuJ3QgcmVwb3J0aW5nIGl0cyB2YWx1ZXMgcHJvcGVybHkgaW4gU2FmYXJpXHJcblx0XHRcdC8vIHRoZW4gc29tZSBkaXNwbGF5OiBub25lIGVsZW1lbnRzIGFyZSBpbnZvbHZlZFxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHR2YXIgc3dhcCA9IFtdLCBzdGFjayA9IFtdO1xyXG5cclxuXHRcdFx0XHQvLyBMb2NhdGUgYWxsIG9mIHRoZSBwYXJlbnQgZGlzcGxheTogbm9uZSBlbGVtZW50c1xyXG5cdFx0XHRcdGZvciAoIHZhciBhID0gZWxlbTsgYSAmJiBjb2xvcihhKTsgYSA9IGEucGFyZW50Tm9kZSApXHJcblx0XHRcdFx0XHRzdGFjay51bnNoaWZ0KGEpO1xyXG5cclxuXHRcdFx0XHQvLyBHbyB0aHJvdWdoIGFuZCBtYWtlIHRoZW0gdmlzaWJsZSwgYnV0IGluIHJldmVyc2VcclxuXHRcdFx0XHQvLyAoSXQgd291bGQgYmUgYmV0dGVyIGlmIHdlIGtuZXcgdGhlIGV4YWN0IGRpc3BsYXkgdHlwZSB0aGF0IHRoZXkgaGFkKVxyXG5cdFx0XHRcdGZvciAoIHZhciBpID0gMDsgaSA8IHN0YWNrLmxlbmd0aDsgaSsrIClcclxuXHRcdFx0XHRcdGlmICggY29sb3IoIHN0YWNrWyBpIF0gKSApIHtcclxuXHRcdFx0XHRcdFx0c3dhcFsgaSBdID0gc3RhY2tbIGkgXS5zdHlsZS5kaXNwbGF5O1xyXG5cdFx0XHRcdFx0XHRzdGFja1sgaSBdLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIFNpbmNlIHdlIGZsaXAgdGhlIGRpc3BsYXkgc3R5bGUsIHdlIGhhdmUgdG8gaGFuZGxlIHRoYXRcclxuXHRcdFx0XHQvLyBvbmUgc3BlY2lhbCwgb3RoZXJ3aXNlIGdldCB0aGUgdmFsdWVcclxuXHRcdFx0XHRyZXQgPSBuYW1lID09IFwiZGlzcGxheVwiICYmIHN3YXBbIHN0YWNrLmxlbmd0aCAtIDEgXSAhPSBudWxsID9cclxuXHRcdFx0XHRcdFwibm9uZVwiIDpcclxuXHRcdFx0XHRcdCggZ2V0Q29tcHV0ZWRTdHlsZSAmJiBnZXRDb21wdXRlZFN0eWxlLmdldFByb3BlcnR5VmFsdWUoIG5hbWUgKSApIHx8IFwiXCI7XHJcblxyXG5cdFx0XHRcdC8vIEZpbmFsbHksIHJldmVydCB0aGUgZGlzcGxheSBzdHlsZXMgYmFja1xyXG5cdFx0XHRcdGZvciAoIHZhciBpID0gMDsgaSA8IHN3YXAubGVuZ3RoOyBpKysgKVxyXG5cdFx0XHRcdFx0aWYgKCBzd2FwWyBpIF0gIT0gbnVsbCApXHJcblx0XHRcdFx0XHRcdHN0YWNrWyBpIF0uc3R5bGUuZGlzcGxheSA9IHN3YXBbIGkgXTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gV2Ugc2hvdWxkIGFsd2F5cyBnZXQgYSBudW1iZXIgYmFjayBmcm9tIG9wYWNpdHlcclxuXHRcdFx0aWYgKCBuYW1lID09IFwib3BhY2l0eVwiICYmIHJldCA9PSBcIlwiIClcclxuXHRcdFx0XHRyZXQgPSBcIjFcIjtcclxuXHJcblx0XHR9IGVsc2UgaWYgKCBlbGVtLmN1cnJlbnRTdHlsZSApIHtcclxuXHRcdFx0dmFyIGNhbWVsQ2FzZSA9IG5hbWUucmVwbGFjZSgvXFwtKFxcdykvZywgZnVuY3Rpb24oYWxsLCBsZXR0ZXIpe1xyXG5cdFx0XHRcdHJldHVybiBsZXR0ZXIudG9VcHBlckNhc2UoKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRyZXQgPSBlbGVtLmN1cnJlbnRTdHlsZVsgbmFtZSBdIHx8IGVsZW0uY3VycmVudFN0eWxlWyBjYW1lbENhc2UgXTtcclxuXHJcblx0XHRcdC8vIEZyb20gdGhlIGF3ZXNvbWUgaGFjayBieSBEZWFuIEVkd2FyZHNcclxuXHRcdFx0Ly8gaHR0cDovL2VyaWsuZWFlLm5ldC9hcmNoaXZlcy8yMDA3LzA3LzI3LzE4LjU0LjE1LyNjb21tZW50LTEwMjI5MVxyXG5cclxuXHRcdFx0Ly8gSWYgd2UncmUgbm90IGRlYWxpbmcgd2l0aCBhIHJlZ3VsYXIgcGl4ZWwgbnVtYmVyXHJcblx0XHRcdC8vIGJ1dCBhIG51bWJlciB0aGF0IGhhcyBhIHdlaXJkIGVuZGluZywgd2UgbmVlZCB0byBjb252ZXJ0IGl0IHRvIHBpeGVsc1xyXG5cdFx0XHRpZiAoICEvXlxcZCsocHgpPyQvaS50ZXN0KCByZXQgKSAmJiAvXlxcZC8udGVzdCggcmV0ICkgKSB7XHJcblx0XHRcdFx0Ly8gUmVtZW1iZXIgdGhlIG9yaWdpbmFsIHZhbHVlc1xyXG5cdFx0XHRcdHZhciBzdHlsZSA9IGVsZW0uc3R5bGUubGVmdCwgcnVudGltZVN0eWxlID0gZWxlbS5ydW50aW1lU3R5bGUubGVmdDtcclxuXHJcblx0XHRcdFx0Ly8gUHV0IGluIHRoZSBuZXcgdmFsdWVzIHRvIGdldCBhIGNvbXB1dGVkIHZhbHVlIG91dFxyXG5cdFx0XHRcdGVsZW0ucnVudGltZVN0eWxlLmxlZnQgPSBlbGVtLmN1cnJlbnRTdHlsZS5sZWZ0O1xyXG5cdFx0XHRcdGVsZW0uc3R5bGUubGVmdCA9IHJldCB8fCAwO1xyXG5cdFx0XHRcdHJldCA9IGVsZW0uc3R5bGUucGl4ZWxMZWZ0ICsgXCJweFwiO1xyXG5cclxuXHRcdFx0XHQvLyBSZXZlcnQgdGhlIGNoYW5nZWQgdmFsdWVzXHJcblx0XHRcdFx0ZWxlbS5zdHlsZS5sZWZ0ID0gc3R5bGU7XHJcblx0XHRcdFx0ZWxlbS5ydW50aW1lU3R5bGUubGVmdCA9IHJ1bnRpbWVTdHlsZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiByZXQ7XHJcblx0fSxcclxuXHRcclxuXHRjbGVhbjogZnVuY3Rpb24oIGVsZW1zLCBjb250ZXh0ICkge1xyXG5cdFx0dmFyIHJldCA9IFtdO1xyXG5cdFx0Y29udGV4dCA9IGNvbnRleHQgfHwgZG9jdW1lbnQ7XHJcblxyXG5cdFx0alF1ZXJ5LmVhY2goZWxlbXMsIGZ1bmN0aW9uKGksIGVsZW0pe1xyXG5cdFx0XHRpZiAoICFlbGVtIClcclxuXHRcdFx0XHRyZXR1cm47XHJcblxyXG5cdFx0XHRpZiAoIGVsZW0uY29uc3RydWN0b3IgPT0gTnVtYmVyIClcclxuXHRcdFx0XHRlbGVtID0gZWxlbS50b1N0cmluZygpO1xyXG5cdFx0XHRcclxuXHRcdFx0Ly8gQ29udmVydCBodG1sIHN0cmluZyBpbnRvIERPTSBub2Rlc1xyXG5cdFx0XHRpZiAoIHR5cGVvZiBlbGVtID09IFwic3RyaW5nXCIgKSB7XHJcblx0XHRcdFx0Ly8gRml4IFwiWEhUTUxcIi1zdHlsZSB0YWdzIGluIGFsbCBicm93c2Vyc1xyXG5cdFx0XHRcdGVsZW0gPSBlbGVtLnJlcGxhY2UoLyg8KFxcdyspW14+XSo/KVxcLz4vZywgZnVuY3Rpb24oYWxsLCBmcm9udCwgdGFnKXtcclxuXHRcdFx0XHRcdHJldHVybiB0YWcubWF0Y2goL14oYWJicnxicnxjb2x8aW1nfGlucHV0fGxpbmt8bWV0YXxwYXJhbXxocnxhcmVhKSQvaSkgP1xyXG5cdFx0XHRcdFx0XHRhbGwgOlxyXG5cdFx0XHRcdFx0XHRmcm9udCArIFwiPjwvXCIgKyB0YWcgKyBcIj5cIjtcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0Ly8gVHJpbSB3aGl0ZXNwYWNlLCBvdGhlcndpc2UgaW5kZXhPZiB3b24ndCB3b3JrIGFzIGV4cGVjdGVkXHJcblx0XHRcdFx0dmFyIHRhZ3MgPSBqUXVlcnkudHJpbSggZWxlbSApLnRvTG93ZXJDYXNlKCksIGRpdiA9IGNvbnRleHQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuXHJcblx0XHRcdFx0dmFyIHdyYXAgPVxyXG5cdFx0XHRcdFx0Ly8gb3B0aW9uIG9yIG9wdGdyb3VwXHJcblx0XHRcdFx0XHQhdGFncy5pbmRleE9mKFwiPG9wdFwiKSAmJlxyXG5cdFx0XHRcdFx0WyAxLCBcIjxzZWxlY3Q+XCIsIFwiPC9zZWxlY3Q+XCIgXSB8fFxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHQhdGFncy5pbmRleE9mKFwiPGxlZ1wiKSAmJlxyXG5cdFx0XHRcdFx0WyAxLCBcIjxmaWVsZHNldD5cIiwgXCI8L2ZpZWxkc2V0PlwiIF0gfHxcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0dGFncy5tYXRjaCgvXjwodGhlYWR8dGJvZHl8dGZvb3R8Y29sZ3xjYXApLykgJiZcclxuXHRcdFx0XHRcdFsgMSwgXCI8dGFibGU+XCIsIFwiPC90YWJsZT5cIiBdIHx8XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdCF0YWdzLmluZGV4T2YoXCI8dHJcIikgJiZcclxuXHRcdFx0XHRcdFsgMiwgXCI8dGFibGU+PHRib2R5PlwiLCBcIjwvdGJvZHk+PC90YWJsZT5cIiBdIHx8XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHQgXHQvLyA8dGhlYWQ+IG1hdGNoZWQgYWJvdmVcclxuXHRcdFx0XHRcdCghdGFncy5pbmRleE9mKFwiPHRkXCIpIHx8ICF0YWdzLmluZGV4T2YoXCI8dGhcIikpICYmXHJcblx0XHRcdFx0XHRbIDMsIFwiPHRhYmxlPjx0Ym9keT48dHI+XCIsIFwiPC90cj48L3Rib2R5PjwvdGFibGU+XCIgXSB8fFxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHQhdGFncy5pbmRleE9mKFwiPGNvbFwiKSAmJlxyXG5cdFx0XHRcdFx0WyAyLCBcIjx0YWJsZT48dGJvZHk+PC90Ym9keT48Y29sZ3JvdXA+XCIsIFwiPC9jb2xncm91cD48L3RhYmxlPlwiIF0gfHxcclxuXHJcblx0XHRcdFx0XHQvLyBJRSBjYW4ndCBzZXJpYWxpemUgPGxpbms+IGFuZCA8c2NyaXB0PiB0YWdzIG5vcm1hbGx5XHJcblx0XHRcdFx0XHRqUXVlcnkuYnJvd3Nlci5tc2llICYmXHJcblx0XHRcdFx0XHRbIDEsIFwiZGl2PGRpdj5cIiwgXCI8L2Rpdj5cIiBdIHx8XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFsgMCwgXCJcIiwgXCJcIiBdO1xyXG5cclxuXHRcdFx0XHQvLyBHbyB0byBodG1sIGFuZCBiYWNrLCB0aGVuIHBlZWwgb2ZmIGV4dHJhIHdyYXBwZXJzXHJcblx0XHRcdFx0ZGl2LmlubmVySFRNTCA9IHdyYXBbMV0gKyBlbGVtICsgd3JhcFsyXTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHQvLyBNb3ZlIHRvIHRoZSByaWdodCBkZXB0aFxyXG5cdFx0XHRcdHdoaWxlICggd3JhcFswXS0tIClcclxuXHRcdFx0XHRcdGRpdiA9IGRpdi5sYXN0Q2hpbGQ7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0Ly8gUmVtb3ZlIElFJ3MgYXV0b2luc2VydGVkIDx0Ym9keT4gZnJvbSB0YWJsZSBmcmFnbWVudHNcclxuXHRcdFx0XHRpZiAoIGpRdWVyeS5icm93c2VyLm1zaWUgKSB7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdC8vIFN0cmluZyB3YXMgYSA8dGFibGU+LCAqbWF5KiBoYXZlIHNwdXJpb3VzIDx0Ym9keT5cclxuXHRcdFx0XHRcdHZhciB0Ym9keSA9ICF0YWdzLmluZGV4T2YoXCI8dGFibGVcIikgJiYgdGFncy5pbmRleE9mKFwiPHRib2R5XCIpIDwgMCA/XHJcblx0XHRcdFx0XHRcdGRpdi5maXJzdENoaWxkICYmIGRpdi5maXJzdENoaWxkLmNoaWxkTm9kZXMgOlxyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0Ly8gU3RyaW5nIHdhcyBhIGJhcmUgPHRoZWFkPiBvciA8dGZvb3Q+XHJcblx0XHRcdFx0XHRcdHdyYXBbMV0gPT0gXCI8dGFibGU+XCIgJiYgdGFncy5pbmRleE9mKFwiPHRib2R5XCIpIDwgMCA/XHJcblx0XHRcdFx0XHRcdFx0ZGl2LmNoaWxkTm9kZXMgOlxyXG5cdFx0XHRcdFx0XHRcdFtdO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdFx0Zm9yICggdmFyIGkgPSB0Ym9keS5sZW5ndGggLSAxOyBpID49IDAgOyAtLWkgKVxyXG5cdFx0XHRcdFx0XHRpZiAoIGpRdWVyeS5ub2RlTmFtZSggdGJvZHlbIGkgXSwgXCJ0Ym9keVwiICkgJiYgIXRib2R5WyBpIF0uY2hpbGROb2Rlcy5sZW5ndGggKVxyXG5cdFx0XHRcdFx0XHRcdHRib2R5WyBpIF0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCggdGJvZHlbIGkgXSApO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHQvLyBJRSBjb21wbGV0ZWx5IGtpbGxzIGxlYWRpbmcgd2hpdGVzcGFjZSB3aGVuIGlubmVySFRNTCBpcyB1c2VkXHRcclxuXHRcdFx0XHRcdGlmICggL15cXHMvLnRlc3QoIGVsZW0gKSApXHRcclxuXHRcdFx0XHRcdFx0ZGl2Lmluc2VydEJlZm9yZSggY29udGV4dC5jcmVhdGVUZXh0Tm9kZSggZWxlbS5tYXRjaCgvXlxccyovKVswXSApLCBkaXYuZmlyc3RDaGlsZCApO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHRcdFx0XHRlbGVtID0galF1ZXJ5Lm1ha2VBcnJheSggZGl2LmNoaWxkTm9kZXMgKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKCBlbGVtLmxlbmd0aCA9PT0gMCAmJiAoIWpRdWVyeS5ub2RlTmFtZSggZWxlbSwgXCJmb3JtXCIgKSAmJiAhalF1ZXJ5Lm5vZGVOYW1lKCBlbGVtLCBcInNlbGVjdFwiICkpIClcclxuXHRcdFx0XHRyZXR1cm47XHJcblxyXG5cdFx0XHRpZiAoIGVsZW1bMF0gPT0gdW5kZWZpbmVkIHx8IGpRdWVyeS5ub2RlTmFtZSggZWxlbSwgXCJmb3JtXCIgKSB8fCBlbGVtLm9wdGlvbnMgKVxyXG5cdFx0XHRcdHJldC5wdXNoKCBlbGVtICk7XHJcblxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0cmV0ID0galF1ZXJ5Lm1lcmdlKCByZXQsIGVsZW0gKTtcclxuXHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gcmV0O1xyXG5cdH0sXHJcblx0XHJcblx0YXR0cjogZnVuY3Rpb24oIGVsZW0sIG5hbWUsIHZhbHVlICkge1xyXG5cdFx0dmFyIGZpeCA9IGpRdWVyeS5pc1hNTERvYyggZWxlbSApID9cclxuXHRcdFx0e30gOlxyXG5cdFx0XHRqUXVlcnkucHJvcHM7XHJcblxyXG5cdFx0Ly8gU2FmYXJpIG1pcy1yZXBvcnRzIHRoZSBkZWZhdWx0IHNlbGVjdGVkIHByb3BlcnR5IG9mIGEgaGlkZGVuIG9wdGlvblxyXG5cdFx0Ly8gQWNjZXNzaW5nIHRoZSBwYXJlbnQncyBzZWxlY3RlZEluZGV4IHByb3BlcnR5IGZpeGVzIGl0XHJcblx0XHRpZiAoIG5hbWUgPT0gXCJzZWxlY3RlZFwiICYmIGpRdWVyeS5icm93c2VyLnNhZmFyaSApXHJcblx0XHRcdGVsZW0ucGFyZW50Tm9kZS5zZWxlY3RlZEluZGV4O1xyXG5cdFx0XHJcblx0XHQvLyBDZXJ0YWluIGF0dHJpYnV0ZXMgb25seSB3b3JrIHdoZW4gYWNjZXNzZWQgdmlhIHRoZSBvbGQgRE9NIDAgd2F5XHJcblx0XHRpZiAoIGZpeFsgbmFtZSBdICkge1xyXG5cdFx0XHRpZiAoIHZhbHVlICE9IHVuZGVmaW5lZCApXHJcblx0XHRcdFx0ZWxlbVsgZml4WyBuYW1lIF0gXSA9IHZhbHVlO1xyXG5cclxuXHRcdFx0cmV0dXJuIGVsZW1bIGZpeFsgbmFtZSBdIF07XHJcblxyXG5cdFx0fSBlbHNlIGlmICggalF1ZXJ5LmJyb3dzZXIubXNpZSAmJiBuYW1lID09IFwic3R5bGVcIiApXHJcblx0XHRcdHJldHVybiBqUXVlcnkuYXR0ciggZWxlbS5zdHlsZSwgXCJjc3NUZXh0XCIsIHZhbHVlICk7XHJcblxyXG5cdFx0ZWxzZSBpZiAoIHZhbHVlID09IHVuZGVmaW5lZCAmJiBqUXVlcnkuYnJvd3Nlci5tc2llICYmIGpRdWVyeS5ub2RlTmFtZSggZWxlbSwgXCJmb3JtXCIgKSAmJiAobmFtZSA9PSBcImFjdGlvblwiIHx8IG5hbWUgPT0gXCJtZXRob2RcIikgKVxyXG5cdFx0XHRyZXR1cm4gZWxlbS5nZXRBdHRyaWJ1dGVOb2RlKCBuYW1lICkubm9kZVZhbHVlO1xyXG5cclxuXHRcdC8vIElFIGVsZW0uZ2V0QXR0cmlidXRlIHBhc3NlcyBldmVuIGZvciBzdHlsZVxyXG5cdFx0ZWxzZSBpZiAoIGVsZW0udGFnTmFtZSApIHtcclxuXHJcblx0XHRcdGlmICggdmFsdWUgIT0gdW5kZWZpbmVkICkge1xyXG5cdFx0XHRcdC8vIFdlIGNhbid0IGFsbG93IHRoZSB0eXBlIHByb3BlcnR5IHRvIGJlIGNoYW5nZWQgKHNpbmNlIGl0IGNhdXNlcyBwcm9ibGVtcyBpbiBJRSlcclxuXHRcdFx0XHRpZiAoIG5hbWUgPT0gXCJ0eXBlXCIgJiYgalF1ZXJ5Lm5vZGVOYW1lKCBlbGVtLCBcImlucHV0XCIgKSAmJiBlbGVtLnBhcmVudE5vZGUgKVxyXG5cdFx0XHRcdFx0dGhyb3cgXCJ0eXBlIHByb3BlcnR5IGNhbid0IGJlIGNoYW5nZWRcIjtcclxuXHJcblx0XHRcdFx0ZWxlbS5zZXRBdHRyaWJ1dGUoIG5hbWUsIHZhbHVlICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICggalF1ZXJ5LmJyb3dzZXIubXNpZSAmJiAvaHJlZnxzcmMvLnRlc3QoIG5hbWUgKSAmJiAhalF1ZXJ5LmlzWE1MRG9jKCBlbGVtICkgKSBcclxuXHRcdFx0XHRyZXR1cm4gZWxlbS5nZXRBdHRyaWJ1dGUoIG5hbWUsIDIgKTtcclxuXHJcblx0XHRcdHJldHVybiBlbGVtLmdldEF0dHJpYnV0ZSggbmFtZSApO1xyXG5cclxuXHRcdC8vIGVsZW0gaXMgYWN0dWFsbHkgZWxlbS5zdHlsZSAuLi4gc2V0IHRoZSBzdHlsZVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Ly8gSUUgYWN0dWFsbHkgdXNlcyBmaWx0ZXJzIGZvciBvcGFjaXR5XHJcblx0XHRcdGlmICggbmFtZSA9PSBcIm9wYWNpdHlcIiAmJiBqUXVlcnkuYnJvd3Nlci5tc2llICkge1xyXG5cdFx0XHRcdGlmICggdmFsdWUgIT0gdW5kZWZpbmVkICkge1xyXG5cdFx0XHRcdFx0Ly8gSUUgaGFzIHRyb3VibGUgd2l0aCBvcGFjaXR5IGlmIGl0IGRvZXMgbm90IGhhdmUgbGF5b3V0XHJcblx0XHRcdFx0XHQvLyBGb3JjZSBpdCBieSBzZXR0aW5nIHRoZSB6b29tIGxldmVsXHJcblx0XHRcdFx0XHRlbGVtLnpvb20gPSAxOyBcclxuXHRcclxuXHRcdFx0XHRcdC8vIFNldCB0aGUgYWxwaGEgZmlsdGVyIHRvIHNldCB0aGUgb3BhY2l0eVxyXG5cdFx0XHRcdFx0ZWxlbS5maWx0ZXIgPSAoZWxlbS5maWx0ZXIgfHwgXCJcIikucmVwbGFjZSggL2FscGhhXFwoW14pXSpcXCkvLCBcIlwiICkgK1xyXG5cdFx0XHRcdFx0XHQocGFyc2VGbG9hdCggdmFsdWUgKS50b1N0cmluZygpID09IFwiTmFOXCIgPyBcIlwiIDogXCJhbHBoYShvcGFjaXR5PVwiICsgdmFsdWUgKiAxMDAgKyBcIilcIik7XHJcblx0XHRcdFx0fVxyXG5cdFxyXG5cdFx0XHRcdHJldHVybiBlbGVtLmZpbHRlciA/IFxyXG5cdFx0XHRcdFx0KHBhcnNlRmxvYXQoIGVsZW0uZmlsdGVyLm1hdGNoKC9vcGFjaXR5PShbXildKikvKVsxXSApIC8gMTAwKS50b1N0cmluZygpIDpcclxuXHRcdFx0XHRcdFwiXCI7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdG5hbWUgPSBuYW1lLnJlcGxhY2UoLy0oW2Etel0pL2lnLCBmdW5jdGlvbihhbGwsIGxldHRlcil7XHJcblx0XHRcdFx0cmV0dXJuIGxldHRlci50b1VwcGVyQ2FzZSgpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdGlmICggdmFsdWUgIT0gdW5kZWZpbmVkIClcclxuXHRcdFx0XHRlbGVtWyBuYW1lIF0gPSB2YWx1ZTtcclxuXHJcblx0XHRcdHJldHVybiBlbGVtWyBuYW1lIF07XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHR0cmltOiBmdW5jdGlvbiggdGV4dCApIHtcclxuXHRcdHJldHVybiAodGV4dCB8fCBcIlwiKS5yZXBsYWNlKCAvXlxccyt8XFxzKyQvZywgXCJcIiApO1xyXG5cdH0sXHJcblxyXG5cdG1ha2VBcnJheTogZnVuY3Rpb24oIGFycmF5ICkge1xyXG5cdFx0dmFyIHJldCA9IFtdO1xyXG5cclxuXHRcdC8vIE5lZWQgdG8gdXNlIHR5cGVvZiB0byBmaWdodCBTYWZhcmkgY2hpbGROb2RlcyBjcmFzaGVzXHJcblx0XHRpZiAoIHR5cGVvZiBhcnJheSAhPSBcImFycmF5XCIgKVxyXG5cdFx0XHRmb3IgKCB2YXIgaSA9IDAsIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrIClcclxuXHRcdFx0XHRyZXQucHVzaCggYXJyYXlbIGkgXSApO1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXQgPSBhcnJheS5zbGljZSggMCApO1xyXG5cclxuXHRcdHJldHVybiByZXQ7XHJcblx0fSxcclxuXHJcblx0aW5BcnJheTogZnVuY3Rpb24oIGVsZW0sIGFycmF5ICkge1xyXG5cdFx0Zm9yICggdmFyIGkgPSAwLCBsZW5ndGggPSBhcnJheS5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKyApXHJcblx0XHRcdGlmICggYXJyYXlbIGkgXSA9PSBlbGVtIClcclxuXHRcdFx0XHRyZXR1cm4gaTtcclxuXHJcblx0XHRyZXR1cm4gLTE7XHJcblx0fSxcclxuXHJcblx0bWVyZ2U6IGZ1bmN0aW9uKCBmaXJzdCwgc2Vjb25kICkge1xyXG5cdFx0Ly8gV2UgaGF2ZSB0byBsb29wIHRoaXMgd2F5IGJlY2F1c2UgSUUgJiBPcGVyYSBvdmVyd3JpdGUgdGhlIGxlbmd0aFxyXG5cdFx0Ly8gZXhwYW5kbyBvZiBnZXRFbGVtZW50c0J5VGFnTmFtZVxyXG5cclxuXHRcdC8vIEFsc28sIHdlIG5lZWQgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIGNvcnJlY3QgZWxlbWVudHMgYXJlIGJlaW5nIHJldHVybmVkXHJcblx0XHQvLyAoSUUgcmV0dXJucyBjb21tZW50IG5vZGVzIGluIGEgJyonIHF1ZXJ5KVxyXG5cdFx0aWYgKCBqUXVlcnkuYnJvd3Nlci5tc2llICkge1xyXG5cdFx0XHRmb3IgKCB2YXIgaSA9IDA7IHNlY29uZFsgaSBdOyBpKysgKVxyXG5cdFx0XHRcdGlmICggc2Vjb25kWyBpIF0ubm9kZVR5cGUgIT0gOCApXHJcblx0XHRcdFx0XHRmaXJzdC5wdXNoKCBzZWNvbmRbIGkgXSApO1xyXG5cclxuXHRcdH0gZWxzZVxyXG5cdFx0XHRmb3IgKCB2YXIgaSA9IDA7IHNlY29uZFsgaSBdOyBpKysgKVxyXG5cdFx0XHRcdGZpcnN0LnB1c2goIHNlY29uZFsgaSBdICk7XHJcblxyXG5cdFx0cmV0dXJuIGZpcnN0O1xyXG5cdH0sXHJcblxyXG5cdHVuaXF1ZTogZnVuY3Rpb24oIGFycmF5ICkge1xyXG5cdFx0dmFyIHJldCA9IFtdLCBkb25lID0ge307XHJcblxyXG5cdFx0dHJ5IHtcclxuXHJcblx0XHRcdGZvciAoIHZhciBpID0gMCwgbGVuZ3RoID0gYXJyYXkubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKysgKSB7XHJcblx0XHRcdFx0dmFyIGlkID0galF1ZXJ5LmRhdGEoIGFycmF5WyBpIF0gKTtcclxuXHJcblx0XHRcdFx0aWYgKCAhZG9uZVsgaWQgXSApIHtcclxuXHRcdFx0XHRcdGRvbmVbIGlkIF0gPSB0cnVlO1xyXG5cdFx0XHRcdFx0cmV0LnB1c2goIGFycmF5WyBpIF0gKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHR9IGNhdGNoKCBlICkge1xyXG5cdFx0XHRyZXQgPSBhcnJheTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gcmV0O1xyXG5cdH0sXHJcblxyXG5cdGdyZXA6IGZ1bmN0aW9uKCBlbGVtcywgY2FsbGJhY2ssIGludiApIHtcclxuXHRcdC8vIElmIGEgc3RyaW5nIGlzIHBhc3NlZCBpbiBmb3IgdGhlIGZ1bmN0aW9uLCBtYWtlIGEgZnVuY3Rpb25cclxuXHRcdC8vIGZvciBpdCAoYSBoYW5keSBzaG9ydGN1dClcclxuXHRcdGlmICggdHlwZW9mIGNhbGxiYWNrID09IFwic3RyaW5nXCIgKVxyXG5cdFx0XHRjYWxsYmFjayA9IGV2YWwoXCJmYWxzZXx8ZnVuY3Rpb24oYSxpKXtyZXR1cm4gXCIgKyBjYWxsYmFjayArIFwifVwiKTtcclxuXHJcblx0XHR2YXIgcmV0ID0gW107XHJcblxyXG5cdFx0Ly8gR28gdGhyb3VnaCB0aGUgYXJyYXksIG9ubHkgc2F2aW5nIHRoZSBpdGVtc1xyXG5cdFx0Ly8gdGhhdCBwYXNzIHRoZSB2YWxpZGF0b3IgZnVuY3Rpb25cclxuXHRcdGZvciAoIHZhciBpID0gMCwgbGVuZ3RoID0gZWxlbXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKysgKVxyXG5cdFx0XHRpZiAoICFpbnYgJiYgY2FsbGJhY2soIGVsZW1zWyBpIF0sIGkgKSB8fCBpbnYgJiYgIWNhbGxiYWNrKCBlbGVtc1sgaSBdLCBpICkgKVxyXG5cdFx0XHRcdHJldC5wdXNoKCBlbGVtc1sgaSBdICk7XHJcblxyXG5cdFx0cmV0dXJuIHJldDtcclxuXHR9LFxyXG5cclxuXHRtYXA6IGZ1bmN0aW9uKCBlbGVtcywgY2FsbGJhY2sgKSB7XHJcblx0XHR2YXIgcmV0ID0gW107XHJcblxyXG5cdFx0Ly8gR28gdGhyb3VnaCB0aGUgYXJyYXksIHRyYW5zbGF0aW5nIGVhY2ggb2YgdGhlIGl0ZW1zIHRvIHRoZWlyXHJcblx0XHQvLyBuZXcgdmFsdWUgKG9yIHZhbHVlcykuXHJcblx0XHRmb3IgKCB2YXIgaSA9IDAsIGxlbmd0aCA9IGVsZW1zLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrICkge1xyXG5cdFx0XHR2YXIgdmFsdWUgPSBjYWxsYmFjayggZWxlbXNbIGkgXSwgaSApO1xyXG5cclxuXHRcdFx0aWYgKCB2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPSB1bmRlZmluZWQgKSB7XHJcblx0XHRcdFx0aWYgKCB2YWx1ZS5jb25zdHJ1Y3RvciAhPSBBcnJheSApXHJcblx0XHRcdFx0XHR2YWx1ZSA9IFsgdmFsdWUgXTtcclxuXHJcblx0XHRcdFx0cmV0ID0gcmV0LmNvbmNhdCggdmFsdWUgKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiByZXQ7XHJcblx0fVxyXG59KTtcclxuXHJcbnZhciB1c2VyQWdlbnQgPSBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCk7XHJcblxyXG4vLyBGaWd1cmUgb3V0IHdoYXQgYnJvd3NlciBpcyBiZWluZyB1c2VkXHJcbmpRdWVyeS5icm93c2VyID0ge1xyXG5cdHZlcnNpb246ICh1c2VyQWdlbnQubWF0Y2goIC8uKyg/OnJ2fGl0fHJhfGllKVtcXC86IF0oW1xcZC5dKykvICkgfHwgW10pWzFdLFxyXG5cdHNhZmFyaTogL3dlYmtpdC8udGVzdCggdXNlckFnZW50ICksXHJcblx0b3BlcmE6IC9vcGVyYS8udGVzdCggdXNlckFnZW50ICksXHJcblx0bXNpZTogL21zaWUvLnRlc3QoIHVzZXJBZ2VudCApICYmICEvb3BlcmEvLnRlc3QoIHVzZXJBZ2VudCApLFxyXG5cdG1vemlsbGE6IC9tb3ppbGxhLy50ZXN0KCB1c2VyQWdlbnQgKSAmJiAhLyhjb21wYXRpYmxlfHdlYmtpdCkvLnRlc3QoIHVzZXJBZ2VudCApXHJcbn07XHJcblxyXG52YXIgc3R5bGVGbG9hdCA9IGpRdWVyeS5icm93c2VyLm1zaWUgP1xyXG5cdFwic3R5bGVGbG9hdFwiIDpcclxuXHRcImNzc0Zsb2F0XCI7XHJcblx0XHJcbmpRdWVyeS5leHRlbmQoe1xyXG5cdC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgVzNDIGJveCBtb2RlbCBpcyBiZWluZyB1c2VkXHJcblx0Ym94TW9kZWw6ICFqUXVlcnkuYnJvd3Nlci5tc2llIHx8IGRvY3VtZW50LmNvbXBhdE1vZGUgPT0gXCJDU1MxQ29tcGF0XCIsXHJcblx0XHJcblx0cHJvcHM6IHtcclxuXHRcdFwiZm9yXCI6IFwiaHRtbEZvclwiLFxyXG5cdFx0XCJjbGFzc1wiOiBcImNsYXNzTmFtZVwiLFxyXG5cdFx0XCJmbG9hdFwiOiBzdHlsZUZsb2F0LFxyXG5cdFx0Y3NzRmxvYXQ6IHN0eWxlRmxvYXQsXHJcblx0XHRzdHlsZUZsb2F0OiBzdHlsZUZsb2F0LFxyXG5cdFx0aW5uZXJIVE1MOiBcImlubmVySFRNTFwiLFxyXG5cdFx0Y2xhc3NOYW1lOiBcImNsYXNzTmFtZVwiLFxyXG5cdFx0dmFsdWU6IFwidmFsdWVcIixcclxuXHRcdGRpc2FibGVkOiBcImRpc2FibGVkXCIsXHJcblx0XHRjaGVja2VkOiBcImNoZWNrZWRcIixcclxuXHRcdHJlYWRvbmx5OiBcInJlYWRPbmx5XCIsXHJcblx0XHRzZWxlY3RlZDogXCJzZWxlY3RlZFwiLFxyXG5cdFx0bWF4bGVuZ3RoOiBcIm1heExlbmd0aFwiLFxyXG5cdFx0c2VsZWN0ZWRJbmRleDogXCJzZWxlY3RlZEluZGV4XCJcclxuXHR9XHJcbn0pO1xyXG5cclxualF1ZXJ5LmVhY2goe1xyXG5cdHBhcmVudDogXCJlbGVtLnBhcmVudE5vZGVcIixcclxuXHRwYXJlbnRzOiBcImpRdWVyeS5kaXIoZWxlbSwncGFyZW50Tm9kZScpXCIsXHJcblx0bmV4dDogXCJqUXVlcnkubnRoKGVsZW0sMiwnbmV4dFNpYmxpbmcnKVwiLFxyXG5cdHByZXY6IFwialF1ZXJ5Lm50aChlbGVtLDIsJ3ByZXZpb3VzU2libGluZycpXCIsXHJcblx0bmV4dEFsbDogXCJqUXVlcnkuZGlyKGVsZW0sJ25leHRTaWJsaW5nJylcIixcclxuXHRwcmV2QWxsOiBcImpRdWVyeS5kaXIoZWxlbSwncHJldmlvdXNTaWJsaW5nJylcIixcclxuXHRzaWJsaW5nczogXCJqUXVlcnkuc2libGluZyhlbGVtLnBhcmVudE5vZGUuZmlyc3RDaGlsZCxlbGVtKVwiLFxyXG5cdGNoaWxkcmVuOiBcImpRdWVyeS5zaWJsaW5nKGVsZW0uZmlyc3RDaGlsZClcIixcclxuXHRjb250ZW50czogXCJqUXVlcnkubm9kZU5hbWUoZWxlbSwnaWZyYW1lJyk/ZWxlbS5jb250ZW50RG9jdW1lbnR8fGVsZW0uY29udGVudFdpbmRvdy5kb2N1bWVudDpqUXVlcnkubWFrZUFycmF5KGVsZW0uY2hpbGROb2RlcylcIlxyXG59LCBmdW5jdGlvbihuYW1lLCBmbil7XHJcblx0Zm4gPSBldmFsKFwiZmFsc2V8fGZ1bmN0aW9uKGVsZW0pe3JldHVybiBcIiArIGZuICsgXCJ9XCIpO1xyXG5cclxuXHRqUXVlcnkuZm5bIG5hbWUgXSA9IGZ1bmN0aW9uKCBzZWxlY3RvciApIHtcclxuXHRcdHZhciByZXQgPSBqUXVlcnkubWFwKCB0aGlzLCBmbiApO1xyXG5cclxuXHRcdGlmICggc2VsZWN0b3IgJiYgdHlwZW9mIHNlbGVjdG9yID09IFwic3RyaW5nXCIgKVxyXG5cdFx0XHRyZXQgPSBqUXVlcnkubXVsdGlGaWx0ZXIoIHNlbGVjdG9yLCByZXQgKTtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5wdXNoU3RhY2soIGpRdWVyeS51bmlxdWUoIHJldCApICk7XHJcblx0fTtcclxufSk7XHJcblxyXG5qUXVlcnkuZWFjaCh7XHJcblx0YXBwZW5kVG86IFwiYXBwZW5kXCIsXHJcblx0cHJlcGVuZFRvOiBcInByZXBlbmRcIixcclxuXHRpbnNlcnRCZWZvcmU6IFwiYmVmb3JlXCIsXHJcblx0aW5zZXJ0QWZ0ZXI6IFwiYWZ0ZXJcIixcclxuXHRyZXBsYWNlQWxsOiBcInJlcGxhY2VXaXRoXCJcclxufSwgZnVuY3Rpb24obmFtZSwgb3JpZ2luYWwpe1xyXG5cdGpRdWVyeS5mblsgbmFtZSBdID0gZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgYXJncyA9IGFyZ3VtZW50cztcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7XHJcblx0XHRcdGZvciAoIHZhciBpID0gMCwgbGVuZ3RoID0gYXJncy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKyApXHJcblx0XHRcdFx0alF1ZXJ5KCBhcmdzWyBpIF0gKVsgb3JpZ2luYWwgXSggdGhpcyApO1xyXG5cdFx0fSk7XHJcblx0fTtcclxufSk7XHJcblxyXG5qUXVlcnkuZWFjaCh7XHJcblx0cmVtb3ZlQXR0cjogZnVuY3Rpb24oIG5hbWUgKSB7XHJcblx0XHRqUXVlcnkuYXR0ciggdGhpcywgbmFtZSwgXCJcIiApO1xyXG5cdFx0dGhpcy5yZW1vdmVBdHRyaWJ1dGUoIG5hbWUgKTtcclxuXHR9LFxyXG5cclxuXHRhZGRDbGFzczogZnVuY3Rpb24oIGNsYXNzTmFtZXMgKSB7XHJcblx0XHRqUXVlcnkuY2xhc3NOYW1lLmFkZCggdGhpcywgY2xhc3NOYW1lcyApO1xyXG5cdH0sXHJcblxyXG5cdHJlbW92ZUNsYXNzOiBmdW5jdGlvbiggY2xhc3NOYW1lcyApIHtcclxuXHRcdGpRdWVyeS5jbGFzc05hbWUucmVtb3ZlKCB0aGlzLCBjbGFzc05hbWVzICk7XHJcblx0fSxcclxuXHJcblx0dG9nZ2xlQ2xhc3M6IGZ1bmN0aW9uKCBjbGFzc05hbWVzICkge1xyXG5cdFx0alF1ZXJ5LmNsYXNzTmFtZVsgalF1ZXJ5LmNsYXNzTmFtZS5oYXMoIHRoaXMsIGNsYXNzTmFtZXMgKSA/IFwicmVtb3ZlXCIgOiBcImFkZFwiIF0oIHRoaXMsIGNsYXNzTmFtZXMgKTtcclxuXHR9LFxyXG5cclxuXHRyZW1vdmU6IGZ1bmN0aW9uKCBzZWxlY3RvciApIHtcclxuXHRcdGlmICggIXNlbGVjdG9yIHx8IGpRdWVyeS5maWx0ZXIoIHNlbGVjdG9yLCBbIHRoaXMgXSApLnIubGVuZ3RoICkge1xyXG5cdFx0XHQvLyBQcmV2ZW50IG1lbW9yeSBsZWFrc1xyXG5cdFx0XHRqUXVlcnkoIFwiKlwiLCB0aGlzICkuYWRkKHRoaXMpLmVhY2goZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRqUXVlcnkuZXZlbnQucmVtb3ZlKHRoaXMpO1xyXG5cdFx0XHRcdGpRdWVyeS5yZW1vdmVEYXRhKHRoaXMpO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0dGhpcy5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKCB0aGlzICk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0ZW1wdHk6IGZ1bmN0aW9uKCkge1xyXG5cdFx0Ly8gUmVtb3ZlIGVsZW1lbnQgbm9kZXMgYW5kIHByZXZlbnQgbWVtb3J5IGxlYWtzXHJcblx0XHRqUXVlcnkoIFwiPipcIiwgdGhpcyApLnJlbW92ZSgpO1xyXG5cdFx0XHJcblx0XHQvLyBSZW1vdmUgYW55IHJlbWFpbmluZyBub2Rlc1xyXG5cdFx0d2hpbGUgKCB0aGlzLmZpcnN0Q2hpbGQgKVxyXG5cdFx0XHR0aGlzLnJlbW92ZUNoaWxkKCB0aGlzLmZpcnN0Q2hpbGQgKTtcclxuXHR9XHJcbn0sIGZ1bmN0aW9uKG5hbWUsIGZuKXtcclxuXHRqUXVlcnkuZm5bIG5hbWUgXSA9IGZ1bmN0aW9uKCl7XHJcblx0XHRyZXR1cm4gdGhpcy5lYWNoKCBmbiwgYXJndW1lbnRzICk7XHJcblx0fTtcclxufSk7XHJcblxyXG5qUXVlcnkuZWFjaChbIFwiSGVpZ2h0XCIsIFwiV2lkdGhcIiBdLCBmdW5jdGlvbihpLCBuYW1lKXtcclxuXHR2YXIgdHlwZSA9IG5hbWUudG9Mb3dlckNhc2UoKTtcclxuXHRcclxuXHRqUXVlcnkuZm5bIHR5cGUgXSA9IGZ1bmN0aW9uKCBzaXplICkge1xyXG5cdFx0Ly8gR2V0IHdpbmRvdyB3aWR0aCBvciBoZWlnaHRcclxuXHRcdHJldHVybiB0aGlzWzBdID09IHdpbmRvdyA/XHJcblx0XHRcdC8vIE9wZXJhIHJlcG9ydHMgZG9jdW1lbnQuYm9keS5jbGllbnRbV2lkdGgvSGVpZ2h0XSBwcm9wZXJseSBpbiBib3RoIHF1aXJrcyBhbmQgc3RhbmRhcmRzXHJcblx0XHRcdGpRdWVyeS5icm93c2VyLm9wZXJhICYmIGRvY3VtZW50LmJvZHlbIFwiY2xpZW50XCIgKyBuYW1lIF0gfHwgXHJcblx0XHRcdFxyXG5cdFx0XHQvLyBTYWZhcmkgcmVwb3J0cyBpbm5lcltXaWR0aC9IZWlnaHRdIGp1c3QgZmluZSAoTW96aWxsYSBhbmQgT3BlcmEgaW5jbHVkZSBzY3JvbGwgYmFyIHdpZHRocylcclxuXHRcdFx0alF1ZXJ5LmJyb3dzZXIuc2FmYXJpICYmIHdpbmRvd1sgXCJpbm5lclwiICsgbmFtZSBdIHx8XHJcblx0XHRcdFxyXG5cdFx0XHQvLyBFdmVyeW9uZSBlbHNlIHVzZSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgb3IgZG9jdW1lbnQuYm9keSBkZXBlbmRpbmcgb24gUXVpcmtzIHZzIFN0YW5kYXJkcyBtb2RlXHJcblx0XHRcdGRvY3VtZW50LmNvbXBhdE1vZGUgPT0gXCJDU1MxQ29tcGF0XCIgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50WyBcImNsaWVudFwiICsgbmFtZSBdIHx8IGRvY3VtZW50LmJvZHlbIFwiY2xpZW50XCIgKyBuYW1lIF0gOlxyXG5cdFx0XHJcblx0XHRcdC8vIEdldCBkb2N1bWVudCB3aWR0aCBvciBoZWlnaHRcclxuXHRcdFx0dGhpc1swXSA9PSBkb2N1bWVudCA/XHJcblx0XHRcdFx0Ly8gRWl0aGVyIHNjcm9sbFtXaWR0aC9IZWlnaHRdIG9yIG9mZnNldFtXaWR0aC9IZWlnaHRdLCB3aGljaGV2ZXIgaXMgZ3JlYXRlciAoTW96aWxsYSByZXBvcnRzIHNjcm9sbFdpZHRoIHRoZSBzYW1lIGFzIG9mZnNldFdpZHRoKVxyXG5cdFx0XHRcdE1hdGgubWF4KCBkb2N1bWVudC5ib2R5WyBcInNjcm9sbFwiICsgbmFtZSBdLCBkb2N1bWVudC5ib2R5WyBcIm9mZnNldFwiICsgbmFtZSBdICkgOlxyXG4gICAgICAgIFxyXG5cdFx0XHRcdC8vIEdldCBvciBzZXQgd2lkdGggb3IgaGVpZ2h0IG9uIHRoZSBlbGVtZW50XHJcblx0XHRcdFx0c2l6ZSA9PSB1bmRlZmluZWQgP1xyXG5cdFx0XHRcdFx0Ly8gR2V0IHdpZHRoIG9yIGhlaWdodCBvbiB0aGUgZWxlbWVudFxyXG5cdFx0XHRcdFx0KHRoaXMubGVuZ3RoID8galF1ZXJ5LmNzcyggdGhpc1swXSwgdHlwZSApIDogbnVsbCkgOlxyXG5cclxuXHRcdFx0XHRcdC8vIFNldCB0aGUgd2lkdGggb3IgaGVpZ2h0IG9uIHRoZSBlbGVtZW50IChkZWZhdWx0IHRvIHBpeGVscyBpZiB2YWx1ZSBpcyB1bml0bGVzcylcclxuXHRcdFx0XHRcdHRoaXMuY3NzKCB0eXBlLCBzaXplLmNvbnN0cnVjdG9yID09IFN0cmluZyA/IHNpemUgOiBzaXplICsgXCJweFwiICk7XHJcblx0fTtcclxufSk7XHJcblxyXG52YXIgY2hhcnMgPSBqUXVlcnkuYnJvd3Nlci5zYWZhcmkgJiYgcGFyc2VJbnQoalF1ZXJ5LmJyb3dzZXIudmVyc2lvbikgPCA0MTcgP1xyXG5cdFx0XCIoPzpbXFxcXHcqXy1dfFxcXFxcXFxcLilcIiA6XHJcblx0XHRcIig/OltcXFxcd1xcdTAxMjgtXFx1RkZGRipfLV18XFxcXFxcXFwuKVwiLFxyXG5cdHF1aWNrQ2hpbGQgPSBuZXcgUmVnRXhwKFwiXj5cXFxccyooXCIgKyBjaGFycyArIFwiKylcIiksXHJcblx0cXVpY2tJRCA9IG5ldyBSZWdFeHAoXCJeKFwiICsgY2hhcnMgKyBcIispKCMpKFwiICsgY2hhcnMgKyBcIispXCIpLFxyXG5cdHF1aWNrQ2xhc3MgPSBuZXcgUmVnRXhwKFwiXihbIy5dPykoXCIgKyBjaGFycyArIFwiKilcIik7XHJcblxyXG5qUXVlcnkuZXh0ZW5kKHtcclxuXHRleHByOiB7XHJcblx0XHRcIlwiOiBcIm1bMl09PScqJ3x8alF1ZXJ5Lm5vZGVOYW1lKGEsbVsyXSlcIixcclxuXHRcdFwiI1wiOiBcImEuZ2V0QXR0cmlidXRlKCdpZCcpPT1tWzJdXCIsXHJcblx0XHRcIjpcIjoge1xyXG5cdFx0XHQvLyBQb3NpdGlvbiBDaGVja3NcclxuXHRcdFx0bHQ6IFwiaTxtWzNdLTBcIixcclxuXHRcdFx0Z3Q6IFwiaT5tWzNdLTBcIixcclxuXHRcdFx0bnRoOiBcIm1bM10tMD09aVwiLFxyXG5cdFx0XHRlcTogXCJtWzNdLTA9PWlcIixcclxuXHRcdFx0Zmlyc3Q6IFwiaT09MFwiLFxyXG5cdFx0XHRsYXN0OiBcImk9PXIubGVuZ3RoLTFcIixcclxuXHRcdFx0ZXZlbjogXCJpJTI9PTBcIixcclxuXHRcdFx0b2RkOiBcImklMlwiLFxyXG5cclxuXHRcdFx0Ly8gQ2hpbGQgQ2hlY2tzXHJcblx0XHRcdFwiZmlyc3QtY2hpbGRcIjogXCJhLnBhcmVudE5vZGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJyonKVswXT09YVwiLFxyXG5cdFx0XHRcImxhc3QtY2hpbGRcIjogXCJqUXVlcnkubnRoKGEucGFyZW50Tm9kZS5sYXN0Q2hpbGQsMSwncHJldmlvdXNTaWJsaW5nJyk9PWFcIixcclxuXHRcdFx0XCJvbmx5LWNoaWxkXCI6IFwiIWpRdWVyeS5udGgoYS5wYXJlbnROb2RlLmxhc3RDaGlsZCwyLCdwcmV2aW91c1NpYmxpbmcnKVwiLFxyXG5cclxuXHRcdFx0Ly8gUGFyZW50IENoZWNrc1xyXG5cdFx0XHRwYXJlbnQ6IFwiYS5maXJzdENoaWxkXCIsXHJcblx0XHRcdGVtcHR5OiBcIiFhLmZpcnN0Q2hpbGRcIixcclxuXHJcblx0XHRcdC8vIFRleHQgQ2hlY2tcclxuXHRcdFx0Y29udGFpbnM6IFwiKGEudGV4dENvbnRlbnR8fGEuaW5uZXJUZXh0fHxqUXVlcnkoYSkudGV4dCgpfHwnJykuaW5kZXhPZihtWzNdKT49MFwiLFxyXG5cclxuXHRcdFx0Ly8gVmlzaWJpbGl0eVxyXG5cdFx0XHR2aXNpYmxlOiAnXCJoaWRkZW5cIiE9YS50eXBlJiZqUXVlcnkuY3NzKGEsXCJkaXNwbGF5XCIpIT1cIm5vbmVcIiYmalF1ZXJ5LmNzcyhhLFwidmlzaWJpbGl0eVwiKSE9XCJoaWRkZW5cIicsXHJcblx0XHRcdGhpZGRlbjogJ1wiaGlkZGVuXCI9PWEudHlwZXx8alF1ZXJ5LmNzcyhhLFwiZGlzcGxheVwiKT09XCJub25lXCJ8fGpRdWVyeS5jc3MoYSxcInZpc2liaWxpdHlcIik9PVwiaGlkZGVuXCInLFxyXG5cclxuXHRcdFx0Ly8gRm9ybSBhdHRyaWJ1dGVzXHJcblx0XHRcdGVuYWJsZWQ6IFwiIWEuZGlzYWJsZWRcIixcclxuXHRcdFx0ZGlzYWJsZWQ6IFwiYS5kaXNhYmxlZFwiLFxyXG5cdFx0XHRjaGVja2VkOiBcImEuY2hlY2tlZFwiLFxyXG5cdFx0XHRzZWxlY3RlZDogXCJhLnNlbGVjdGVkfHxqUXVlcnkuYXR0cihhLCdzZWxlY3RlZCcpXCIsXHJcblxyXG5cdFx0XHQvLyBGb3JtIGVsZW1lbnRzXHJcblx0XHRcdHRleHQ6IFwiJ3RleHQnPT1hLnR5cGVcIixcclxuXHRcdFx0cmFkaW86IFwiJ3JhZGlvJz09YS50eXBlXCIsXHJcblx0XHRcdGNoZWNrYm94OiBcIidjaGVja2JveCc9PWEudHlwZVwiLFxyXG5cdFx0XHRmaWxlOiBcIidmaWxlJz09YS50eXBlXCIsXHJcblx0XHRcdHBhc3N3b3JkOiBcIidwYXNzd29yZCc9PWEudHlwZVwiLFxyXG5cdFx0XHRzdWJtaXQ6IFwiJ3N1Ym1pdCc9PWEudHlwZVwiLFxyXG5cdFx0XHRpbWFnZTogXCInaW1hZ2UnPT1hLnR5cGVcIixcclxuXHRcdFx0cmVzZXQ6IFwiJ3Jlc2V0Jz09YS50eXBlXCIsXHJcblx0XHRcdGJ1dHRvbjogJ1wiYnV0dG9uXCI9PWEudHlwZXx8alF1ZXJ5Lm5vZGVOYW1lKGEsXCJidXR0b25cIiknLFxyXG5cdFx0XHRpbnB1dDogXCIvaW5wdXR8c2VsZWN0fHRleHRhcmVhfGJ1dHRvbi9pLnRlc3QoYS5ub2RlTmFtZSlcIixcclxuXHJcblx0XHRcdC8vIDpoYXMoKVxyXG5cdFx0XHRoYXM6IFwialF1ZXJ5LmZpbmQobVszXSxhKS5sZW5ndGhcIixcclxuXHJcblx0XHRcdC8vIDpoZWFkZXJcclxuXHRcdFx0aGVhZGVyOiBcIi9oXFxcXGQvaS50ZXN0KGEubm9kZU5hbWUpXCIsXHJcblxyXG5cdFx0XHQvLyA6YW5pbWF0ZWRcclxuXHRcdFx0YW5pbWF0ZWQ6IFwialF1ZXJ5LmdyZXAoalF1ZXJ5LnRpbWVycyxmdW5jdGlvbihmbil7cmV0dXJuIGE9PWZuLmVsZW07fSkubGVuZ3RoXCJcclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdC8vIFRoZSByZWd1bGFyIGV4cHJlc3Npb25zIHRoYXQgcG93ZXIgdGhlIHBhcnNpbmcgZW5naW5lXHJcblx0cGFyc2U6IFtcclxuXHRcdC8vIE1hdGNoOiBbQHZhbHVlPSd0ZXN0J10sIFtAZm9vXVxyXG5cdFx0L14oXFxbKSAqQD8oW1xcdy1dKykgKihbISokXn49XSopICooJz9cIj8pKC4qPylcXDQgKlxcXS8sXHJcblxyXG5cdFx0Ly8gTWF0Y2g6IDpjb250YWlucygnZm9vJylcclxuXHRcdC9eKDopKFtcXHctXSspXFwoXCI/Jz8oLio/KFxcKC4qP1xcKSk/W14oXSo/KVwiPyc/XFwpLyxcclxuXHJcblx0XHQvLyBNYXRjaDogOmV2ZW4sIDpsYXN0LWNobGlkLCAjaWQsIC5jbGFzc1xyXG5cdFx0bmV3IFJlZ0V4cChcIl4oWzouI10qKShcIiArIGNoYXJzICsgXCIrKVwiKVxyXG5cdF0sXHJcblxyXG5cdG11bHRpRmlsdGVyOiBmdW5jdGlvbiggZXhwciwgZWxlbXMsIG5vdCApIHtcclxuXHRcdHZhciBvbGQsIGN1ciA9IFtdO1xyXG5cclxuXHRcdHdoaWxlICggZXhwciAmJiBleHByICE9IG9sZCApIHtcclxuXHRcdFx0b2xkID0gZXhwcjtcclxuXHRcdFx0dmFyIGYgPSBqUXVlcnkuZmlsdGVyKCBleHByLCBlbGVtcywgbm90ICk7XHJcblx0XHRcdGV4cHIgPSBmLnQucmVwbGFjZSgvXlxccyosXFxzKi8sIFwiXCIgKTtcclxuXHRcdFx0Y3VyID0gbm90ID8gZWxlbXMgPSBmLnIgOiBqUXVlcnkubWVyZ2UoIGN1ciwgZi5yICk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGN1cjtcclxuXHR9LFxyXG5cclxuXHRmaW5kOiBmdW5jdGlvbiggdCwgY29udGV4dCApIHtcclxuXHRcdC8vIFF1aWNrbHkgaGFuZGxlIG5vbi1zdHJpbmcgZXhwcmVzc2lvbnNcclxuXHRcdGlmICggdHlwZW9mIHQgIT0gXCJzdHJpbmdcIiApXHJcblx0XHRcdHJldHVybiBbIHQgXTtcclxuXHJcblx0XHQvLyBNYWtlIHN1cmUgdGhhdCB0aGUgY29udGV4dCBpcyBhIERPTSBFbGVtZW50XHJcblx0XHRpZiAoIGNvbnRleHQgJiYgIWNvbnRleHQubm9kZVR5cGUgKVxyXG5cdFx0XHRjb250ZXh0ID0gbnVsbDtcclxuXHJcblx0XHQvLyBTZXQgdGhlIGNvcnJlY3QgY29udGV4dCAoaWYgbm9uZSBpcyBwcm92aWRlZClcclxuXHRcdGNvbnRleHQgPSBjb250ZXh0IHx8IGRvY3VtZW50O1xyXG5cclxuXHRcdC8vIEluaXRpYWxpemUgdGhlIHNlYXJjaFxyXG5cdFx0dmFyIHJldCA9IFtjb250ZXh0XSwgZG9uZSA9IFtdLCBsYXN0O1xyXG5cclxuXHRcdC8vIENvbnRpbnVlIHdoaWxlIGEgc2VsZWN0b3IgZXhwcmVzc2lvbiBleGlzdHMsIGFuZCB3aGlsZVxyXG5cdFx0Ly8gd2UncmUgbm8gbG9uZ2VyIGxvb3BpbmcgdXBvbiBvdXJzZWx2ZXNcclxuXHRcdHdoaWxlICggdCAmJiBsYXN0ICE9IHQgKSB7XHJcblx0XHRcdHZhciByID0gW107XHJcblx0XHRcdGxhc3QgPSB0O1xyXG5cclxuXHRcdFx0dCA9IGpRdWVyeS50cmltKHQpO1xyXG5cclxuXHRcdFx0dmFyIGZvdW5kVG9rZW4gPSBmYWxzZTtcclxuXHJcblx0XHRcdC8vIEFuIGF0dGVtcHQgYXQgc3BlZWRpbmcgdXAgY2hpbGQgc2VsZWN0b3JzIHRoYXRcclxuXHRcdFx0Ly8gcG9pbnQgdG8gYSBzcGVjaWZpYyBlbGVtZW50IHRhZ1xyXG5cdFx0XHR2YXIgcmUgPSBxdWlja0NoaWxkO1xyXG5cdFx0XHR2YXIgbSA9IHJlLmV4ZWModCk7XHJcblxyXG5cdFx0XHRpZiAoIG0gKSB7XHJcblx0XHRcdFx0dmFyIG5vZGVOYW1lID0gbVsxXS50b1VwcGVyQ2FzZSgpO1xyXG5cclxuXHRcdFx0XHQvLyBQZXJmb3JtIG91ciBvd24gaXRlcmF0aW9uIGFuZCBmaWx0ZXJcclxuXHRcdFx0XHRmb3IgKCB2YXIgaSA9IDA7IHJldFtpXTsgaSsrIClcclxuXHRcdFx0XHRcdGZvciAoIHZhciBjID0gcmV0W2ldLmZpcnN0Q2hpbGQ7IGM7IGMgPSBjLm5leHRTaWJsaW5nIClcclxuXHRcdFx0XHRcdFx0aWYgKCBjLm5vZGVUeXBlID09IDEgJiYgKG5vZGVOYW1lID09IFwiKlwiIHx8IGMubm9kZU5hbWUudG9VcHBlckNhc2UoKSA9PSBub2RlTmFtZS50b1VwcGVyQ2FzZSgpKSApXHJcblx0XHRcdFx0XHRcdFx0ci5wdXNoKCBjICk7XHJcblxyXG5cdFx0XHRcdHJldCA9IHI7XHJcblx0XHRcdFx0dCA9IHQucmVwbGFjZSggcmUsIFwiXCIgKTtcclxuXHRcdFx0XHRpZiAoIHQuaW5kZXhPZihcIiBcIikgPT0gMCApIGNvbnRpbnVlO1xyXG5cdFx0XHRcdGZvdW5kVG9rZW4gPSB0cnVlO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJlID0gL14oWz4rfl0pXFxzKihcXHcqKS9pO1xyXG5cclxuXHRcdFx0XHRpZiAoIChtID0gcmUuZXhlYyh0KSkgIT0gbnVsbCApIHtcclxuXHRcdFx0XHRcdHIgPSBbXTtcclxuXHJcblx0XHRcdFx0XHR2YXIgbm9kZU5hbWUgPSBtWzJdLCBtZXJnZSA9IHt9O1xyXG5cdFx0XHRcdFx0bSA9IG1bMV07XHJcblxyXG5cdFx0XHRcdFx0Zm9yICggdmFyIGogPSAwLCBybCA9IHJldC5sZW5ndGg7IGogPCBybDsgaisrICkge1xyXG5cdFx0XHRcdFx0XHR2YXIgbiA9IG0gPT0gXCJ+XCIgfHwgbSA9PSBcIitcIiA/IHJldFtqXS5uZXh0U2libGluZyA6IHJldFtqXS5maXJzdENoaWxkO1xyXG5cdFx0XHRcdFx0XHRmb3IgKCA7IG47IG4gPSBuLm5leHRTaWJsaW5nIClcclxuXHRcdFx0XHRcdFx0XHRpZiAoIG4ubm9kZVR5cGUgPT0gMSApIHtcclxuXHRcdFx0XHRcdFx0XHRcdHZhciBpZCA9IGpRdWVyeS5kYXRhKG4pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdGlmICggbSA9PSBcIn5cIiAmJiBtZXJnZVtpZF0gKSBicmVhaztcclxuXHRcdFx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCFub2RlTmFtZSB8fCBuLm5vZGVOYW1lLnRvVXBwZXJDYXNlKCkgPT0gbm9kZU5hbWUudG9VcHBlckNhc2UoKSApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKCBtID09IFwiflwiICkgbWVyZ2VbaWRdID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ci5wdXNoKCBuICk7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0XHRcdGlmICggbSA9PSBcIitcIiApIGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRyZXQgPSByO1xyXG5cclxuXHRcdFx0XHRcdC8vIEFuZCByZW1vdmUgdGhlIHRva2VuXHJcblx0XHRcdFx0XHR0ID0galF1ZXJ5LnRyaW0oIHQucmVwbGFjZSggcmUsIFwiXCIgKSApO1xyXG5cdFx0XHRcdFx0Zm91bmRUb2tlbiA9IHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBTZWUgaWYgdGhlcmUncyBzdGlsbCBhbiBleHByZXNzaW9uLCBhbmQgdGhhdCB3ZSBoYXZlbid0IGFscmVhZHlcclxuXHRcdFx0Ly8gbWF0Y2hlZCBhIHRva2VuXHJcblx0XHRcdGlmICggdCAmJiAhZm91bmRUb2tlbiApIHtcclxuXHRcdFx0XHQvLyBIYW5kbGUgbXVsdGlwbGUgZXhwcmVzc2lvbnNcclxuXHRcdFx0XHRpZiAoICF0LmluZGV4T2YoXCIsXCIpICkge1xyXG5cdFx0XHRcdFx0Ly8gQ2xlYW4gdGhlIHJlc3VsdCBzZXRcclxuXHRcdFx0XHRcdGlmICggY29udGV4dCA9PSByZXRbMF0gKSByZXQuc2hpZnQoKTtcclxuXHJcblx0XHRcdFx0XHQvLyBNZXJnZSB0aGUgcmVzdWx0IHNldHNcclxuXHRcdFx0XHRcdGRvbmUgPSBqUXVlcnkubWVyZ2UoIGRvbmUsIHJldCApO1xyXG5cclxuXHRcdFx0XHRcdC8vIFJlc2V0IHRoZSBjb250ZXh0XHJcblx0XHRcdFx0XHRyID0gcmV0ID0gW2NvbnRleHRdO1xyXG5cclxuXHRcdFx0XHRcdC8vIFRvdWNoIHVwIHRoZSBzZWxlY3RvciBzdHJpbmdcclxuXHRcdFx0XHRcdHQgPSBcIiBcIiArIHQuc3Vic3RyKDEsdC5sZW5ndGgpO1xyXG5cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Ly8gT3B0aW1pemUgZm9yIHRoZSBjYXNlIG5vZGVOYW1lI2lkTmFtZVxyXG5cdFx0XHRcdFx0dmFyIHJlMiA9IHF1aWNrSUQ7XHJcblx0XHRcdFx0XHR2YXIgbSA9IHJlMi5leGVjKHQpO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHQvLyBSZS1vcmdhbml6ZSB0aGUgcmVzdWx0cywgc28gdGhhdCB0aGV5J3JlIGNvbnNpc3RlbnRcclxuXHRcdFx0XHRcdGlmICggbSApIHtcclxuXHRcdFx0XHRcdCAgIG0gPSBbIDAsIG1bMl0sIG1bM10sIG1bMV0gXTtcclxuXHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHQvLyBPdGhlcndpc2UsIGRvIGEgdHJhZGl0aW9uYWwgZmlsdGVyIGNoZWNrIGZvclxyXG5cdFx0XHRcdFx0XHQvLyBJRCwgY2xhc3MsIGFuZCBlbGVtZW50IHNlbGVjdG9yc1xyXG5cdFx0XHRcdFx0XHRyZTIgPSBxdWlja0NsYXNzO1xyXG5cdFx0XHRcdFx0XHRtID0gcmUyLmV4ZWModCk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0bVsyXSA9IG1bMl0ucmVwbGFjZSgvXFxcXC9nLCBcIlwiKTtcclxuXHJcblx0XHRcdFx0XHR2YXIgZWxlbSA9IHJldFtyZXQubGVuZ3RoLTFdO1xyXG5cclxuXHRcdFx0XHRcdC8vIFRyeSB0byBkbyBhIGdsb2JhbCBzZWFyY2ggYnkgSUQsIHdoZXJlIHdlIGNhblxyXG5cdFx0XHRcdFx0aWYgKCBtWzFdID09IFwiI1wiICYmIGVsZW0gJiYgZWxlbS5nZXRFbGVtZW50QnlJZCAmJiAhalF1ZXJ5LmlzWE1MRG9jKGVsZW0pICkge1xyXG5cdFx0XHRcdFx0XHQvLyBPcHRpbWl6YXRpb24gZm9yIEhUTUwgZG9jdW1lbnQgY2FzZVxyXG5cdFx0XHRcdFx0XHR2YXIgb2lkID0gZWxlbS5nZXRFbGVtZW50QnlJZChtWzJdKTtcclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdC8vIERvIGEgcXVpY2sgY2hlY2sgZm9yIHRoZSBleGlzdGVuY2Ugb2YgdGhlIGFjdHVhbCBJRCBhdHRyaWJ1dGVcclxuXHRcdFx0XHRcdFx0Ly8gdG8gYXZvaWQgc2VsZWN0aW5nIGJ5IHRoZSBuYW1lIGF0dHJpYnV0ZSBpbiBJRVxyXG5cdFx0XHRcdFx0XHQvLyBhbHNvIGNoZWNrIHRvIGluc3VyZSBpZCBpcyBhIHN0cmluZyB0byBhdm9pZCBzZWxlY3RpbmcgYW4gZWxlbWVudCB3aXRoIHRoZSBuYW1lIG9mICdpZCcgaW5zaWRlIGEgZm9ybVxyXG5cdFx0XHRcdFx0XHRpZiAoIChqUXVlcnkuYnJvd3Nlci5tc2llfHxqUXVlcnkuYnJvd3Nlci5vcGVyYSkgJiYgb2lkICYmIHR5cGVvZiBvaWQuaWQgPT0gXCJzdHJpbmdcIiAmJiBvaWQuaWQgIT0gbVsyXSApXHJcblx0XHRcdFx0XHRcdFx0b2lkID0galF1ZXJ5KCdbQGlkPVwiJyttWzJdKydcIl0nLCBlbGVtKVswXTtcclxuXHJcblx0XHRcdFx0XHRcdC8vIERvIGEgcXVpY2sgY2hlY2sgZm9yIG5vZGUgbmFtZSAod2hlcmUgYXBwbGljYWJsZSkgc29cclxuXHRcdFx0XHRcdFx0Ly8gdGhhdCBkaXYjZm9vIHNlYXJjaGVzIHdpbGwgYmUgcmVhbGx5IGZhc3RcclxuXHRcdFx0XHRcdFx0cmV0ID0gciA9IG9pZCAmJiAoIW1bM10gfHwgalF1ZXJ5Lm5vZGVOYW1lKG9pZCwgbVszXSkpID8gW29pZF0gOiBbXTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdC8vIFdlIG5lZWQgdG8gZmluZCBhbGwgZGVzY2VuZGFudCBlbGVtZW50c1xyXG5cdFx0XHRcdFx0XHRmb3IgKCB2YXIgaSA9IDA7IHJldFtpXTsgaSsrICkge1xyXG5cdFx0XHRcdFx0XHRcdC8vIEdyYWIgdGhlIHRhZyBuYW1lIGJlaW5nIHNlYXJjaGVkIGZvclxyXG5cdFx0XHRcdFx0XHRcdHZhciB0YWcgPSBtWzFdID09IFwiI1wiICYmIG1bM10gPyBtWzNdIDogbVsxXSAhPSBcIlwiIHx8IG1bMF0gPT0gXCJcIiA/IFwiKlwiIDogbVsyXTtcclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8gSGFuZGxlIElFNyBiZWluZyByZWFsbHkgZHVtYiBhYm91dCA8b2JqZWN0PnNcclxuXHRcdFx0XHRcdFx0XHRpZiAoIHRhZyA9PSBcIipcIiAmJiByZXRbaV0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PSBcIm9iamVjdFwiIClcclxuXHRcdFx0XHRcdFx0XHRcdHRhZyA9IFwicGFyYW1cIjtcclxuXHJcblx0XHRcdFx0XHRcdFx0ciA9IGpRdWVyeS5tZXJnZSggciwgcmV0W2ldLmdldEVsZW1lbnRzQnlUYWdOYW1lKCB0YWcgKSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdC8vIEl0J3MgZmFzdGVyIHRvIGZpbHRlciBieSBjbGFzcyBhbmQgYmUgZG9uZSB3aXRoIGl0XHJcblx0XHRcdFx0XHRcdGlmICggbVsxXSA9PSBcIi5cIiApXHJcblx0XHRcdFx0XHRcdFx0ciA9IGpRdWVyeS5jbGFzc0ZpbHRlciggciwgbVsyXSApO1xyXG5cclxuXHRcdFx0XHRcdFx0Ly8gU2FtZSB3aXRoIElEIGZpbHRlcmluZ1xyXG5cdFx0XHRcdFx0XHRpZiAoIG1bMV0gPT0gXCIjXCIgKSB7XHJcblx0XHRcdFx0XHRcdFx0dmFyIHRtcCA9IFtdO1xyXG5cclxuXHRcdFx0XHRcdFx0XHQvLyBUcnkgdG8gZmluZCB0aGUgZWxlbWVudCB3aXRoIHRoZSBJRFxyXG5cdFx0XHRcdFx0XHRcdGZvciAoIHZhciBpID0gMDsgcltpXTsgaSsrIClcclxuXHRcdFx0XHRcdFx0XHRcdGlmICggcltpXS5nZXRBdHRyaWJ1dGUoXCJpZFwiKSA9PSBtWzJdICkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR0bXAgPSBbIHJbaV0gXTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdHIgPSB0bXA7XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdHJldCA9IHI7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0dCA9IHQucmVwbGFjZSggcmUyLCBcIlwiICk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gSWYgYSBzZWxlY3RvciBzdHJpbmcgc3RpbGwgZXhpc3RzXHJcblx0XHRcdGlmICggdCApIHtcclxuXHRcdFx0XHQvLyBBdHRlbXB0IHRvIGZpbHRlciBpdFxyXG5cdFx0XHRcdHZhciB2YWwgPSBqUXVlcnkuZmlsdGVyKHQscik7XHJcblx0XHRcdFx0cmV0ID0gciA9IHZhbC5yO1xyXG5cdFx0XHRcdHQgPSBqUXVlcnkudHJpbSh2YWwudCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvLyBBbiBlcnJvciBvY2N1cnJlZCB3aXRoIHRoZSBzZWxlY3RvcjtcclxuXHRcdC8vIGp1c3QgcmV0dXJuIGFuIGVtcHR5IHNldCBpbnN0ZWFkXHJcblx0XHRpZiAoIHQgKVxyXG5cdFx0XHRyZXQgPSBbXTtcclxuXHJcblx0XHQvLyBSZW1vdmUgdGhlIHJvb3QgY29udGV4dFxyXG5cdFx0aWYgKCByZXQgJiYgY29udGV4dCA9PSByZXRbMF0gKVxyXG5cdFx0XHRyZXQuc2hpZnQoKTtcclxuXHJcblx0XHQvLyBBbmQgY29tYmluZSB0aGUgcmVzdWx0c1xyXG5cdFx0ZG9uZSA9IGpRdWVyeS5tZXJnZSggZG9uZSwgcmV0ICk7XHJcblxyXG5cdFx0cmV0dXJuIGRvbmU7XHJcblx0fSxcclxuXHJcblx0Y2xhc3NGaWx0ZXI6IGZ1bmN0aW9uKHIsbSxub3Qpe1xyXG5cdFx0bSA9IFwiIFwiICsgbSArIFwiIFwiO1xyXG5cdFx0dmFyIHRtcCA9IFtdO1xyXG5cdFx0Zm9yICggdmFyIGkgPSAwOyByW2ldOyBpKysgKSB7XHJcblx0XHRcdHZhciBwYXNzID0gKFwiIFwiICsgcltpXS5jbGFzc05hbWUgKyBcIiBcIikuaW5kZXhPZiggbSApID49IDA7XHJcblx0XHRcdGlmICggIW5vdCAmJiBwYXNzIHx8IG5vdCAmJiAhcGFzcyApXHJcblx0XHRcdFx0dG1wLnB1c2goIHJbaV0gKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiB0bXA7XHJcblx0fSxcclxuXHJcblx0ZmlsdGVyOiBmdW5jdGlvbih0LHIsbm90KSB7XHJcblx0XHR2YXIgbGFzdDtcclxuXHJcblx0XHQvLyBMb29rIGZvciBjb21tb24gZmlsdGVyIGV4cHJlc3Npb25zXHJcblx0XHR3aGlsZSAoIHQgICYmIHQgIT0gbGFzdCApIHtcclxuXHRcdFx0bGFzdCA9IHQ7XHJcblxyXG5cdFx0XHR2YXIgcCA9IGpRdWVyeS5wYXJzZSwgbTtcclxuXHJcblx0XHRcdGZvciAoIHZhciBpID0gMDsgcFtpXTsgaSsrICkge1xyXG5cdFx0XHRcdG0gPSBwW2ldLmV4ZWMoIHQgKTtcclxuXHJcblx0XHRcdFx0aWYgKCBtICkge1xyXG5cdFx0XHRcdFx0Ly8gUmVtb3ZlIHdoYXQgd2UganVzdCBtYXRjaGVkXHJcblx0XHRcdFx0XHR0ID0gdC5zdWJzdHJpbmcoIG1bMF0ubGVuZ3RoICk7XHJcblxyXG5cdFx0XHRcdFx0bVsyXSA9IG1bMl0ucmVwbGFjZSgvXFxcXC9nLCBcIlwiKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKCAhbSApXHJcblx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHQvLyA6bm90KCkgaXMgYSBzcGVjaWFsIGNhc2UgdGhhdCBjYW4gYmUgb3B0aW1pemVkIGJ5XHJcblx0XHRcdC8vIGtlZXBpbmcgaXQgb3V0IG9mIHRoZSBleHByZXNzaW9uIGxpc3RcclxuXHRcdFx0aWYgKCBtWzFdID09IFwiOlwiICYmIG1bMl0gPT0gXCJub3RcIiApXHJcblx0XHRcdFx0ciA9IGpRdWVyeS5maWx0ZXIobVszXSwgciwgdHJ1ZSkucjtcclxuXHJcblx0XHRcdC8vIFdlIGNhbiBnZXQgYSBiaWcgc3BlZWQgYm9vc3QgYnkgZmlsdGVyaW5nIGJ5IGNsYXNzIGhlcmVcclxuXHRcdFx0ZWxzZSBpZiAoIG1bMV0gPT0gXCIuXCIgKVxyXG5cdFx0XHRcdHIgPSBqUXVlcnkuY2xhc3NGaWx0ZXIociwgbVsyXSwgbm90KTtcclxuXHJcblx0XHRcdGVsc2UgaWYgKCBtWzFdID09IFwiW1wiICkge1xyXG5cdFx0XHRcdHZhciB0bXAgPSBbXSwgdHlwZSA9IG1bM107XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0Zm9yICggdmFyIGkgPSAwLCBybCA9IHIubGVuZ3RoOyBpIDwgcmw7IGkrKyApIHtcclxuXHRcdFx0XHRcdHZhciBhID0gcltpXSwgeiA9IGFbIGpRdWVyeS5wcm9wc1ttWzJdXSB8fCBtWzJdIF07XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdGlmICggeiA9PSBudWxsIHx8IC9ocmVmfHNyY3xzZWxlY3RlZC8udGVzdChtWzJdKSApXHJcblx0XHRcdFx0XHRcdHogPSBqUXVlcnkuYXR0cihhLG1bMl0pIHx8ICcnO1xyXG5cclxuXHRcdFx0XHRcdGlmICggKHR5cGUgPT0gXCJcIiAmJiAhIXogfHxcclxuXHRcdFx0XHRcdFx0IHR5cGUgPT0gXCI9XCIgJiYgeiA9PSBtWzVdIHx8XHJcblx0XHRcdFx0XHRcdCB0eXBlID09IFwiIT1cIiAmJiB6ICE9IG1bNV0gfHxcclxuXHRcdFx0XHRcdFx0IHR5cGUgPT0gXCJePVwiICYmIHogJiYgIXouaW5kZXhPZihtWzVdKSB8fFxyXG5cdFx0XHRcdFx0XHQgdHlwZSA9PSBcIiQ9XCIgJiYgei5zdWJzdHIoei5sZW5ndGggLSBtWzVdLmxlbmd0aCkgPT0gbVs1XSB8fFxyXG5cdFx0XHRcdFx0XHQgKHR5cGUgPT0gXCIqPVwiIHx8IHR5cGUgPT0gXCJ+PVwiKSAmJiB6LmluZGV4T2YobVs1XSkgPj0gMCkgXiBub3QgKVxyXG5cdFx0XHRcdFx0XHRcdHRtcC5wdXNoKCBhICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHIgPSB0bXA7XHJcblxyXG5cdFx0XHQvLyBXZSBjYW4gZ2V0IGEgc3BlZWQgYm9vc3QgYnkgaGFuZGxpbmcgbnRoLWNoaWxkIGhlcmVcclxuXHRcdFx0fSBlbHNlIGlmICggbVsxXSA9PSBcIjpcIiAmJiBtWzJdID09IFwibnRoLWNoaWxkXCIgKSB7XHJcblx0XHRcdFx0dmFyIG1lcmdlID0ge30sIHRtcCA9IFtdLFxyXG5cdFx0XHRcdFx0dGVzdCA9IC8oXFxkKiluXFwrPyhcXGQqKS8uZXhlYyhcclxuXHRcdFx0XHRcdFx0bVszXSA9PSBcImV2ZW5cIiAmJiBcIjJuXCIgfHwgbVszXSA9PSBcIm9kZFwiICYmIFwiMm4rMVwiIHx8XHJcblx0XHRcdFx0XHRcdCEvXFxELy50ZXN0KG1bM10pICYmIFwibitcIiArIG1bM10gfHwgbVszXSksXHJcblx0XHRcdFx0XHRmaXJzdCA9ICh0ZXN0WzFdIHx8IDEpIC0gMCwgbGFzdCA9IHRlc3RbMl0gLSAwO1xyXG5cclxuXHRcdFx0XHRmb3IgKCB2YXIgaSA9IDAsIHJsID0gci5sZW5ndGg7IGkgPCBybDsgaSsrICkge1xyXG5cdFx0XHRcdFx0dmFyIG5vZGUgPSByW2ldLCBwYXJlbnROb2RlID0gbm9kZS5wYXJlbnROb2RlLCBpZCA9IGpRdWVyeS5kYXRhKHBhcmVudE5vZGUpO1xyXG5cclxuXHRcdFx0XHRcdGlmICggIW1lcmdlW2lkXSApIHtcclxuXHRcdFx0XHRcdFx0dmFyIGMgPSAxO1xyXG5cclxuXHRcdFx0XHRcdFx0Zm9yICggdmFyIG4gPSBwYXJlbnROb2RlLmZpcnN0Q2hpbGQ7IG47IG4gPSBuLm5leHRTaWJsaW5nIClcclxuXHRcdFx0XHRcdFx0XHRpZiAoIG4ubm9kZVR5cGUgPT0gMSApXHJcblx0XHRcdFx0XHRcdFx0XHRuLm5vZGVJbmRleCA9IGMrKztcclxuXHJcblx0XHRcdFx0XHRcdG1lcmdlW2lkXSA9IHRydWU7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0dmFyIGFkZCA9IGZhbHNlO1xyXG5cclxuXHRcdFx0XHRcdGlmICggZmlyc3QgPT0gMSApIHtcclxuXHRcdFx0XHRcdFx0aWYgKCBsYXN0ID09IDAgfHwgbm9kZS5ub2RlSW5kZXggPT0gbGFzdCApXHJcblx0XHRcdFx0XHRcdFx0YWRkID0gdHJ1ZTtcclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoIChub2RlLm5vZGVJbmRleCArIGxhc3QpICUgZmlyc3QgPT0gMCApXHJcblx0XHRcdFx0XHRcdGFkZCA9IHRydWU7XHJcblxyXG5cdFx0XHRcdFx0aWYgKCBhZGQgXiBub3QgKVxyXG5cdFx0XHRcdFx0XHR0bXAucHVzaCggbm9kZSApO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0ciA9IHRtcDtcclxuXHJcblx0XHRcdC8vIE90aGVyd2lzZSwgZmluZCB0aGUgZXhwcmVzc2lvbiB0byBleGVjdXRlXHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dmFyIGYgPSBqUXVlcnkuZXhwclttWzFdXTtcclxuXHRcdFx0XHRpZiAoIHR5cGVvZiBmICE9IFwic3RyaW5nXCIgKVxyXG5cdFx0XHRcdFx0ZiA9IGpRdWVyeS5leHByW21bMV1dW21bMl1dO1xyXG5cclxuXHRcdFx0XHQvLyBCdWlsZCBhIGN1c3RvbSBtYWNybyB0byBlbmNsb3NlIGl0XHJcblx0XHRcdFx0ZiA9IGV2YWwoXCJmYWxzZXx8ZnVuY3Rpb24oYSxpKXtyZXR1cm4gXCIgKyBmICsgXCJ9XCIpO1xyXG5cclxuXHRcdFx0XHQvLyBFeGVjdXRlIGl0IGFnYWluc3QgdGhlIGN1cnJlbnQgZmlsdGVyXHJcblx0XHRcdFx0ciA9IGpRdWVyeS5ncmVwKCByLCBmLCBub3QgKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFJldHVybiBhbiBhcnJheSBvZiBmaWx0ZXJlZCBlbGVtZW50cyAocilcclxuXHRcdC8vIGFuZCB0aGUgbW9kaWZpZWQgZXhwcmVzc2lvbiBzdHJpbmcgKHQpXHJcblx0XHRyZXR1cm4geyByOiByLCB0OiB0IH07XHJcblx0fSxcclxuXHJcblx0ZGlyOiBmdW5jdGlvbiggZWxlbSwgZGlyICl7XHJcblx0XHR2YXIgbWF0Y2hlZCA9IFtdO1xyXG5cdFx0dmFyIGN1ciA9IGVsZW1bZGlyXTtcclxuXHRcdHdoaWxlICggY3VyICYmIGN1ciAhPSBkb2N1bWVudCApIHtcclxuXHRcdFx0aWYgKCBjdXIubm9kZVR5cGUgPT0gMSApXHJcblx0XHRcdFx0bWF0Y2hlZC5wdXNoKCBjdXIgKTtcclxuXHRcdFx0Y3VyID0gY3VyW2Rpcl07XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbWF0Y2hlZDtcclxuXHR9LFxyXG5cdFxyXG5cdG50aDogZnVuY3Rpb24oY3VyLHJlc3VsdCxkaXIsZWxlbSl7XHJcblx0XHRyZXN1bHQgPSByZXN1bHQgfHwgMTtcclxuXHRcdHZhciBudW0gPSAwO1xyXG5cclxuXHRcdGZvciAoIDsgY3VyOyBjdXIgPSBjdXJbZGlyXSApXHJcblx0XHRcdGlmICggY3VyLm5vZGVUeXBlID09IDEgJiYgKytudW0gPT0gcmVzdWx0IClcclxuXHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRyZXR1cm4gY3VyO1xyXG5cdH0sXHJcblx0XHJcblx0c2libGluZzogZnVuY3Rpb24oIG4sIGVsZW0gKSB7XHJcblx0XHR2YXIgciA9IFtdO1xyXG5cclxuXHRcdGZvciAoIDsgbjsgbiA9IG4ubmV4dFNpYmxpbmcgKSB7XHJcblx0XHRcdGlmICggbi5ub2RlVHlwZSA9PSAxICYmICghZWxlbSB8fCBuICE9IGVsZW0pIClcclxuXHRcdFx0XHRyLnB1c2goIG4gKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gcjtcclxuXHR9XHJcbn0pO1xyXG4vKlxyXG4gKiBBIG51bWJlciBvZiBoZWxwZXIgZnVuY3Rpb25zIHVzZWQgZm9yIG1hbmFnaW5nIGV2ZW50cy5cclxuICogTWFueSBvZiB0aGUgaWRlYXMgYmVoaW5kIHRoaXMgY29kZSBvcmlnbmF0ZWQgZnJvbSBcclxuICogRGVhbiBFZHdhcmRzJyBhZGRFdmVudCBsaWJyYXJ5LlxyXG4gKi9cclxualF1ZXJ5LmV2ZW50ID0ge1xyXG5cclxuXHQvLyBCaW5kIGFuIGV2ZW50IHRvIGFuIGVsZW1lbnRcclxuXHQvLyBPcmlnaW5hbCBieSBEZWFuIEVkd2FyZHNcclxuXHRhZGQ6IGZ1bmN0aW9uKGVsZW1lbnQsIHR5cGUsIGhhbmRsZXIsIGRhdGEpIHtcclxuXHRcdC8vIEZvciB3aGF0ZXZlciByZWFzb24sIElFIGhhcyB0cm91YmxlIHBhc3NpbmcgdGhlIHdpbmRvdyBvYmplY3RcclxuXHRcdC8vIGFyb3VuZCwgY2F1c2luZyBpdCB0byBiZSBjbG9uZWQgaW4gdGhlIHByb2Nlc3NcclxuXHRcdGlmICggalF1ZXJ5LmJyb3dzZXIubXNpZSAmJiBlbGVtZW50LnNldEludGVydmFsICE9IHVuZGVmaW5lZCApXHJcblx0XHRcdGVsZW1lbnQgPSB3aW5kb3c7XHJcblxyXG5cdFx0Ly8gTWFrZSBzdXJlIHRoYXQgdGhlIGZ1bmN0aW9uIGJlaW5nIGV4ZWN1dGVkIGhhcyBhIHVuaXF1ZSBJRFxyXG5cdFx0aWYgKCAhaGFuZGxlci5ndWlkIClcclxuXHRcdFx0aGFuZGxlci5ndWlkID0gdGhpcy5ndWlkKys7XHJcblx0XHRcdFxyXG5cdFx0Ly8gaWYgZGF0YSBpcyBwYXNzZWQsIGJpbmQgdG8gaGFuZGxlciBcclxuXHRcdGlmKCBkYXRhICE9IHVuZGVmaW5lZCApIHsgXHJcbiAgICAgICAgXHRcdC8vIENyZWF0ZSB0ZW1wb3JhcnkgZnVuY3Rpb24gcG9pbnRlciB0byBvcmlnaW5hbCBoYW5kbGVyIFxyXG5cdFx0XHR2YXIgZm4gPSBoYW5kbGVyOyBcclxuXHJcblx0XHRcdC8vIENyZWF0ZSB1bmlxdWUgaGFuZGxlciBmdW5jdGlvbiwgd3JhcHBlZCBhcm91bmQgb3JpZ2luYWwgaGFuZGxlciBcclxuXHRcdFx0aGFuZGxlciA9IGZ1bmN0aW9uKCkgeyBcclxuXHRcdFx0XHQvLyBQYXNzIGFyZ3VtZW50cyBhbmQgY29udGV4dCB0byBvcmlnaW5hbCBoYW5kbGVyIFxyXG5cdFx0XHRcdHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyBcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdC8vIFN0b3JlIGRhdGEgaW4gdW5pcXVlIGhhbmRsZXIgXHJcblx0XHRcdGhhbmRsZXIuZGF0YSA9IGRhdGE7XHJcblxyXG5cdFx0XHQvLyBTZXQgdGhlIGd1aWQgb2YgdW5pcXVlIGhhbmRsZXIgdG8gdGhlIHNhbWUgb2Ygb3JpZ2luYWwgaGFuZGxlciwgc28gaXQgY2FuIGJlIHJlbW92ZWQgXHJcblx0XHRcdGhhbmRsZXIuZ3VpZCA9IGZuLmd1aWQ7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gTmFtZXNwYWNlZCBldmVudCBoYW5kbGVyc1xyXG5cdFx0dmFyIHBhcnRzID0gdHlwZS5zcGxpdChcIi5cIik7XHJcblx0XHR0eXBlID0gcGFydHNbMF07XHJcblx0XHRoYW5kbGVyLnR5cGUgPSBwYXJ0c1sxXTtcclxuXHJcblx0XHQvLyBJbml0IHRoZSBlbGVtZW50J3MgZXZlbnQgc3RydWN0dXJlXHJcblx0XHR2YXIgZXZlbnRzID0galF1ZXJ5LmRhdGEoZWxlbWVudCwgXCJldmVudHNcIikgfHwgalF1ZXJ5LmRhdGEoZWxlbWVudCwgXCJldmVudHNcIiwge30pO1xyXG5cdFx0XHJcblx0XHR2YXIgaGFuZGxlID0galF1ZXJ5LmRhdGEoZWxlbWVudCwgXCJoYW5kbGVcIikgfHwgalF1ZXJ5LmRhdGEoZWxlbWVudCwgXCJoYW5kbGVcIiwgZnVuY3Rpb24oKXtcclxuXHRcdFx0Ly8gcmV0dXJuZWQgdW5kZWZpbmVkIG9yIGZhbHNlXHJcblx0XHRcdHZhciB2YWw7XHJcblxyXG5cdFx0XHQvLyBIYW5kbGUgdGhlIHNlY29uZCBldmVudCBvZiBhIHRyaWdnZXIgYW5kIHdoZW5cclxuXHRcdFx0Ly8gYW4gZXZlbnQgaXMgY2FsbGVkIGFmdGVyIGEgcGFnZSBoYXMgdW5sb2FkZWRcclxuXHRcdFx0aWYgKCB0eXBlb2YgalF1ZXJ5ID09IFwidW5kZWZpbmVkXCIgfHwgalF1ZXJ5LmV2ZW50LnRyaWdnZXJlZCApXHJcblx0XHRcdFx0cmV0dXJuIHZhbDtcclxuXHRcdFx0XHJcblx0XHRcdHZhbCA9IGpRdWVyeS5ldmVudC5oYW5kbGUuYXBwbHkoZWxlbWVudCwgYXJndW1lbnRzKTtcclxuXHRcdFx0XHJcblx0XHRcdHJldHVybiB2YWw7XHJcblx0XHR9KTtcclxuXHJcblx0XHQvLyBHZXQgdGhlIGN1cnJlbnQgbGlzdCBvZiBmdW5jdGlvbnMgYm91bmQgdG8gdGhpcyBldmVudFxyXG5cdFx0dmFyIGhhbmRsZXJzID0gZXZlbnRzW3R5cGVdO1xyXG5cclxuXHRcdC8vIEluaXQgdGhlIGV2ZW50IGhhbmRsZXIgcXVldWVcclxuXHRcdGlmICghaGFuZGxlcnMpIHtcclxuXHRcdFx0aGFuZGxlcnMgPSBldmVudHNbdHlwZV0gPSB7fTtcdFxyXG5cdFx0XHRcclxuXHRcdFx0Ly8gQW5kIGJpbmQgdGhlIGdsb2JhbCBldmVudCBoYW5kbGVyIHRvIHRoZSBlbGVtZW50XHJcblx0XHRcdGlmIChlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIpXHJcblx0XHRcdFx0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGhhbmRsZSwgZmFsc2UpO1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0ZWxlbWVudC5hdHRhY2hFdmVudChcIm9uXCIgKyB0eXBlLCBoYW5kbGUpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIEFkZCB0aGUgZnVuY3Rpb24gdG8gdGhlIGVsZW1lbnQncyBoYW5kbGVyIGxpc3RcclxuXHRcdGhhbmRsZXJzW2hhbmRsZXIuZ3VpZF0gPSBoYW5kbGVyO1xyXG5cclxuXHRcdC8vIEtlZXAgdHJhY2sgb2Ygd2hpY2ggZXZlbnRzIGhhdmUgYmVlbiB1c2VkLCBmb3IgZ2xvYmFsIHRyaWdnZXJpbmdcclxuXHRcdHRoaXMuZ2xvYmFsW3R5cGVdID0gdHJ1ZTtcclxuXHR9LFxyXG5cclxuXHRndWlkOiAxLFxyXG5cdGdsb2JhbDoge30sXHJcblxyXG5cdC8vIERldGFjaCBhbiBldmVudCBvciBzZXQgb2YgZXZlbnRzIGZyb20gYW4gZWxlbWVudFxyXG5cdHJlbW92ZTogZnVuY3Rpb24oZWxlbWVudCwgdHlwZSwgaGFuZGxlcikge1xyXG5cdFx0dmFyIGV2ZW50cyA9IGpRdWVyeS5kYXRhKGVsZW1lbnQsIFwiZXZlbnRzXCIpLCByZXQsIGluZGV4O1xyXG5cclxuXHRcdC8vIE5hbWVzcGFjZWQgZXZlbnQgaGFuZGxlcnNcclxuXHRcdGlmICggdHlwZW9mIHR5cGUgPT0gXCJzdHJpbmdcIiApIHtcclxuXHRcdFx0dmFyIHBhcnRzID0gdHlwZS5zcGxpdChcIi5cIik7XHJcblx0XHRcdHR5cGUgPSBwYXJ0c1swXTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIGV2ZW50cyApIHtcclxuXHRcdFx0Ly8gdHlwZSBpcyBhY3R1YWxseSBhbiBldmVudCBvYmplY3QgaGVyZVxyXG5cdFx0XHRpZiAoIHR5cGUgJiYgdHlwZS50eXBlICkge1xyXG5cdFx0XHRcdGhhbmRsZXIgPSB0eXBlLmhhbmRsZXI7XHJcblx0XHRcdFx0dHlwZSA9IHR5cGUudHlwZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0aWYgKCAhdHlwZSApIHtcclxuXHRcdFx0XHRmb3IgKCB0eXBlIGluIGV2ZW50cyApXHJcblx0XHRcdFx0XHR0aGlzLnJlbW92ZSggZWxlbWVudCwgdHlwZSApO1xyXG5cclxuXHRcdFx0fSBlbHNlIGlmICggZXZlbnRzW3R5cGVdICkge1xyXG5cdFx0XHRcdC8vIHJlbW92ZSB0aGUgZ2l2ZW4gaGFuZGxlciBmb3IgdGhlIGdpdmVuIHR5cGVcclxuXHRcdFx0XHRpZiAoIGhhbmRsZXIgKVxyXG5cdFx0XHRcdFx0ZGVsZXRlIGV2ZW50c1t0eXBlXVtoYW5kbGVyLmd1aWRdO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdC8vIHJlbW92ZSBhbGwgaGFuZGxlcnMgZm9yIHRoZSBnaXZlbiB0eXBlXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0Zm9yICggaGFuZGxlciBpbiBldmVudHNbdHlwZV0gKVxyXG5cdFx0XHRcdFx0XHQvLyBIYW5kbGUgdGhlIHJlbW92YWwgb2YgbmFtZXNwYWNlZCBldmVudHNcclxuXHRcdFx0XHRcdFx0aWYgKCAhcGFydHNbMV0gfHwgZXZlbnRzW3R5cGVdW2hhbmRsZXJdLnR5cGUgPT0gcGFydHNbMV0gKVxyXG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBldmVudHNbdHlwZV1baGFuZGxlcl07XHJcblxyXG5cdFx0XHRcdC8vIHJlbW92ZSBnZW5lcmljIGV2ZW50IGhhbmRsZXIgaWYgbm8gbW9yZSBoYW5kbGVycyBleGlzdFxyXG5cdFx0XHRcdGZvciAoIHJldCBpbiBldmVudHNbdHlwZV0gKSBicmVhaztcclxuXHRcdFx0XHRpZiAoICFyZXQgKSB7XHJcblx0XHRcdFx0XHRpZiAoZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKVxyXG5cdFx0XHRcdFx0XHRlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgalF1ZXJ5LmRhdGEoZWxlbWVudCwgXCJoYW5kbGVcIiksIGZhbHNlKTtcclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0ZWxlbWVudC5kZXRhY2hFdmVudChcIm9uXCIgKyB0eXBlLCBqUXVlcnkuZGF0YShlbGVtZW50LCBcImhhbmRsZVwiKSk7XHJcblx0XHRcdFx0XHRyZXQgPSBudWxsO1xyXG5cdFx0XHRcdFx0ZGVsZXRlIGV2ZW50c1t0eXBlXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIFJlbW92ZSB0aGUgZXhwYW5kbyBpZiBpdCdzIG5vIGxvbmdlciB1c2VkXHJcblx0XHRcdGZvciAoIHJldCBpbiBldmVudHMgKSBicmVhaztcclxuXHRcdFx0aWYgKCAhcmV0ICkge1xyXG5cdFx0XHRcdGpRdWVyeS5yZW1vdmVEYXRhKCBlbGVtZW50LCBcImV2ZW50c1wiICk7XHJcblx0XHRcdFx0alF1ZXJ5LnJlbW92ZURhdGEoIGVsZW1lbnQsIFwiaGFuZGxlXCIgKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHRyaWdnZXI6IGZ1bmN0aW9uKHR5cGUsIGRhdGEsIGVsZW1lbnQsIGRvbmF0aXZlLCBleHRyYSkge1xyXG5cdFx0Ly8gQ2xvbmUgdGhlIGluY29taW5nIGRhdGEsIGlmIGFueVxyXG5cdFx0ZGF0YSA9IGpRdWVyeS5tYWtlQXJyYXkoZGF0YSB8fCBbXSk7XHJcblxyXG5cdFx0Ly8gSGFuZGxlIGEgZ2xvYmFsIHRyaWdnZXJcclxuXHRcdGlmICggIWVsZW1lbnQgKSB7XHJcblx0XHRcdC8vIE9ubHkgdHJpZ2dlciBpZiB3ZSd2ZSBldmVyIGJvdW5kIGFuIGV2ZW50IGZvciBpdFxyXG5cdFx0XHRpZiAoIHRoaXMuZ2xvYmFsW3R5cGVdIClcclxuXHRcdFx0XHRqUXVlcnkoXCIqXCIpLmFkZChbd2luZG93LCBkb2N1bWVudF0pLnRyaWdnZXIodHlwZSwgZGF0YSk7XHJcblxyXG5cdFx0Ly8gSGFuZGxlIHRyaWdnZXJpbmcgYSBzaW5nbGUgZWxlbWVudFxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dmFyIHZhbCwgcmV0LCBmbiA9IGpRdWVyeS5pc0Z1bmN0aW9uKCBlbGVtZW50WyB0eXBlIF0gfHwgbnVsbCApLFxyXG5cdFx0XHRcdC8vIENoZWNrIHRvIHNlZSBpZiB3ZSBuZWVkIHRvIHByb3ZpZGUgYSBmYWtlIGV2ZW50LCBvciBub3RcclxuXHRcdFx0XHRldmVudCA9ICFkYXRhWzBdIHx8ICFkYXRhWzBdLnByZXZlbnREZWZhdWx0O1xyXG5cdFx0XHRcclxuXHRcdFx0Ly8gUGFzcyBhbG9uZyBhIGZha2UgZXZlbnRcclxuXHRcdFx0aWYgKCBldmVudCApXHJcblx0XHRcdFx0ZGF0YS51bnNoaWZ0KCB0aGlzLmZpeCh7IHR5cGU6IHR5cGUsIHRhcmdldDogZWxlbWVudCB9KSApO1xyXG5cclxuXHRcdFx0Ly8gRW5mb3JjZSB0aGUgcmlnaHQgdHJpZ2dlciB0eXBlXHJcblx0XHRcdGRhdGFbMF0udHlwZSA9IHR5cGU7XHJcblxyXG5cdFx0XHQvLyBUcmlnZ2VyIHRoZSBldmVudFxyXG5cdFx0XHRpZiAoIGpRdWVyeS5pc0Z1bmN0aW9uKCBqUXVlcnkuZGF0YShlbGVtZW50LCBcImhhbmRsZVwiKSApIClcclxuXHRcdFx0XHR2YWwgPSBqUXVlcnkuZGF0YShlbGVtZW50LCBcImhhbmRsZVwiKS5hcHBseSggZWxlbWVudCwgZGF0YSApO1xyXG5cclxuXHRcdFx0Ly8gSGFuZGxlIHRyaWdnZXJpbmcgbmF0aXZlIC5vbmZvbyBoYW5kbGVyc1xyXG5cdFx0XHRpZiAoICFmbiAmJiBlbGVtZW50W1wib25cIit0eXBlXSAmJiBlbGVtZW50W1wib25cIit0eXBlXS5hcHBseSggZWxlbWVudCwgZGF0YSApID09PSBmYWxzZSApXHJcblx0XHRcdFx0dmFsID0gZmFsc2U7XHJcblxyXG5cdFx0XHQvLyBFeHRyYSBmdW5jdGlvbnMgZG9uJ3QgZ2V0IHRoZSBjdXN0b20gZXZlbnQgb2JqZWN0XHJcblx0XHRcdGlmICggZXZlbnQgKVxyXG5cdFx0XHRcdGRhdGEuc2hpZnQoKTtcclxuXHJcblx0XHRcdC8vIEhhbmRsZSB0cmlnZ2VyaW5nIG9mIGV4dHJhIGZ1bmN0aW9uXHJcblx0XHRcdGlmICggZXh0cmEgJiYgZXh0cmEuYXBwbHkoIGVsZW1lbnQsIGRhdGEgKSA9PT0gZmFsc2UgKVxyXG5cdFx0XHRcdHZhbCA9IGZhbHNlO1xyXG5cclxuXHRcdFx0Ly8gVHJpZ2dlciB0aGUgbmF0aXZlIGV2ZW50cyAoZXhjZXB0IGZvciBjbGlja3Mgb24gbGlua3MpXHJcblx0XHRcdGlmICggZm4gJiYgZG9uYXRpdmUgIT09IGZhbHNlICYmIHZhbCAhPT0gZmFsc2UgJiYgIShqUXVlcnkubm9kZU5hbWUoZWxlbWVudCwgJ2EnKSAmJiB0eXBlID09IFwiY2xpY2tcIikgKSB7XHJcblx0XHRcdFx0dGhpcy50cmlnZ2VyZWQgPSB0cnVlO1xyXG5cdFx0XHRcdGVsZW1lbnRbIHR5cGUgXSgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLnRyaWdnZXJlZCA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB2YWw7XHJcblx0fSxcclxuXHJcblx0aGFuZGxlOiBmdW5jdGlvbihldmVudCkge1xyXG5cdFx0Ly8gcmV0dXJuZWQgdW5kZWZpbmVkIG9yIGZhbHNlXHJcblx0XHR2YXIgdmFsO1xyXG5cclxuXHRcdC8vIEVtcHR5IG9iamVjdCBpcyBmb3IgdHJpZ2dlcmVkIGV2ZW50cyB3aXRoIG5vIGRhdGFcclxuXHRcdGV2ZW50ID0galF1ZXJ5LmV2ZW50LmZpeCggZXZlbnQgfHwgd2luZG93LmV2ZW50IHx8IHt9ICk7IFxyXG5cclxuXHRcdC8vIE5hbWVzcGFjZWQgZXZlbnQgaGFuZGxlcnNcclxuXHRcdHZhciBwYXJ0cyA9IGV2ZW50LnR5cGUuc3BsaXQoXCIuXCIpO1xyXG5cdFx0ZXZlbnQudHlwZSA9IHBhcnRzWzBdO1xyXG5cclxuXHRcdHZhciBoYW5kbGVycyA9IGpRdWVyeS5kYXRhKHRoaXMsIFwiZXZlbnRzXCIpICYmIGpRdWVyeS5kYXRhKHRoaXMsIFwiZXZlbnRzXCIpW2V2ZW50LnR5cGVdLCBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3VtZW50cywgMSApO1xyXG5cdFx0YXJncy51bnNoaWZ0KCBldmVudCApO1xyXG5cclxuXHRcdGZvciAoIHZhciBqIGluIGhhbmRsZXJzICkge1xyXG5cdFx0XHR2YXIgaGFuZGxlciA9IGhhbmRsZXJzW2pdO1xyXG5cdFx0XHQvLyBQYXNzIGluIGEgcmVmZXJlbmNlIHRvIHRoZSBoYW5kbGVyIGZ1bmN0aW9uIGl0c2VsZlxyXG5cdFx0XHQvLyBTbyB0aGF0IHdlIGNhbiBsYXRlciByZW1vdmUgaXRcclxuXHRcdFx0YXJnc1swXS5oYW5kbGVyID0gaGFuZGxlcjtcclxuXHRcdFx0YXJnc1swXS5kYXRhID0gaGFuZGxlci5kYXRhO1xyXG5cclxuXHRcdFx0Ly8gRmlsdGVyIHRoZSBmdW5jdGlvbnMgYnkgY2xhc3NcclxuXHRcdFx0aWYgKCAhcGFydHNbMV0gfHwgaGFuZGxlci50eXBlID09IHBhcnRzWzFdICkge1xyXG5cdFx0XHRcdHZhciByZXQgPSBoYW5kbGVyLmFwcGx5KCB0aGlzLCBhcmdzICk7XHJcblxyXG5cdFx0XHRcdGlmICggdmFsICE9PSBmYWxzZSApXHJcblx0XHRcdFx0XHR2YWwgPSByZXQ7XHJcblxyXG5cdFx0XHRcdGlmICggcmV0ID09PSBmYWxzZSApIHtcclxuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvLyBDbGVhbiB1cCBhZGRlZCBwcm9wZXJ0aWVzIGluIElFIHRvIHByZXZlbnQgbWVtb3J5IGxlYWtcclxuXHRcdGlmIChqUXVlcnkuYnJvd3Nlci5tc2llKVxyXG5cdFx0XHRldmVudC50YXJnZXQgPSBldmVudC5wcmV2ZW50RGVmYXVsdCA9IGV2ZW50LnN0b3BQcm9wYWdhdGlvbiA9XHJcblx0XHRcdFx0ZXZlbnQuaGFuZGxlciA9IGV2ZW50LmRhdGEgPSBudWxsO1xyXG5cclxuXHRcdHJldHVybiB2YWw7XHJcblx0fSxcclxuXHJcblx0Zml4OiBmdW5jdGlvbihldmVudCkge1xyXG5cdFx0Ly8gc3RvcmUgYSBjb3B5IG9mIHRoZSBvcmlnaW5hbCBldmVudCBvYmplY3QgXHJcblx0XHQvLyBhbmQgY2xvbmUgdG8gc2V0IHJlYWQtb25seSBwcm9wZXJ0aWVzXHJcblx0XHR2YXIgb3JpZ2luYWxFdmVudCA9IGV2ZW50O1xyXG5cdFx0ZXZlbnQgPSBqUXVlcnkuZXh0ZW5kKHt9LCBvcmlnaW5hbEV2ZW50KTtcclxuXHRcdFxyXG5cdFx0Ly8gYWRkIHByZXZlbnREZWZhdWx0IGFuZCBzdG9wUHJvcGFnYXRpb24gc2luY2UgXHJcblx0XHQvLyB0aGV5IHdpbGwgbm90IHdvcmsgb24gdGhlIGNsb25lXHJcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQvLyBpZiBwcmV2ZW50RGVmYXVsdCBleGlzdHMgcnVuIGl0IG9uIHRoZSBvcmlnaW5hbCBldmVudFxyXG5cdFx0XHRpZiAob3JpZ2luYWxFdmVudC5wcmV2ZW50RGVmYXVsdClcclxuXHRcdFx0XHRvcmlnaW5hbEV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdC8vIG90aGVyd2lzZSBzZXQgdGhlIHJldHVyblZhbHVlIHByb3BlcnR5IG9mIHRoZSBvcmlnaW5hbCBldmVudCB0byBmYWxzZSAoSUUpXHJcblx0XHRcdG9yaWdpbmFsRXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZTtcclxuXHRcdH07XHJcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24gPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0Ly8gaWYgc3RvcFByb3BhZ2F0aW9uIGV4aXN0cyBydW4gaXQgb24gdGhlIG9yaWdpbmFsIGV2ZW50XHJcblx0XHRcdGlmIChvcmlnaW5hbEV2ZW50LnN0b3BQcm9wYWdhdGlvbilcclxuXHRcdFx0XHRvcmlnaW5hbEV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cdFx0XHQvLyBvdGhlcndpc2Ugc2V0IHRoZSBjYW5jZWxCdWJibGUgcHJvcGVydHkgb2YgdGhlIG9yaWdpbmFsIGV2ZW50IHRvIHRydWUgKElFKVxyXG5cdFx0XHRvcmlnaW5hbEV2ZW50LmNhbmNlbEJ1YmJsZSA9IHRydWU7XHJcblx0XHR9O1xyXG5cdFx0XHJcblx0XHQvLyBGaXggdGFyZ2V0IHByb3BlcnR5LCBpZiBuZWNlc3NhcnlcclxuXHRcdGlmICggIWV2ZW50LnRhcmdldCAmJiBldmVudC5zcmNFbGVtZW50IClcclxuXHRcdFx0ZXZlbnQudGFyZ2V0ID0gZXZlbnQuc3JjRWxlbWVudDtcclxuXHRcdFx0XHRcclxuXHRcdC8vIGNoZWNrIGlmIHRhcmdldCBpcyBhIHRleHRub2RlIChzYWZhcmkpXHJcblx0XHRpZiAoalF1ZXJ5LmJyb3dzZXIuc2FmYXJpICYmIGV2ZW50LnRhcmdldC5ub2RlVHlwZSA9PSAzKVxyXG5cdFx0XHRldmVudC50YXJnZXQgPSBvcmlnaW5hbEV2ZW50LnRhcmdldC5wYXJlbnROb2RlO1xyXG5cclxuXHRcdC8vIEFkZCByZWxhdGVkVGFyZ2V0LCBpZiBuZWNlc3NhcnlcclxuXHRcdGlmICggIWV2ZW50LnJlbGF0ZWRUYXJnZXQgJiYgZXZlbnQuZnJvbUVsZW1lbnQgKVxyXG5cdFx0XHRldmVudC5yZWxhdGVkVGFyZ2V0ID0gZXZlbnQuZnJvbUVsZW1lbnQgPT0gZXZlbnQudGFyZ2V0ID8gZXZlbnQudG9FbGVtZW50IDogZXZlbnQuZnJvbUVsZW1lbnQ7XHJcblxyXG5cdFx0Ly8gQ2FsY3VsYXRlIHBhZ2VYL1kgaWYgbWlzc2luZyBhbmQgY2xpZW50WC9ZIGF2YWlsYWJsZVxyXG5cdFx0aWYgKCBldmVudC5wYWdlWCA9PSBudWxsICYmIGV2ZW50LmNsaWVudFggIT0gbnVsbCApIHtcclxuXHRcdFx0dmFyIGRvYyA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgYm9keSA9IGRvY3VtZW50LmJvZHk7XHJcblx0XHRcdGV2ZW50LnBhZ2VYID0gZXZlbnQuY2xpZW50WCArIChkb2MgJiYgZG9jLnNjcm9sbExlZnQgfHwgYm9keSAmJiBib2R5LnNjcm9sbExlZnQgfHwgMCkgLSAoZG9jLmNsaWVudExlZnQgfHwgMCk7XHJcblx0XHRcdGV2ZW50LnBhZ2VZID0gZXZlbnQuY2xpZW50WSArIChkb2MgJiYgZG9jLnNjcm9sbFRvcCAgfHwgYm9keSAmJiBib2R5LnNjcm9sbFRvcCAgfHwgMCkgLSAoZG9jLmNsaWVudExlZnQgfHwgMCk7XHJcblx0XHR9XHJcblx0XHRcdFxyXG5cdFx0Ly8gQWRkIHdoaWNoIGZvciBrZXkgZXZlbnRzXHJcblx0XHRpZiAoICFldmVudC53aGljaCAmJiAoZXZlbnQuY2hhckNvZGUgfHwgZXZlbnQua2V5Q29kZSkgKVxyXG5cdFx0XHRldmVudC53aGljaCA9IGV2ZW50LmNoYXJDb2RlIHx8IGV2ZW50LmtleUNvZGU7XHJcblx0XHRcclxuXHRcdC8vIEFkZCBtZXRhS2V5IHRvIG5vbi1NYWMgYnJvd3NlcnMgKHVzZSBjdHJsIGZvciBQQydzIGFuZCBNZXRhIGZvciBNYWNzKVxyXG5cdFx0aWYgKCAhZXZlbnQubWV0YUtleSAmJiBldmVudC5jdHJsS2V5IClcclxuXHRcdFx0ZXZlbnQubWV0YUtleSA9IGV2ZW50LmN0cmxLZXk7XHJcblxyXG5cdFx0Ly8gQWRkIHdoaWNoIGZvciBjbGljazogMSA9PSBsZWZ0OyAyID09IG1pZGRsZTsgMyA9PSByaWdodFxyXG5cdFx0Ly8gTm90ZTogYnV0dG9uIGlzIG5vdCBub3JtYWxpemVkLCBzbyBkb24ndCB1c2UgaXRcclxuXHRcdGlmICggIWV2ZW50LndoaWNoICYmIGV2ZW50LmJ1dHRvbiApXHJcblx0XHRcdGV2ZW50LndoaWNoID0gKGV2ZW50LmJ1dHRvbiAmIDEgPyAxIDogKCBldmVudC5idXR0b24gJiAyID8gMyA6ICggZXZlbnQuYnV0dG9uICYgNCA/IDIgOiAwICkgKSk7XHJcblx0XHRcdFxyXG5cdFx0cmV0dXJuIGV2ZW50O1xyXG5cdH1cclxufTtcclxuXHJcbmpRdWVyeS5mbi5leHRlbmQoe1xyXG5cdGJpbmQ6IGZ1bmN0aW9uKCB0eXBlLCBkYXRhLCBmbiApIHtcclxuXHRcdHJldHVybiB0eXBlID09IFwidW5sb2FkXCIgPyB0aGlzLm9uZSh0eXBlLCBkYXRhLCBmbikgOiB0aGlzLmVhY2goZnVuY3Rpb24oKXtcclxuXHRcdFx0alF1ZXJ5LmV2ZW50LmFkZCggdGhpcywgdHlwZSwgZm4gfHwgZGF0YSwgZm4gJiYgZGF0YSApO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRcclxuXHRvbmU6IGZ1bmN0aW9uKCB0eXBlLCBkYXRhLCBmbiApIHtcclxuXHRcdHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXtcclxuXHRcdFx0alF1ZXJ5LmV2ZW50LmFkZCggdGhpcywgdHlwZSwgZnVuY3Rpb24oZXZlbnQpIHtcclxuXHRcdFx0XHRqUXVlcnkodGhpcykudW5iaW5kKGV2ZW50KTtcclxuXHRcdFx0XHRyZXR1cm4gKGZuIHx8IGRhdGEpLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMpO1xyXG5cdFx0XHR9LCBmbiAmJiBkYXRhKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdHVuYmluZDogZnVuY3Rpb24oIHR5cGUsIGZuICkge1xyXG5cdFx0cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe1xyXG5cdFx0XHRqUXVlcnkuZXZlbnQucmVtb3ZlKCB0aGlzLCB0eXBlLCBmbiApO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHJcblx0dHJpZ2dlcjogZnVuY3Rpb24oIHR5cGUsIGRhdGEsIGZuICkge1xyXG5cdFx0cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe1xyXG5cdFx0XHRqUXVlcnkuZXZlbnQudHJpZ2dlciggdHlwZSwgZGF0YSwgdGhpcywgdHJ1ZSwgZm4gKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdHRyaWdnZXJIYW5kbGVyOiBmdW5jdGlvbiggdHlwZSwgZGF0YSwgZm4gKSB7XHJcblx0XHRpZiAoIHRoaXNbMF0gKVxyXG5cdFx0XHRyZXR1cm4galF1ZXJ5LmV2ZW50LnRyaWdnZXIoIHR5cGUsIGRhdGEsIHRoaXNbMF0sIGZhbHNlLCBmbiApO1xyXG5cdH0sXHJcblxyXG5cdHRvZ2dsZTogZnVuY3Rpb24oKSB7XHJcblx0XHQvLyBTYXZlIHJlZmVyZW5jZSB0byBhcmd1bWVudHMgZm9yIGFjY2VzcyBpbiBjbG9zdXJlXHJcblx0XHR2YXIgYXJncyA9IGFyZ3VtZW50cztcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5jbGljayhmdW5jdGlvbihldmVudCkge1xyXG5cdFx0XHQvLyBGaWd1cmUgb3V0IHdoaWNoIGZ1bmN0aW9uIHRvIGV4ZWN1dGVcclxuXHRcdFx0dGhpcy5sYXN0VG9nZ2xlID0gMCA9PSB0aGlzLmxhc3RUb2dnbGUgPyAxIDogMDtcclxuXHRcdFx0XHJcblx0XHRcdC8vIE1ha2Ugc3VyZSB0aGF0IGNsaWNrcyBzdG9wXHJcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFxyXG5cdFx0XHQvLyBhbmQgZXhlY3V0ZSB0aGUgZnVuY3Rpb25cclxuXHRcdFx0cmV0dXJuIGFyZ3NbdGhpcy5sYXN0VG9nZ2xlXS5hcHBseSggdGhpcywgW2V2ZW50XSApIHx8IGZhbHNlO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHJcblx0aG92ZXI6IGZ1bmN0aW9uKGZuT3ZlciwgZm5PdXQpIHtcclxuXHRcdFxyXG5cdFx0Ly8gQSBwcml2YXRlIGZ1bmN0aW9uIGZvciBoYW5kbGluZyBtb3VzZSAnaG92ZXJpbmcnXHJcblx0XHRmdW5jdGlvbiBoYW5kbGVIb3ZlcihldmVudCkge1xyXG5cdFx0XHQvLyBDaGVjayBpZiBtb3VzZShvdmVyfG91dCkgYXJlIHN0aWxsIHdpdGhpbiB0aGUgc2FtZSBwYXJlbnQgZWxlbWVudFxyXG5cdFx0XHR2YXIgcGFyZW50ID0gZXZlbnQucmVsYXRlZFRhcmdldDtcclxuXHRcclxuXHRcdFx0Ly8gVHJhdmVyc2UgdXAgdGhlIHRyZWVcclxuXHRcdFx0d2hpbGUgKCBwYXJlbnQgJiYgcGFyZW50ICE9IHRoaXMgKSB0cnkgeyBwYXJlbnQgPSBwYXJlbnQucGFyZW50Tm9kZTsgfSBjYXRjaChlcnJvcikgeyBwYXJlbnQgPSB0aGlzOyB9O1xyXG5cdFx0XHRcclxuXHRcdFx0Ly8gSWYgd2UgYWN0dWFsbHkganVzdCBtb3VzZWQgb24gdG8gYSBzdWItZWxlbWVudCwgaWdub3JlIGl0XHJcblx0XHRcdGlmICggcGFyZW50ID09IHRoaXMgKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdFxyXG5cdFx0XHQvLyBFeGVjdXRlIHRoZSByaWdodCBmdW5jdGlvblxyXG5cdFx0XHRyZXR1cm4gKGV2ZW50LnR5cGUgPT0gXCJtb3VzZW92ZXJcIiA/IGZuT3ZlciA6IGZuT3V0KS5hcHBseSh0aGlzLCBbZXZlbnRdKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly8gQmluZCB0aGUgZnVuY3Rpb24gdG8gdGhlIHR3byBldmVudCBsaXN0ZW5lcnNcclxuXHRcdHJldHVybiB0aGlzLm1vdXNlb3ZlcihoYW5kbGVIb3ZlcikubW91c2VvdXQoaGFuZGxlSG92ZXIpO1xyXG5cdH0sXHJcblx0XHJcblx0cmVhZHk6IGZ1bmN0aW9uKGZuKSB7XHJcblx0XHQvLyBBdHRhY2ggdGhlIGxpc3RlbmVyc1xyXG5cdFx0YmluZFJlYWR5KCk7XHJcblxyXG5cdFx0Ly8gSWYgdGhlIERPTSBpcyBhbHJlYWR5IHJlYWR5XHJcblx0XHRpZiAoIGpRdWVyeS5pc1JlYWR5IClcclxuXHRcdFx0Ly8gRXhlY3V0ZSB0aGUgZnVuY3Rpb24gaW1tZWRpYXRlbHlcclxuXHRcdFx0Zm4uYXBwbHkoIGRvY3VtZW50LCBbalF1ZXJ5XSApO1xyXG5cdFx0XHRcclxuXHRcdC8vIE90aGVyd2lzZSwgcmVtZW1iZXIgdGhlIGZ1bmN0aW9uIGZvciBsYXRlclxyXG5cdFx0ZWxzZVxyXG5cdFx0XHQvLyBBZGQgdGhlIGZ1bmN0aW9uIHRvIHRoZSB3YWl0IGxpc3RcclxuXHRcdFx0alF1ZXJ5LnJlYWR5TGlzdC5wdXNoKCBmdW5jdGlvbigpIHsgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIFtqUXVlcnldKTsgfSApO1xyXG5cdFxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG59KTtcclxuXHJcbmpRdWVyeS5leHRlbmQoe1xyXG5cdC8qXHJcblx0ICogQWxsIHRoZSBjb2RlIHRoYXQgbWFrZXMgRE9NIFJlYWR5IHdvcmsgbmljZWx5LlxyXG5cdCAqL1xyXG5cdGlzUmVhZHk6IGZhbHNlLFxyXG5cdHJlYWR5TGlzdDogW10sXHJcblx0XHJcblx0Ly8gSGFuZGxlIHdoZW4gdGhlIERPTSBpcyByZWFkeVxyXG5cdHJlYWR5OiBmdW5jdGlvbigpIHtcclxuXHRcdC8vIE1ha2Ugc3VyZSB0aGF0IHRoZSBET00gaXMgbm90IGFscmVhZHkgbG9hZGVkXHJcblx0XHRpZiAoICFqUXVlcnkuaXNSZWFkeSApIHtcclxuXHRcdFx0Ly8gUmVtZW1iZXIgdGhhdCB0aGUgRE9NIGlzIHJlYWR5XHJcblx0XHRcdGpRdWVyeS5pc1JlYWR5ID0gdHJ1ZTtcclxuXHRcdFx0XHJcblx0XHRcdC8vIElmIHRoZXJlIGFyZSBmdW5jdGlvbnMgYm91bmQsIHRvIGV4ZWN1dGVcclxuXHRcdFx0aWYgKCBqUXVlcnkucmVhZHlMaXN0ICkge1xyXG5cdFx0XHRcdC8vIEV4ZWN1dGUgYWxsIG9mIHRoZW1cclxuXHRcdFx0XHRqUXVlcnkuZWFjaCggalF1ZXJ5LnJlYWR5TGlzdCwgZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdHRoaXMuYXBwbHkoIGRvY3VtZW50ICk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0Ly8gUmVzZXQgdGhlIGxpc3Qgb2YgZnVuY3Rpb25zXHJcblx0XHRcdFx0alF1ZXJ5LnJlYWR5TGlzdCA9IG51bGw7XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gUmVtb3ZlIGV2ZW50IGxpc3RlbmVyIHRvIGF2b2lkIG1lbW9yeSBsZWFrXHJcblx0XHRcdGlmICggalF1ZXJ5LmJyb3dzZXIubW96aWxsYSB8fCBqUXVlcnkuYnJvd3Nlci5vcGVyYSApXHJcblx0XHRcdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggXCJET01Db250ZW50TG9hZGVkXCIsIGpRdWVyeS5yZWFkeSwgZmFsc2UgKTtcclxuXHRcdH1cclxuXHR9XHJcbn0pO1xyXG5cclxuXHJcbmpRdWVyeS5lYWNoKCAoXCJibHVyLGZvY3VzLGxvYWQscmVzaXplLHNjcm9sbCx1bmxvYWQsY2xpY2ssZGJsY2xpY2ssXCIgK1xyXG5cdFwibW91c2Vkb3duLG1vdXNldXAsbW91c2Vtb3ZlLG1vdXNlb3Zlcixtb3VzZW91dCxjaGFuZ2Usc2VsZWN0LFwiICsgXHJcblx0XCJzdWJtaXQsa2V5ZG93bixrZXlwcmVzcyxrZXl1cCxlcnJvclwiKS5zcGxpdChcIixcIiksIGZ1bmN0aW9uKGksIG5hbWUpe1xyXG5cdFxyXG5cdC8vIEhhbmRsZSBldmVudCBiaW5kaW5nXHJcblx0alF1ZXJ5LmZuW25hbWVdID0gZnVuY3Rpb24oZm4pe1xyXG5cdFx0cmV0dXJuIGZuID8gdGhpcy5iaW5kKG5hbWUsIGZuKSA6IHRoaXMudHJpZ2dlcihuYW1lKTtcclxuXHR9O1xyXG59KTtcclxuXHJcbnZhciByZWFkeUJvdW5kID0gZmFsc2U7XHJcblxyXG5mdW5jdGlvbiBiaW5kUmVhZHkoKXtcclxuXHRpZiAoIHJlYWR5Qm91bmQgKSByZXR1cm47XHJcblx0cmVhZHlCb3VuZCA9IHRydWU7XHJcblxyXG5cdC8vIElmIE1vemlsbGEgaXMgdXNlZFxyXG5cdGlmICggalF1ZXJ5LmJyb3dzZXIubW96aWxsYSB8fCBqUXVlcnkuYnJvd3Nlci5vcGVyYSApXHJcblx0XHQvLyBVc2UgdGhlIGhhbmR5IGV2ZW50IGNhbGxiYWNrXHJcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCBcIkRPTUNvbnRlbnRMb2FkZWRcIiwgalF1ZXJ5LnJlYWR5LCBmYWxzZSApO1xyXG5cdFxyXG5cdC8vIElmIFNhZmFyaSBvciBJRSBpcyB1c2VkXHJcblx0Ly8gQ29udGludWFsbHkgY2hlY2sgdG8gc2VlIGlmIHRoZSBkb2N1bWVudCBpcyByZWFkeVxyXG5cdGVsc2UgKGZ1bmN0aW9uKCl7XHJcblx0XHR0cnkge1xyXG5cdFx0XHQvLyBJZiBJRSBpcyB1c2VkLCB1c2UgdGhlIHRyaWNrIGJ5IERpZWdvIFBlcmluaVxyXG5cdFx0XHQvLyBodHRwOi8vamF2YXNjcmlwdC5ud2JveC5jb20vSUVDb250ZW50TG9hZGVkL1xyXG5cdFx0XHRpZiAoIGpRdWVyeS5icm93c2VyLm1zaWUgfHwgZG9jdW1lbnQucmVhZHlTdGF0ZSAhPSBcImxvYWRlZFwiICYmIGRvY3VtZW50LnJlYWR5U3RhdGUgIT0gXCJjb21wbGV0ZVwiIClcclxuXHRcdFx0XHRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuZG9TY3JvbGwoXCJsZWZ0XCIpO1xyXG5cdFx0fSBjYXRjaCggZXJyb3IgKSB7XHJcblx0XHRcdHJldHVybiBzZXRUaW1lb3V0KCBhcmd1bWVudHMuY2FsbGVlLCAwICk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gYW5kIGV4ZWN1dGUgYW55IHdhaXRpbmcgZnVuY3Rpb25zXHJcblx0XHRqUXVlcnkucmVhZHkoKTtcclxuXHR9KSgpO1xyXG5cclxuXHQvLyBBIGZhbGxiYWNrIHRvIHdpbmRvdy5vbmxvYWQsIHRoYXQgd2lsbCBhbHdheXMgd29ya1xyXG5cdGpRdWVyeS5ldmVudC5hZGQoIHdpbmRvdywgXCJsb2FkXCIsIGpRdWVyeS5yZWFkeSApO1xyXG59XHJcblxyXG4vLyBQcmV2ZW50IG1lbW9yeSBsZWFrcyBpbiBJRVxyXG5pZiAoIGpRdWVyeS5icm93c2VyLm1zaWUgKVxyXG5cdGpRdWVyeSh3aW5kb3cpLmJpbmQoXCJ1bmxvYWRcIiwgZnVuY3Rpb24oKSB7XHJcblx0XHQkKFwiKlwiKS5hZGQoW2RvY3VtZW50LCB3aW5kb3ddKS51bmJpbmQoKTtcclxuXHR9KTtqUXVlcnkuZm4uZXh0ZW5kKHtcclxuXHRsb2FkOiBmdW5jdGlvbiggdXJsLCBwYXJhbXMsIGNhbGxiYWNrICkge1xyXG5cdFx0aWYgKCBqUXVlcnkuaXNGdW5jdGlvbiggdXJsICkgKVxyXG5cdFx0XHRyZXR1cm4gdGhpcy5iaW5kKFwibG9hZFwiLCB1cmwpO1xyXG5cclxuXHRcdHZhciBvZmYgPSB1cmwuaW5kZXhPZihcIiBcIik7XHJcblx0XHRpZiAoIG9mZiA+PSAwICkge1xyXG5cdFx0XHR2YXIgc2VsZWN0b3IgPSB1cmwuc2xpY2Uob2ZmLCB1cmwubGVuZ3RoKTtcclxuXHRcdFx0dXJsID0gdXJsLnNsaWNlKDAsIG9mZik7XHJcblx0XHR9XHJcblxyXG5cdFx0Y2FsbGJhY2sgPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpe307XHJcblxyXG5cdFx0Ly8gRGVmYXVsdCB0byBhIEdFVCByZXF1ZXN0XHJcblx0XHR2YXIgdHlwZSA9IFwiR0VUXCI7XHJcblxyXG5cdFx0Ly8gSWYgdGhlIHNlY29uZCBwYXJhbWV0ZXIgd2FzIHByb3ZpZGVkXHJcblx0XHRpZiAoIHBhcmFtcyApXHJcblx0XHRcdC8vIElmIGl0J3MgYSBmdW5jdGlvblxyXG5cdFx0XHRpZiAoIGpRdWVyeS5pc0Z1bmN0aW9uKCBwYXJhbXMgKSApIHtcclxuXHRcdFx0XHQvLyBXZSBhc3N1bWUgdGhhdCBpdCdzIHRoZSBjYWxsYmFja1xyXG5cdFx0XHRcdGNhbGxiYWNrID0gcGFyYW1zO1xyXG5cdFx0XHRcdHBhcmFtcyA9IG51bGw7XHJcblxyXG5cdFx0XHQvLyBPdGhlcndpc2UsIGJ1aWxkIGEgcGFyYW0gc3RyaW5nXHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cGFyYW1zID0galF1ZXJ5LnBhcmFtKCBwYXJhbXMgKTtcclxuXHRcdFx0XHR0eXBlID0gXCJQT1NUXCI7XHJcblx0XHRcdH1cclxuXHJcblx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0Ly8gUmVxdWVzdCB0aGUgcmVtb3RlIGRvY3VtZW50XHJcblx0XHRqUXVlcnkuYWpheCh7XHJcblx0XHRcdHVybDogdXJsLFxyXG5cdFx0XHR0eXBlOiB0eXBlLFxyXG5cdFx0XHRkYXRhOiBwYXJhbXMsXHJcblx0XHRcdGNvbXBsZXRlOiBmdW5jdGlvbihyZXMsIHN0YXR1cyl7XHJcblx0XHRcdFx0Ly8gSWYgc3VjY2Vzc2Z1bCwgaW5qZWN0IHRoZSBIVE1MIGludG8gYWxsIHRoZSBtYXRjaGVkIGVsZW1lbnRzXHJcblx0XHRcdFx0aWYgKCBzdGF0dXMgPT0gXCJzdWNjZXNzXCIgfHwgc3RhdHVzID09IFwibm90bW9kaWZpZWRcIiApXHJcblx0XHRcdFx0XHQvLyBTZWUgaWYgYSBzZWxlY3RvciB3YXMgc3BlY2lmaWVkXHJcblx0XHRcdFx0XHRzZWxmLmh0bWwoIHNlbGVjdG9yID9cclxuXHRcdFx0XHRcdFx0Ly8gQ3JlYXRlIGEgZHVtbXkgZGl2IHRvIGhvbGQgdGhlIHJlc3VsdHNcclxuXHRcdFx0XHRcdFx0alF1ZXJ5KFwiPGRpdi8+XCIpXHJcblx0XHRcdFx0XHRcdFx0Ly8gaW5qZWN0IHRoZSBjb250ZW50cyBvZiB0aGUgZG9jdW1lbnQgaW4sIHJlbW92aW5nIHRoZSBzY3JpcHRzXHJcblx0XHRcdFx0XHRcdFx0Ly8gdG8gYXZvaWQgYW55ICdQZXJtaXNzaW9uIERlbmllZCcgZXJyb3JzIGluIElFXHJcblx0XHRcdFx0XHRcdFx0LmFwcGVuZChyZXMucmVzcG9uc2VUZXh0LnJlcGxhY2UoLzxzY3JpcHQoLnxcXHMpKj9cXC9zY3JpcHQ+L2csIFwiXCIpKVxyXG5cclxuXHRcdFx0XHRcdFx0XHQvLyBMb2NhdGUgdGhlIHNwZWNpZmllZCBlbGVtZW50c1xyXG5cdFx0XHRcdFx0XHRcdC5maW5kKHNlbGVjdG9yKSA6XHJcblxyXG5cdFx0XHRcdFx0XHQvLyBJZiBub3QsIGp1c3QgaW5qZWN0IHRoZSBmdWxsIHJlc3VsdFxyXG5cdFx0XHRcdFx0XHRyZXMucmVzcG9uc2VUZXh0ICk7XHJcblxyXG5cdFx0XHRcdC8vIEFkZCBkZWxheSB0byBhY2NvdW50IGZvciBTYWZhcmkncyBkZWxheSBpbiBnbG9iYWxFdmFsXHJcblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0c2VsZi5lYWNoKCBjYWxsYmFjaywgW3Jlcy5yZXNwb25zZVRleHQsIHN0YXR1cywgcmVzXSApO1xyXG5cdFx0XHRcdH0sIDEzKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHRzZXJpYWxpemU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIGpRdWVyeS5wYXJhbSh0aGlzLnNlcmlhbGl6ZUFycmF5KCkpO1xyXG5cdH0sXHJcblx0c2VyaWFsaXplQXJyYXk6IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uKCl7XHJcblx0XHRcdHJldHVybiBqUXVlcnkubm9kZU5hbWUodGhpcywgXCJmb3JtXCIpID9cclxuXHRcdFx0XHRqUXVlcnkubWFrZUFycmF5KHRoaXMuZWxlbWVudHMpIDogdGhpcztcclxuXHRcdH0pXHJcblx0XHQuZmlsdGVyKGZ1bmN0aW9uKCl7XHJcblx0XHRcdHJldHVybiB0aGlzLm5hbWUgJiYgIXRoaXMuZGlzYWJsZWQgJiYgXHJcblx0XHRcdFx0KHRoaXMuY2hlY2tlZCB8fCAvc2VsZWN0fHRleHRhcmVhL2kudGVzdCh0aGlzLm5vZGVOYW1lKSB8fCBcclxuXHRcdFx0XHRcdC90ZXh0fGhpZGRlbnxwYXNzd29yZC9pLnRlc3QodGhpcy50eXBlKSk7XHJcblx0XHR9KVxyXG5cdFx0Lm1hcChmdW5jdGlvbihpLCBlbGVtKXtcclxuXHRcdFx0dmFyIHZhbCA9IGpRdWVyeSh0aGlzKS52YWwoKTtcclxuXHRcdFx0cmV0dXJuIHZhbCA9PSBudWxsID8gbnVsbCA6XHJcblx0XHRcdFx0dmFsLmNvbnN0cnVjdG9yID09IEFycmF5ID9cclxuXHRcdFx0XHRcdGpRdWVyeS5tYXAoIHZhbCwgZnVuY3Rpb24odmFsLCBpKXtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHtuYW1lOiBlbGVtLm5hbWUsIHZhbHVlOiB2YWx9O1xyXG5cdFx0XHRcdFx0fSkgOlxyXG5cdFx0XHRcdFx0e25hbWU6IGVsZW0ubmFtZSwgdmFsdWU6IHZhbH07XHJcblx0XHR9KS5nZXQoKTtcclxuXHR9XHJcbn0pO1xyXG5cclxuLy8gQXR0YWNoIGEgYnVuY2ggb2YgZnVuY3Rpb25zIGZvciBoYW5kbGluZyBjb21tb24gQUpBWCBldmVudHNcclxualF1ZXJ5LmVhY2goIFwiYWpheFN0YXJ0LGFqYXhTdG9wLGFqYXhDb21wbGV0ZSxhamF4RXJyb3IsYWpheFN1Y2Nlc3MsYWpheFNlbmRcIi5zcGxpdChcIixcIiksIGZ1bmN0aW9uKGksbyl7XHJcblx0alF1ZXJ5LmZuW29dID0gZnVuY3Rpb24oZil7XHJcblx0XHRyZXR1cm4gdGhpcy5iaW5kKG8sIGYpO1xyXG5cdH07XHJcbn0pO1xyXG5cclxudmFyIGpzYyA9IChuZXcgRGF0ZSkuZ2V0VGltZSgpO1xyXG5cclxualF1ZXJ5LmV4dGVuZCh7XHJcblx0Z2V0OiBmdW5jdGlvbiggdXJsLCBkYXRhLCBjYWxsYmFjaywgdHlwZSApIHtcclxuXHRcdC8vIHNoaWZ0IGFyZ3VtZW50cyBpZiBkYXRhIGFyZ3VtZW50IHdhcyBvbW1pdGVkXHJcblx0XHRpZiAoIGpRdWVyeS5pc0Z1bmN0aW9uKCBkYXRhICkgKSB7XHJcblx0XHRcdGNhbGxiYWNrID0gZGF0YTtcclxuXHRcdFx0ZGF0YSA9IG51bGw7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiBqUXVlcnkuYWpheCh7XHJcblx0XHRcdHR5cGU6IFwiR0VUXCIsXHJcblx0XHRcdHVybDogdXJsLFxyXG5cdFx0XHRkYXRhOiBkYXRhLFxyXG5cdFx0XHRzdWNjZXNzOiBjYWxsYmFjayxcclxuXHRcdFx0ZGF0YVR5cGU6IHR5cGVcclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdGdldFNjcmlwdDogZnVuY3Rpb24oIHVybCwgY2FsbGJhY2sgKSB7XHJcblx0XHRyZXR1cm4galF1ZXJ5LmdldCh1cmwsIG51bGwsIGNhbGxiYWNrLCBcInNjcmlwdFwiKTtcclxuXHR9LFxyXG5cclxuXHRnZXRKU09OOiBmdW5jdGlvbiggdXJsLCBkYXRhLCBjYWxsYmFjayApIHtcclxuXHRcdHJldHVybiBqUXVlcnkuZ2V0KHVybCwgZGF0YSwgY2FsbGJhY2ssIFwianNvblwiKTtcclxuXHR9LFxyXG5cclxuXHRwb3N0OiBmdW5jdGlvbiggdXJsLCBkYXRhLCBjYWxsYmFjaywgdHlwZSApIHtcclxuXHRcdGlmICggalF1ZXJ5LmlzRnVuY3Rpb24oIGRhdGEgKSApIHtcclxuXHRcdFx0Y2FsbGJhY2sgPSBkYXRhO1xyXG5cdFx0XHRkYXRhID0ge307XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGpRdWVyeS5hamF4KHtcclxuXHRcdFx0dHlwZTogXCJQT1NUXCIsXHJcblx0XHRcdHVybDogdXJsLFxyXG5cdFx0XHRkYXRhOiBkYXRhLFxyXG5cdFx0XHRzdWNjZXNzOiBjYWxsYmFjayxcclxuXHRcdFx0ZGF0YVR5cGU6IHR5cGVcclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdGFqYXhTZXR1cDogZnVuY3Rpb24oIHNldHRpbmdzICkge1xyXG5cdFx0alF1ZXJ5LmV4dGVuZCggalF1ZXJ5LmFqYXhTZXR0aW5ncywgc2V0dGluZ3MgKTtcclxuXHR9LFxyXG5cclxuXHRhamF4U2V0dGluZ3M6IHtcclxuXHRcdGdsb2JhbDogdHJ1ZSxcclxuXHRcdHR5cGU6IFwiR0VUXCIsXHJcblx0XHR0aW1lb3V0OiAwLFxyXG5cdFx0Y29udGVudFR5cGU6IFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCIsXHJcblx0XHRwcm9jZXNzRGF0YTogdHJ1ZSxcclxuXHRcdGFzeW5jOiB0cnVlLFxyXG5cdFx0ZGF0YTogbnVsbFxyXG5cdH0sXHJcblx0XHJcblx0Ly8gTGFzdC1Nb2RpZmllZCBoZWFkZXIgY2FjaGUgZm9yIG5leHQgcmVxdWVzdFxyXG5cdGxhc3RNb2RpZmllZDoge30sXHJcblxyXG5cdGFqYXg6IGZ1bmN0aW9uKCBzICkge1xyXG5cdFx0dmFyIGpzb25wLCBqc3JlID0gLz0oXFw/fCUzRikvZywgc3RhdHVzLCBkYXRhO1xyXG5cclxuXHRcdC8vIEV4dGVuZCB0aGUgc2V0dGluZ3MsIGJ1dCByZS1leHRlbmQgJ3MnIHNvIHRoYXQgaXQgY2FuIGJlXHJcblx0XHQvLyBjaGVja2VkIGFnYWluIGxhdGVyIChpbiB0aGUgdGVzdCBzdWl0ZSwgc3BlY2lmaWNhbGx5KVxyXG5cdFx0cyA9IGpRdWVyeS5leHRlbmQodHJ1ZSwgcywgalF1ZXJ5LmV4dGVuZCh0cnVlLCB7fSwgalF1ZXJ5LmFqYXhTZXR0aW5ncywgcykpO1xyXG5cclxuXHRcdC8vIGNvbnZlcnQgZGF0YSBpZiBub3QgYWxyZWFkeSBhIHN0cmluZ1xyXG5cdFx0aWYgKCBzLmRhdGEgJiYgcy5wcm9jZXNzRGF0YSAmJiB0eXBlb2Ygcy5kYXRhICE9IFwic3RyaW5nXCIgKVxyXG5cdFx0XHRzLmRhdGEgPSBqUXVlcnkucGFyYW0ocy5kYXRhKTtcclxuXHJcblx0XHQvLyBIYW5kbGUgSlNPTlAgUGFyYW1ldGVyIENhbGxiYWNrc1xyXG5cdFx0aWYgKCBzLmRhdGFUeXBlID09IFwianNvbnBcIiApIHtcclxuXHRcdFx0aWYgKCBzLnR5cGUudG9Mb3dlckNhc2UoKSA9PSBcImdldFwiICkge1xyXG5cdFx0XHRcdGlmICggIXMudXJsLm1hdGNoKGpzcmUpIClcclxuXHRcdFx0XHRcdHMudXJsICs9IChzLnVybC5tYXRjaCgvXFw/LykgPyBcIiZcIiA6IFwiP1wiKSArIChzLmpzb25wIHx8IFwiY2FsbGJhY2tcIikgKyBcIj0/XCI7XHJcblx0XHRcdH0gZWxzZSBpZiAoICFzLmRhdGEgfHwgIXMuZGF0YS5tYXRjaChqc3JlKSApXHJcblx0XHRcdFx0cy5kYXRhID0gKHMuZGF0YSA/IHMuZGF0YSArIFwiJlwiIDogXCJcIikgKyAocy5qc29ucCB8fCBcImNhbGxiYWNrXCIpICsgXCI9P1wiO1xyXG5cdFx0XHRzLmRhdGFUeXBlID0gXCJqc29uXCI7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gQnVpbGQgdGVtcG9yYXJ5IEpTT05QIGZ1bmN0aW9uXHJcblx0XHRpZiAoIHMuZGF0YVR5cGUgPT0gXCJqc29uXCIgJiYgKHMuZGF0YSAmJiBqc3JlLnRlc3QoIHMuZGF0YSApIHx8IHMudXJsLm1hdGNoKGpzcmUpKSApIHtcclxuXHRcdFx0anNvbnAgPSBcImpzb25wXCIgKyBqc2MrKztcclxuXHJcblx0XHRcdC8vIFJlcGxhY2UgdGhlID0/IHNlcXVlbmNlIGJvdGggaW4gdGhlIHF1ZXJ5IHN0cmluZyBhbmQgdGhlIGRhdGFcclxuXHRcdFx0aWYgKCBzLmRhdGEgKVxyXG5cdFx0XHRcdHMuZGF0YSA9IChzLmRhdGEgKyBcIlwiKS5yZXBsYWNlKGpzcmUsIFwiPVwiICsganNvbnApO1xyXG5cdFx0XHRzLnVybCA9IHMudXJsLnJlcGxhY2UoanNyZSwgXCI9XCIgKyBqc29ucCk7XHJcblxyXG5cdFx0XHQvLyBXZSBuZWVkIHRvIG1ha2Ugc3VyZVxyXG5cdFx0XHQvLyB0aGF0IGEgSlNPTlAgc3R5bGUgcmVzcG9uc2UgaXMgZXhlY3V0ZWQgcHJvcGVybHlcclxuXHRcdFx0cy5kYXRhVHlwZSA9IFwic2NyaXB0XCI7XHJcblxyXG5cdFx0XHQvLyBIYW5kbGUgSlNPTlAtc3R5bGUgbG9hZGluZ1xyXG5cdFx0XHR3aW5kb3dbIGpzb25wIF0gPSBmdW5jdGlvbih0bXApe1xyXG5cdFx0XHRcdGRhdGEgPSB0bXA7XHJcblx0XHRcdFx0c3VjY2VzcygpO1xyXG5cdFx0XHRcdGNvbXBsZXRlKCk7XHJcblx0XHRcdFx0Ly8gR2FyYmFnZSBjb2xsZWN0XHJcblx0XHRcdFx0d2luZG93WyBqc29ucCBdID0gdW5kZWZpbmVkO1xyXG5cdFx0XHRcdHRyeXsgZGVsZXRlIHdpbmRvd1sganNvbnAgXTsgfSBjYXRjaChlKXt9XHJcblx0XHRcdH07XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCBzLmRhdGFUeXBlID09IFwic2NyaXB0XCIgJiYgcy5jYWNoZSA9PSBudWxsIClcclxuXHRcdFx0cy5jYWNoZSA9IGZhbHNlO1xyXG5cclxuXHRcdGlmICggcy5jYWNoZSA9PT0gZmFsc2UgJiYgcy50eXBlLnRvTG93ZXJDYXNlKCkgPT0gXCJnZXRcIiApXHJcblx0XHRcdHMudXJsICs9IChzLnVybC5tYXRjaCgvXFw/LykgPyBcIiZcIiA6IFwiP1wiKSArIFwiXz1cIiArIChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XHJcblxyXG5cdFx0Ly8gSWYgZGF0YSBpcyBhdmFpbGFibGUsIGFwcGVuZCBkYXRhIHRvIHVybCBmb3IgZ2V0IHJlcXVlc3RzXHJcblx0XHRpZiAoIHMuZGF0YSAmJiBzLnR5cGUudG9Mb3dlckNhc2UoKSA9PSBcImdldFwiICkge1xyXG5cdFx0XHRzLnVybCArPSAocy51cmwubWF0Y2goL1xcPy8pID8gXCImXCIgOiBcIj9cIikgKyBzLmRhdGE7XHJcblxyXG5cdFx0XHQvLyBJRSBsaWtlcyB0byBzZW5kIGJvdGggZ2V0IGFuZCBwb3N0IGRhdGEsIHByZXZlbnQgdGhpc1xyXG5cdFx0XHRzLmRhdGEgPSBudWxsO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFdhdGNoIGZvciBhIG5ldyBzZXQgb2YgcmVxdWVzdHNcclxuXHRcdGlmICggcy5nbG9iYWwgJiYgISBqUXVlcnkuYWN0aXZlKysgKVxyXG5cdFx0XHRqUXVlcnkuZXZlbnQudHJpZ2dlciggXCJhamF4U3RhcnRcIiApO1xyXG5cclxuXHRcdC8vIElmIHdlJ3JlIHJlcXVlc3RpbmcgYSByZW1vdGUgZG9jdW1lbnRcclxuXHRcdC8vIGFuZCB0cnlpbmcgdG8gbG9hZCBKU09OIG9yIFNjcmlwdFxyXG5cdFx0aWYgKCAhcy51cmwuaW5kZXhPZihcImh0dHBcIikgJiYgcy5kYXRhVHlwZSA9PSBcInNjcmlwdFwiICkge1xyXG5cdFx0XHR2YXIgaGVhZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXTtcclxuXHRcdFx0dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XHJcblx0XHRcdHNjcmlwdC5zcmMgPSBzLnVybDtcclxuXHJcblx0XHRcdC8vIEhhbmRsZSBTY3JpcHQgbG9hZGluZ1xyXG5cdFx0XHRpZiAoICFqc29ucCApIHtcclxuXHRcdFx0XHR2YXIgZG9uZSA9IGZhbHNlO1xyXG5cclxuXHRcdFx0XHQvLyBBdHRhY2ggaGFuZGxlcnMgZm9yIGFsbCBicm93c2Vyc1xyXG5cdFx0XHRcdHNjcmlwdC5vbmxvYWQgPSBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdGlmICggIWRvbmUgJiYgKCF0aGlzLnJlYWR5U3RhdGUgfHwgXHJcblx0XHRcdFx0XHRcdFx0dGhpcy5yZWFkeVN0YXRlID09IFwibG9hZGVkXCIgfHwgdGhpcy5yZWFkeVN0YXRlID09IFwiY29tcGxldGVcIikgKSB7XHJcblx0XHRcdFx0XHRcdGRvbmUgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRzdWNjZXNzKCk7XHJcblx0XHRcdFx0XHRcdGNvbXBsZXRlKCk7XHJcblx0XHRcdFx0XHRcdGhlYWQucmVtb3ZlQ2hpbGQoIHNjcmlwdCApO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH07XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcclxuXHJcblx0XHRcdC8vIFdlIGhhbmRsZSBldmVyeXRoaW5nIHVzaW5nIHRoZSBzY3JpcHQgZWxlbWVudCBpbmplY3Rpb25cclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciByZXF1ZXN0RG9uZSA9IGZhbHNlO1xyXG5cclxuXHRcdC8vIENyZWF0ZSB0aGUgcmVxdWVzdCBvYmplY3Q7IE1pY3Jvc29mdCBmYWlsZWQgdG8gcHJvcGVybHlcclxuXHRcdC8vIGltcGxlbWVudCB0aGUgWE1MSHR0cFJlcXVlc3QgaW4gSUU3LCBzbyB3ZSB1c2UgdGhlIEFjdGl2ZVhPYmplY3Qgd2hlbiBpdCBpcyBhdmFpbGFibGVcclxuXHRcdHZhciB4bWwgPSB3aW5kb3cuQWN0aXZlWE9iamVjdCA/IG5ldyBBY3RpdmVYT2JqZWN0KFwiTWljcm9zb2Z0LlhNTEhUVFBcIikgOiBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHJcblx0XHQvLyBPcGVuIHRoZSBzb2NrZXRcclxuXHRcdHhtbC5vcGVuKHMudHlwZSwgcy51cmwsIHMuYXN5bmMpO1xyXG5cclxuXHRcdC8vIFNldCB0aGUgY29ycmVjdCBoZWFkZXIsIGlmIGRhdGEgaXMgYmVpbmcgc2VudFxyXG5cdFx0aWYgKCBzLmRhdGEgKVxyXG5cdFx0XHR4bWwuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBzLmNvbnRlbnRUeXBlKTtcclxuXHJcblx0XHQvLyBTZXQgdGhlIElmLU1vZGlmaWVkLVNpbmNlIGhlYWRlciwgaWYgaWZNb2RpZmllZCBtb2RlLlxyXG5cdFx0aWYgKCBzLmlmTW9kaWZpZWQgKVxyXG5cdFx0XHR4bWwuc2V0UmVxdWVzdEhlYWRlcihcIklmLU1vZGlmaWVkLVNpbmNlXCIsXHJcblx0XHRcdFx0alF1ZXJ5Lmxhc3RNb2RpZmllZFtzLnVybF0gfHwgXCJUaHUsIDAxIEphbiAxOTcwIDAwOjAwOjAwIEdNVFwiICk7XHJcblxyXG5cdFx0Ly8gU2V0IGhlYWRlciBzbyB0aGUgY2FsbGVkIHNjcmlwdCBrbm93cyB0aGF0IGl0J3MgYW4gWE1MSHR0cFJlcXVlc3RcclxuXHRcdHhtbC5zZXRSZXF1ZXN0SGVhZGVyKFwiWC1SZXF1ZXN0ZWQtV2l0aFwiLCBcIlhNTEh0dHBSZXF1ZXN0XCIpO1xyXG5cclxuXHRcdC8vIEFsbG93IGN1c3RvbSBoZWFkZXJzL21pbWV0eXBlc1xyXG5cdFx0aWYgKCBzLmJlZm9yZVNlbmQgKVxyXG5cdFx0XHRzLmJlZm9yZVNlbmQoeG1sKTtcclxuXHRcdFx0XHJcblx0XHRpZiAoIHMuZ2xvYmFsIClcclxuXHRcdCAgICBqUXVlcnkuZXZlbnQudHJpZ2dlcihcImFqYXhTZW5kXCIsIFt4bWwsIHNdKTtcclxuXHJcblx0XHQvLyBXYWl0IGZvciBhIHJlc3BvbnNlIHRvIGNvbWUgYmFja1xyXG5cdFx0dmFyIG9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKGlzVGltZW91dCl7XHJcblx0XHRcdC8vIFRoZSB0cmFuc2ZlciBpcyBjb21wbGV0ZSBhbmQgdGhlIGRhdGEgaXMgYXZhaWxhYmxlLCBvciB0aGUgcmVxdWVzdCB0aW1lZCBvdXRcclxuXHRcdFx0aWYgKCAhcmVxdWVzdERvbmUgJiYgeG1sICYmICh4bWwucmVhZHlTdGF0ZSA9PSA0IHx8IGlzVGltZW91dCA9PSBcInRpbWVvdXRcIikgKSB7XHJcblx0XHRcdFx0cmVxdWVzdERvbmUgPSB0cnVlO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdC8vIGNsZWFyIHBvbGwgaW50ZXJ2YWxcclxuXHRcdFx0XHRpZiAoaXZhbCkge1xyXG5cdFx0XHRcdFx0Y2xlYXJJbnRlcnZhbChpdmFsKTtcclxuXHRcdFx0XHRcdGl2YWwgPSBudWxsO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHRcdFx0XHRzdGF0dXMgPSBpc1RpbWVvdXQgPT0gXCJ0aW1lb3V0XCIgJiYgXCJ0aW1lb3V0XCIgfHxcclxuXHRcdFx0XHRcdCFqUXVlcnkuaHR0cFN1Y2Nlc3MoIHhtbCApICYmIFwiZXJyb3JcIiB8fFxyXG5cdFx0XHRcdFx0cy5pZk1vZGlmaWVkICYmIGpRdWVyeS5odHRwTm90TW9kaWZpZWQoIHhtbCwgcy51cmwgKSAmJiBcIm5vdG1vZGlmaWVkXCIgfHxcclxuXHRcdFx0XHRcdFwic3VjY2Vzc1wiO1xyXG5cclxuXHRcdFx0XHRpZiAoIHN0YXR1cyA9PSBcInN1Y2Nlc3NcIiApIHtcclxuXHRcdFx0XHRcdC8vIFdhdGNoIGZvciwgYW5kIGNhdGNoLCBYTUwgZG9jdW1lbnQgcGFyc2UgZXJyb3JzXHJcblx0XHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0XHQvLyBwcm9jZXNzIHRoZSBkYXRhIChydW5zIHRoZSB4bWwgdGhyb3VnaCBodHRwRGF0YSByZWdhcmRsZXNzIG9mIGNhbGxiYWNrKVxyXG5cdFx0XHRcdFx0XHRkYXRhID0galF1ZXJ5Lmh0dHBEYXRhKCB4bWwsIHMuZGF0YVR5cGUgKTtcclxuXHRcdFx0XHRcdH0gY2F0Y2goZSkge1xyXG5cdFx0XHRcdFx0XHRzdGF0dXMgPSBcInBhcnNlcmVycm9yXCI7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQvLyBNYWtlIHN1cmUgdGhhdCB0aGUgcmVxdWVzdCB3YXMgc3VjY2Vzc2Z1bCBvciBub3Rtb2RpZmllZFxyXG5cdFx0XHRcdGlmICggc3RhdHVzID09IFwic3VjY2Vzc1wiICkge1xyXG5cdFx0XHRcdFx0Ly8gQ2FjaGUgTGFzdC1Nb2RpZmllZCBoZWFkZXIsIGlmIGlmTW9kaWZpZWQgbW9kZS5cclxuXHRcdFx0XHRcdHZhciBtb2RSZXM7XHJcblx0XHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0XHRtb2RSZXMgPSB4bWwuZ2V0UmVzcG9uc2VIZWFkZXIoXCJMYXN0LU1vZGlmaWVkXCIpO1xyXG5cdFx0XHRcdFx0fSBjYXRjaChlKSB7fSAvLyBzd2FsbG93IGV4Y2VwdGlvbiB0aHJvd24gYnkgRkYgaWYgaGVhZGVyIGlzIG5vdCBhdmFpbGFibGVcclxuXHRcclxuXHRcdFx0XHRcdGlmICggcy5pZk1vZGlmaWVkICYmIG1vZFJlcyApXHJcblx0XHRcdFx0XHRcdGpRdWVyeS5sYXN0TW9kaWZpZWRbcy51cmxdID0gbW9kUmVzO1xyXG5cclxuXHRcdFx0XHRcdC8vIEpTT05QIGhhbmRsZXMgaXRzIG93biBzdWNjZXNzIGNhbGxiYWNrXHJcblx0XHRcdFx0XHRpZiAoICFqc29ucCApXHJcblx0XHRcdFx0XHRcdHN1Y2Nlc3MoKTtcdFxyXG5cdFx0XHRcdH0gZWxzZVxyXG5cdFx0XHRcdFx0alF1ZXJ5LmhhbmRsZUVycm9yKHMsIHhtbCwgc3RhdHVzKTtcclxuXHJcblx0XHRcdFx0Ly8gRmlyZSB0aGUgY29tcGxldGUgaGFuZGxlcnNcclxuXHRcdFx0XHRjb21wbGV0ZSgpO1xyXG5cclxuXHRcdFx0XHQvLyBTdG9wIG1lbW9yeSBsZWFrc1xyXG5cdFx0XHRcdGlmICggcy5hc3luYyApXHJcblx0XHRcdFx0XHR4bWwgPSBudWxsO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdFx0XHJcblx0XHRpZiAoIHMuYXN5bmMgKSB7XHJcblx0XHRcdC8vIGRvbid0IGF0dGFjaCB0aGUgaGFuZGxlciB0byB0aGUgcmVxdWVzdCwganVzdCBwb2xsIGl0IGluc3RlYWRcclxuXHRcdFx0dmFyIGl2YWwgPSBzZXRJbnRlcnZhbChvbnJlYWR5c3RhdGVjaGFuZ2UsIDEzKTsgXHJcblxyXG5cdFx0XHQvLyBUaW1lb3V0IGNoZWNrZXJcclxuXHRcdFx0aWYgKCBzLnRpbWVvdXQgPiAwIClcclxuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHQvLyBDaGVjayB0byBzZWUgaWYgdGhlIHJlcXVlc3QgaXMgc3RpbGwgaGFwcGVuaW5nXHJcblx0XHRcdFx0XHRpZiAoIHhtbCApIHtcclxuXHRcdFx0XHRcdFx0Ly8gQ2FuY2VsIHRoZSByZXF1ZXN0XHJcblx0XHRcdFx0XHRcdHhtbC5hYm9ydCgpO1xyXG5cdFxyXG5cdFx0XHRcdFx0XHRpZiggIXJlcXVlc3REb25lIClcclxuXHRcdFx0XHRcdFx0XHRvbnJlYWR5c3RhdGVjaGFuZ2UoIFwidGltZW91dFwiICk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSwgcy50aW1lb3V0KTtcclxuXHRcdH1cclxuXHRcdFx0XHJcblx0XHQvLyBTZW5kIHRoZSBkYXRhXHJcblx0XHR0cnkge1xyXG5cdFx0XHR4bWwuc2VuZChzLmRhdGEpO1xyXG5cdFx0fSBjYXRjaChlKSB7XHJcblx0XHRcdGpRdWVyeS5oYW5kbGVFcnJvcihzLCB4bWwsIG51bGwsIGUpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBmaXJlZm94IDEuNSBkb2Vzbid0IGZpcmUgc3RhdGVjaGFuZ2UgZm9yIHN5bmMgcmVxdWVzdHNcclxuXHRcdGlmICggIXMuYXN5bmMgKVxyXG5cdFx0XHRvbnJlYWR5c3RhdGVjaGFuZ2UoKTtcclxuXHRcdFxyXG5cdFx0Ly8gcmV0dXJuIFhNTEh0dHBSZXF1ZXN0IHRvIGFsbG93IGFib3J0aW5nIHRoZSByZXF1ZXN0IGV0Yy5cclxuXHRcdHJldHVybiB4bWw7XHJcblxyXG5cdFx0ZnVuY3Rpb24gc3VjY2Vzcygpe1xyXG5cdFx0XHQvLyBJZiBhIGxvY2FsIGNhbGxiYWNrIHdhcyBzcGVjaWZpZWQsIGZpcmUgaXQgYW5kIHBhc3MgaXQgdGhlIGRhdGFcclxuXHRcdFx0aWYgKCBzLnN1Y2Nlc3MgKVxyXG5cdFx0XHRcdHMuc3VjY2VzcyggZGF0YSwgc3RhdHVzICk7XHJcblxyXG5cdFx0XHQvLyBGaXJlIHRoZSBnbG9iYWwgY2FsbGJhY2tcclxuXHRcdFx0aWYgKCBzLmdsb2JhbCApXHJcblx0XHRcdFx0alF1ZXJ5LmV2ZW50LnRyaWdnZXIoIFwiYWpheFN1Y2Nlc3NcIiwgW3htbCwgc10gKTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBjb21wbGV0ZSgpe1xyXG5cdFx0XHQvLyBQcm9jZXNzIHJlc3VsdFxyXG5cdFx0XHRpZiAoIHMuY29tcGxldGUgKVxyXG5cdFx0XHRcdHMuY29tcGxldGUoeG1sLCBzdGF0dXMpO1xyXG5cclxuXHRcdFx0Ly8gVGhlIHJlcXVlc3Qgd2FzIGNvbXBsZXRlZFxyXG5cdFx0XHRpZiAoIHMuZ2xvYmFsIClcclxuXHRcdFx0XHRqUXVlcnkuZXZlbnQudHJpZ2dlciggXCJhamF4Q29tcGxldGVcIiwgW3htbCwgc10gKTtcclxuXHJcblx0XHRcdC8vIEhhbmRsZSB0aGUgZ2xvYmFsIEFKQVggY291bnRlclxyXG5cdFx0XHRpZiAoIHMuZ2xvYmFsICYmICEgLS1qUXVlcnkuYWN0aXZlIClcclxuXHRcdFx0XHRqUXVlcnkuZXZlbnQudHJpZ2dlciggXCJhamF4U3RvcFwiICk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0aGFuZGxlRXJyb3I6IGZ1bmN0aW9uKCBzLCB4bWwsIHN0YXR1cywgZSApIHtcclxuXHRcdC8vIElmIGEgbG9jYWwgY2FsbGJhY2sgd2FzIHNwZWNpZmllZCwgZmlyZSBpdFxyXG5cdFx0aWYgKCBzLmVycm9yICkgcy5lcnJvciggeG1sLCBzdGF0dXMsIGUgKTtcclxuXHJcblx0XHQvLyBGaXJlIHRoZSBnbG9iYWwgY2FsbGJhY2tcclxuXHRcdGlmICggcy5nbG9iYWwgKVxyXG5cdFx0XHRqUXVlcnkuZXZlbnQudHJpZ2dlciggXCJhamF4RXJyb3JcIiwgW3htbCwgcywgZV0gKTtcclxuXHR9LFxyXG5cclxuXHQvLyBDb3VudGVyIGZvciBob2xkaW5nIHRoZSBudW1iZXIgb2YgYWN0aXZlIHF1ZXJpZXNcclxuXHRhY3RpdmU6IDAsXHJcblxyXG5cdC8vIERldGVybWluZXMgaWYgYW4gWE1MSHR0cFJlcXVlc3Qgd2FzIHN1Y2Nlc3NmdWwgb3Igbm90XHJcblx0aHR0cFN1Y2Nlc3M6IGZ1bmN0aW9uKCByICkge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0cmV0dXJuICFyLnN0YXR1cyAmJiBsb2NhdGlvbi5wcm90b2NvbCA9PSBcImZpbGU6XCIgfHxcclxuXHRcdFx0XHQoIHIuc3RhdHVzID49IDIwMCAmJiByLnN0YXR1cyA8IDMwMCApIHx8IHIuc3RhdHVzID09IDMwNCB8fFxyXG5cdFx0XHRcdGpRdWVyeS5icm93c2VyLnNhZmFyaSAmJiByLnN0YXR1cyA9PSB1bmRlZmluZWQ7XHJcblx0XHR9IGNhdGNoKGUpe31cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9LFxyXG5cclxuXHQvLyBEZXRlcm1pbmVzIGlmIGFuIFhNTEh0dHBSZXF1ZXN0IHJldHVybnMgTm90TW9kaWZpZWRcclxuXHRodHRwTm90TW9kaWZpZWQ6IGZ1bmN0aW9uKCB4bWwsIHVybCApIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdHZhciB4bWxSZXMgPSB4bWwuZ2V0UmVzcG9uc2VIZWFkZXIoXCJMYXN0LU1vZGlmaWVkXCIpO1xyXG5cclxuXHRcdFx0Ly8gRmlyZWZveCBhbHdheXMgcmV0dXJucyAyMDAuIGNoZWNrIExhc3QtTW9kaWZpZWQgZGF0ZVxyXG5cdFx0XHRyZXR1cm4geG1sLnN0YXR1cyA9PSAzMDQgfHwgeG1sUmVzID09IGpRdWVyeS5sYXN0TW9kaWZpZWRbdXJsXSB8fFxyXG5cdFx0XHRcdGpRdWVyeS5icm93c2VyLnNhZmFyaSAmJiB4bWwuc3RhdHVzID09IHVuZGVmaW5lZDtcclxuXHRcdH0gY2F0Y2goZSl7fVxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH0sXHJcblxyXG5cdGh0dHBEYXRhOiBmdW5jdGlvbiggciwgdHlwZSApIHtcclxuXHRcdHZhciBjdCA9IHIuZ2V0UmVzcG9uc2VIZWFkZXIoXCJjb250ZW50LXR5cGVcIik7XHJcblx0XHR2YXIgeG1sID0gdHlwZSA9PSBcInhtbFwiIHx8ICF0eXBlICYmIGN0ICYmIGN0LmluZGV4T2YoXCJ4bWxcIikgPj0gMDtcclxuXHRcdHZhciBkYXRhID0geG1sID8gci5yZXNwb25zZVhNTCA6IHIucmVzcG9uc2VUZXh0O1xyXG5cclxuXHRcdGlmICggeG1sICYmIGRhdGEuZG9jdW1lbnRFbGVtZW50LnRhZ05hbWUgPT0gXCJwYXJzZXJlcnJvclwiIClcclxuXHRcdFx0dGhyb3cgXCJwYXJzZXJlcnJvclwiO1xyXG5cclxuXHRcdC8vIElmIHRoZSB0eXBlIGlzIFwic2NyaXB0XCIsIGV2YWwgaXQgaW4gZ2xvYmFsIGNvbnRleHRcclxuXHRcdGlmICggdHlwZSA9PSBcInNjcmlwdFwiIClcclxuXHRcdFx0alF1ZXJ5Lmdsb2JhbEV2YWwoIGRhdGEgKTtcclxuXHJcblx0XHQvLyBHZXQgdGhlIEphdmFTY3JpcHQgb2JqZWN0LCBpZiBKU09OIGlzIHVzZWQuXHJcblx0XHRpZiAoIHR5cGUgPT0gXCJqc29uXCIgKVxyXG5cdFx0XHRkYXRhID0gZXZhbChcIihcIiArIGRhdGEgKyBcIilcIik7XHJcblxyXG5cdFx0cmV0dXJuIGRhdGE7XHJcblx0fSxcclxuXHJcblx0Ly8gU2VyaWFsaXplIGFuIGFycmF5IG9mIGZvcm0gZWxlbWVudHMgb3IgYSBzZXQgb2ZcclxuXHQvLyBrZXkvdmFsdWVzIGludG8gYSBxdWVyeSBzdHJpbmdcclxuXHRwYXJhbTogZnVuY3Rpb24oIGEgKSB7XHJcblx0XHR2YXIgcyA9IFtdO1xyXG5cclxuXHRcdC8vIElmIGFuIGFycmF5IHdhcyBwYXNzZWQgaW4sIGFzc3VtZSB0aGF0IGl0IGlzIGFuIGFycmF5XHJcblx0XHQvLyBvZiBmb3JtIGVsZW1lbnRzXHJcblx0XHRpZiAoIGEuY29uc3RydWN0b3IgPT0gQXJyYXkgfHwgYS5qcXVlcnkgKVxyXG5cdFx0XHQvLyBTZXJpYWxpemUgdGhlIGZvcm0gZWxlbWVudHNcclxuXHRcdFx0alF1ZXJ5LmVhY2goIGEsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0cy5wdXNoKCBlbmNvZGVVUklDb21wb25lbnQodGhpcy5uYW1lKSArIFwiPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KCB0aGlzLnZhbHVlICkgKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0Ly8gT3RoZXJ3aXNlLCBhc3N1bWUgdGhhdCBpdCdzIGFuIG9iamVjdCBvZiBrZXkvdmFsdWUgcGFpcnNcclxuXHRcdGVsc2VcclxuXHRcdFx0Ly8gU2VyaWFsaXplIHRoZSBrZXkvdmFsdWVzXHJcblx0XHRcdGZvciAoIHZhciBqIGluIGEgKVxyXG5cdFx0XHRcdC8vIElmIHRoZSB2YWx1ZSBpcyBhbiBhcnJheSB0aGVuIHRoZSBrZXkgbmFtZXMgbmVlZCB0byBiZSByZXBlYXRlZFxyXG5cdFx0XHRcdGlmICggYVtqXSAmJiBhW2pdLmNvbnN0cnVjdG9yID09IEFycmF5IClcclxuXHRcdFx0XHRcdGpRdWVyeS5lYWNoKCBhW2pdLCBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0XHRzLnB1c2goIGVuY29kZVVSSUNvbXBvbmVudChqKSArIFwiPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KCB0aGlzICkgKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdHMucHVzaCggZW5jb2RlVVJJQ29tcG9uZW50KGopICsgXCI9XCIgKyBlbmNvZGVVUklDb21wb25lbnQoIGFbal0gKSApO1xyXG5cclxuXHRcdC8vIFJldHVybiB0aGUgcmVzdWx0aW5nIHNlcmlhbGl6YXRpb25cclxuXHRcdHJldHVybiBzLmpvaW4oXCImXCIpLnJlcGxhY2UoLyUyMC9nLCBcIitcIik7XHJcblx0fVxyXG5cclxufSk7XHJcbmpRdWVyeS5mbi5leHRlbmQoe1xyXG5cdHNob3c6IGZ1bmN0aW9uKHNwZWVkLGNhbGxiYWNrKXtcclxuXHRcdHJldHVybiBzcGVlZCA/XHJcblx0XHRcdHRoaXMuYW5pbWF0ZSh7XHJcblx0XHRcdFx0aGVpZ2h0OiBcInNob3dcIiwgd2lkdGg6IFwic2hvd1wiLCBvcGFjaXR5OiBcInNob3dcIlxyXG5cdFx0XHR9LCBzcGVlZCwgY2FsbGJhY2spIDpcclxuXHRcdFx0XHJcblx0XHRcdHRoaXMuZmlsdGVyKFwiOmhpZGRlblwiKS5lYWNoKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dGhpcy5zdHlsZS5kaXNwbGF5ID0gdGhpcy5vbGRibG9jayA/IHRoaXMub2xkYmxvY2sgOiBcIlwiO1xyXG5cdFx0XHRcdGlmICggalF1ZXJ5LmNzcyh0aGlzLFwiZGlzcGxheVwiKSA9PSBcIm5vbmVcIiApXHJcblx0XHRcdFx0XHR0aGlzLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcblx0XHRcdH0pLmVuZCgpO1xyXG5cdH0sXHJcblx0XHJcblx0aGlkZTogZnVuY3Rpb24oc3BlZWQsY2FsbGJhY2spe1xyXG5cdFx0cmV0dXJuIHNwZWVkID9cclxuXHRcdFx0dGhpcy5hbmltYXRlKHtcclxuXHRcdFx0XHRoZWlnaHQ6IFwiaGlkZVwiLCB3aWR0aDogXCJoaWRlXCIsIG9wYWNpdHk6IFwiaGlkZVwiXHJcblx0XHRcdH0sIHNwZWVkLCBjYWxsYmFjaykgOlxyXG5cdFx0XHRcclxuXHRcdFx0dGhpcy5maWx0ZXIoXCI6dmlzaWJsZVwiKS5lYWNoKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dGhpcy5vbGRibG9jayA9IHRoaXMub2xkYmxvY2sgfHwgalF1ZXJ5LmNzcyh0aGlzLFwiZGlzcGxheVwiKTtcclxuXHRcdFx0XHRpZiAoIHRoaXMub2xkYmxvY2sgPT0gXCJub25lXCIgKVxyXG5cdFx0XHRcdFx0dGhpcy5vbGRibG9jayA9IFwiYmxvY2tcIjtcclxuXHRcdFx0XHR0aGlzLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuXHRcdFx0fSkuZW5kKCk7XHJcblx0fSxcclxuXHJcblx0Ly8gU2F2ZSB0aGUgb2xkIHRvZ2dsZSBmdW5jdGlvblxyXG5cdF90b2dnbGU6IGpRdWVyeS5mbi50b2dnbGUsXHJcblx0XHJcblx0dG9nZ2xlOiBmdW5jdGlvbiggZm4sIGZuMiApe1xyXG5cdFx0cmV0dXJuIGpRdWVyeS5pc0Z1bmN0aW9uKGZuKSAmJiBqUXVlcnkuaXNGdW5jdGlvbihmbjIpID9cclxuXHRcdFx0dGhpcy5fdG9nZ2xlKCBmbiwgZm4yICkgOlxyXG5cdFx0XHRmbiA/XHJcblx0XHRcdFx0dGhpcy5hbmltYXRlKHtcclxuXHRcdFx0XHRcdGhlaWdodDogXCJ0b2dnbGVcIiwgd2lkdGg6IFwidG9nZ2xlXCIsIG9wYWNpdHk6IFwidG9nZ2xlXCJcclxuXHRcdFx0XHR9LCBmbiwgZm4yKSA6XHJcblx0XHRcdFx0dGhpcy5lYWNoKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHRqUXVlcnkodGhpcylbIGpRdWVyeSh0aGlzKS5pcyhcIjpoaWRkZW5cIikgPyBcInNob3dcIiA6IFwiaGlkZVwiIF0oKTtcclxuXHRcdFx0XHR9KTtcclxuXHR9LFxyXG5cdFxyXG5cdHNsaWRlRG93bjogZnVuY3Rpb24oc3BlZWQsY2FsbGJhY2spe1xyXG5cdFx0cmV0dXJuIHRoaXMuYW5pbWF0ZSh7aGVpZ2h0OiBcInNob3dcIn0sIHNwZWVkLCBjYWxsYmFjayk7XHJcblx0fSxcclxuXHRcclxuXHRzbGlkZVVwOiBmdW5jdGlvbihzcGVlZCxjYWxsYmFjayl7XHJcblx0XHRyZXR1cm4gdGhpcy5hbmltYXRlKHtoZWlnaHQ6IFwiaGlkZVwifSwgc3BlZWQsIGNhbGxiYWNrKTtcclxuXHR9LFxyXG5cclxuXHRzbGlkZVRvZ2dsZTogZnVuY3Rpb24oc3BlZWQsIGNhbGxiYWNrKXtcclxuXHRcdHJldHVybiB0aGlzLmFuaW1hdGUoe2hlaWdodDogXCJ0b2dnbGVcIn0sIHNwZWVkLCBjYWxsYmFjayk7XHJcblx0fSxcclxuXHRcclxuXHRmYWRlSW46IGZ1bmN0aW9uKHNwZWVkLCBjYWxsYmFjayl7XHJcblx0XHRyZXR1cm4gdGhpcy5hbmltYXRlKHtvcGFjaXR5OiBcInNob3dcIn0sIHNwZWVkLCBjYWxsYmFjayk7XHJcblx0fSxcclxuXHRcclxuXHRmYWRlT3V0OiBmdW5jdGlvbihzcGVlZCwgY2FsbGJhY2spe1xyXG5cdFx0cmV0dXJuIHRoaXMuYW5pbWF0ZSh7b3BhY2l0eTogXCJoaWRlXCJ9LCBzcGVlZCwgY2FsbGJhY2spO1xyXG5cdH0sXHJcblx0XHJcblx0ZmFkZVRvOiBmdW5jdGlvbihzcGVlZCx0byxjYWxsYmFjayl7XHJcblx0XHRyZXR1cm4gdGhpcy5hbmltYXRlKHtvcGFjaXR5OiB0b30sIHNwZWVkLCBjYWxsYmFjayk7XHJcblx0fSxcclxuXHRcclxuXHRhbmltYXRlOiBmdW5jdGlvbiggcHJvcCwgc3BlZWQsIGVhc2luZywgY2FsbGJhY2sgKSB7XHJcblx0XHR2YXIgb3B0YWxsID0galF1ZXJ5LnNwZWVkKHNwZWVkLCBlYXNpbmcsIGNhbGxiYWNrKTtcclxuXHJcblx0XHRyZXR1cm4gdGhpc1sgb3B0YWxsLnF1ZXVlID09PSBmYWxzZSA/IFwiZWFjaFwiIDogXCJxdWV1ZVwiIF0oZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIG9wdCA9IGpRdWVyeS5leHRlbmQoe30sIG9wdGFsbCk7XHJcblx0XHRcdHZhciBoaWRkZW4gPSBqUXVlcnkodGhpcykuaXMoXCI6aGlkZGVuXCIpLCBzZWxmID0gdGhpcztcclxuXHRcdFx0XHJcblx0XHRcdGZvciAoIHZhciBwIGluIHByb3AgKSB7XHJcblx0XHRcdFx0aWYgKCBwcm9wW3BdID09IFwiaGlkZVwiICYmIGhpZGRlbiB8fCBwcm9wW3BdID09IFwic2hvd1wiICYmICFoaWRkZW4gKVxyXG5cdFx0XHRcdFx0cmV0dXJuIGpRdWVyeS5pc0Z1bmN0aW9uKG9wdC5jb21wbGV0ZSkgJiYgb3B0LmNvbXBsZXRlLmFwcGx5KHRoaXMpO1xyXG5cclxuXHRcdFx0XHRpZiAoIHAgPT0gXCJoZWlnaHRcIiB8fCBwID09IFwid2lkdGhcIiApIHtcclxuXHRcdFx0XHRcdC8vIFN0b3JlIGRpc3BsYXkgcHJvcGVydHlcclxuXHRcdFx0XHRcdG9wdC5kaXNwbGF5ID0galF1ZXJ5LmNzcyh0aGlzLCBcImRpc3BsYXlcIik7XHJcblxyXG5cdFx0XHRcdFx0Ly8gTWFrZSBzdXJlIHRoYXQgbm90aGluZyBzbmVha3Mgb3V0XHJcblx0XHRcdFx0XHRvcHQub3ZlcmZsb3cgPSB0aGlzLnN0eWxlLm92ZXJmbG93O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKCBvcHQub3ZlcmZsb3cgIT0gbnVsbCApXHJcblx0XHRcdFx0dGhpcy5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCI7XHJcblxyXG5cdFx0XHRvcHQuY3VyQW5pbSA9IGpRdWVyeS5leHRlbmQoe30sIHByb3ApO1xyXG5cdFx0XHRcclxuXHRcdFx0alF1ZXJ5LmVhY2goIHByb3AsIGZ1bmN0aW9uKG5hbWUsIHZhbCl7XHJcblx0XHRcdFx0dmFyIGUgPSBuZXcgalF1ZXJ5LmZ4KCBzZWxmLCBvcHQsIG5hbWUgKTtcclxuXHJcblx0XHRcdFx0aWYgKCAvdG9nZ2xlfHNob3d8aGlkZS8udGVzdCh2YWwpIClcclxuXHRcdFx0XHRcdGVbIHZhbCA9PSBcInRvZ2dsZVwiID8gaGlkZGVuID8gXCJzaG93XCIgOiBcImhpZGVcIiA6IHZhbCBdKCBwcm9wICk7XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR2YXIgcGFydHMgPSB2YWwudG9TdHJpbmcoKS5tYXRjaCgvXihbKy1dPSk/KFtcXGQrLS5dKykoLiopJC8pLFxyXG5cdFx0XHRcdFx0XHRzdGFydCA9IGUuY3VyKHRydWUpIHx8IDA7XHJcblxyXG5cdFx0XHRcdFx0aWYgKCBwYXJ0cyApIHtcclxuXHRcdFx0XHRcdFx0dmFyIGVuZCA9IHBhcnNlRmxvYXQocGFydHNbMl0pLFxyXG5cdFx0XHRcdFx0XHRcdHVuaXQgPSBwYXJ0c1szXSB8fCBcInB4XCI7XHJcblxyXG5cdFx0XHRcdFx0XHQvLyBXZSBuZWVkIHRvIGNvbXB1dGUgc3RhcnRpbmcgdmFsdWVcclxuXHRcdFx0XHRcdFx0aWYgKCB1bml0ICE9IFwicHhcIiApIHtcclxuXHRcdFx0XHRcdFx0XHRzZWxmLnN0eWxlWyBuYW1lIF0gPSAoZW5kIHx8IDEpICsgdW5pdDtcclxuXHRcdFx0XHRcdFx0XHRzdGFydCA9ICgoZW5kIHx8IDEpIC8gZS5jdXIodHJ1ZSkpICogc3RhcnQ7XHJcblx0XHRcdFx0XHRcdFx0c2VsZi5zdHlsZVsgbmFtZSBdID0gc3RhcnQgKyB1bml0O1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHQvLyBJZiBhICs9Ly09IHRva2VuIHdhcyBwcm92aWRlZCwgd2UncmUgZG9pbmcgYSByZWxhdGl2ZSBhbmltYXRpb25cclxuXHRcdFx0XHRcdFx0aWYgKCBwYXJ0c1sxXSApXHJcblx0XHRcdFx0XHRcdFx0ZW5kID0gKChwYXJ0c1sxXSA9PSBcIi09XCIgPyAtMSA6IDEpICogZW5kKSArIHN0YXJ0O1xyXG5cclxuXHRcdFx0XHRcdFx0ZS5jdXN0b20oIHN0YXJ0LCBlbmQsIHVuaXQgKTtcclxuXHRcdFx0XHRcdH0gZWxzZVxyXG5cdFx0XHRcdFx0XHRlLmN1c3RvbSggc3RhcnQsIHZhbCwgXCJcIiApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQvLyBGb3IgSlMgc3RyaWN0IGNvbXBsaWFuY2VcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdFxyXG5cdHF1ZXVlOiBmdW5jdGlvbih0eXBlLCBmbil7XHJcblx0XHRpZiAoIGpRdWVyeS5pc0Z1bmN0aW9uKHR5cGUpICkge1xyXG5cdFx0XHRmbiA9IHR5cGU7XHJcblx0XHRcdHR5cGUgPSBcImZ4XCI7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCAhdHlwZSB8fCAodHlwZW9mIHR5cGUgPT0gXCJzdHJpbmdcIiAmJiAhZm4pIClcclxuXHRcdFx0cmV0dXJuIHF1ZXVlKCB0aGlzWzBdLCB0eXBlICk7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe1xyXG5cdFx0XHRpZiAoIGZuLmNvbnN0cnVjdG9yID09IEFycmF5IClcclxuXHRcdFx0XHRxdWV1ZSh0aGlzLCB0eXBlLCBmbik7XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdHF1ZXVlKHRoaXMsIHR5cGUpLnB1c2goIGZuICk7XHJcblx0XHRcdFxyXG5cdFx0XHRcdGlmICggcXVldWUodGhpcywgdHlwZSkubGVuZ3RoID09IDEgKVxyXG5cdFx0XHRcdFx0Zm4uYXBwbHkodGhpcyk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblxyXG5cdHN0b3A6IGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgdGltZXJzID0galF1ZXJ5LnRpbWVycztcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7XHJcblx0XHRcdGZvciAoIHZhciBpID0gMDsgaSA8IHRpbWVycy5sZW5ndGg7IGkrKyApXHJcblx0XHRcdFx0aWYgKCB0aW1lcnNbaV0uZWxlbSA9PSB0aGlzIClcclxuXHRcdFx0XHRcdHRpbWVycy5zcGxpY2UoaS0tLCAxKTtcclxuXHRcdH0pLmRlcXVldWUoKTtcclxuXHR9XHJcblxyXG59KTtcclxuXHJcbnZhciBxdWV1ZSA9IGZ1bmN0aW9uKCBlbGVtLCB0eXBlLCBhcnJheSApIHtcclxuXHRpZiAoICFlbGVtIClcclxuXHRcdHJldHVybjtcclxuXHJcblx0dmFyIHEgPSBqUXVlcnkuZGF0YSggZWxlbSwgdHlwZSArIFwicXVldWVcIiApO1xyXG5cclxuXHRpZiAoICFxIHx8IGFycmF5IClcclxuXHRcdHEgPSBqUXVlcnkuZGF0YSggZWxlbSwgdHlwZSArIFwicXVldWVcIiwgXHJcblx0XHRcdGFycmF5ID8galF1ZXJ5Lm1ha2VBcnJheShhcnJheSkgOiBbXSApO1xyXG5cclxuXHRyZXR1cm4gcTtcclxufTtcclxuXHJcbmpRdWVyeS5mbi5kZXF1ZXVlID0gZnVuY3Rpb24odHlwZSl7XHJcblx0dHlwZSA9IHR5cGUgfHwgXCJmeFwiO1xyXG5cclxuXHRyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgcSA9IHF1ZXVlKHRoaXMsIHR5cGUpO1xyXG5cclxuXHRcdHEuc2hpZnQoKTtcclxuXHJcblx0XHRpZiAoIHEubGVuZ3RoIClcclxuXHRcdFx0cVswXS5hcHBseSggdGhpcyApO1xyXG5cdH0pO1xyXG59O1xyXG5cclxualF1ZXJ5LmV4dGVuZCh7XHJcblx0XHJcblx0c3BlZWQ6IGZ1bmN0aW9uKHNwZWVkLCBlYXNpbmcsIGZuKSB7XHJcblx0XHR2YXIgb3B0ID0gc3BlZWQgJiYgc3BlZWQuY29uc3RydWN0b3IgPT0gT2JqZWN0ID8gc3BlZWQgOiB7XHJcblx0XHRcdGNvbXBsZXRlOiBmbiB8fCAhZm4gJiYgZWFzaW5nIHx8IFxyXG5cdFx0XHRcdGpRdWVyeS5pc0Z1bmN0aW9uKCBzcGVlZCApICYmIHNwZWVkLFxyXG5cdFx0XHRkdXJhdGlvbjogc3BlZWQsXHJcblx0XHRcdGVhc2luZzogZm4gJiYgZWFzaW5nIHx8IGVhc2luZyAmJiBlYXNpbmcuY29uc3RydWN0b3IgIT0gRnVuY3Rpb24gJiYgZWFzaW5nXHJcblx0XHR9O1xyXG5cclxuXHRcdG9wdC5kdXJhdGlvbiA9IChvcHQuZHVyYXRpb24gJiYgb3B0LmR1cmF0aW9uLmNvbnN0cnVjdG9yID09IE51bWJlciA/IFxyXG5cdFx0XHRvcHQuZHVyYXRpb24gOiBcclxuXHRcdFx0eyBzbG93OiA2MDAsIGZhc3Q6IDIwMCB9W29wdC5kdXJhdGlvbl0pIHx8IDQwMDtcclxuXHRcclxuXHRcdC8vIFF1ZXVlaW5nXHJcblx0XHRvcHQub2xkID0gb3B0LmNvbXBsZXRlO1xyXG5cdFx0b3B0LmNvbXBsZXRlID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0alF1ZXJ5KHRoaXMpLmRlcXVldWUoKTtcclxuXHRcdFx0aWYgKCBqUXVlcnkuaXNGdW5jdGlvbiggb3B0Lm9sZCApIClcclxuXHRcdFx0XHRvcHQub2xkLmFwcGx5KCB0aGlzICk7XHJcblx0XHR9O1xyXG5cdFxyXG5cdFx0cmV0dXJuIG9wdDtcclxuXHR9LFxyXG5cdFxyXG5cdGVhc2luZzoge1xyXG5cdFx0bGluZWFyOiBmdW5jdGlvbiggcCwgbiwgZmlyc3ROdW0sIGRpZmYgKSB7XHJcblx0XHRcdHJldHVybiBmaXJzdE51bSArIGRpZmYgKiBwO1xyXG5cdFx0fSxcclxuXHRcdHN3aW5nOiBmdW5jdGlvbiggcCwgbiwgZmlyc3ROdW0sIGRpZmYgKSB7XHJcblx0XHRcdHJldHVybiAoKC1NYXRoLmNvcyhwKk1hdGguUEkpLzIpICsgMC41KSAqIGRpZmYgKyBmaXJzdE51bTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdHRpbWVyczogW10sXHJcblxyXG5cdGZ4OiBmdW5jdGlvbiggZWxlbSwgb3B0aW9ucywgcHJvcCApe1xyXG5cdFx0dGhpcy5vcHRpb25zID0gb3B0aW9ucztcclxuXHRcdHRoaXMuZWxlbSA9IGVsZW07XHJcblx0XHR0aGlzLnByb3AgPSBwcm9wO1xyXG5cclxuXHRcdGlmICggIW9wdGlvbnMub3JpZyApXHJcblx0XHRcdG9wdGlvbnMub3JpZyA9IHt9O1xyXG5cdH1cclxuXHJcbn0pO1xyXG5cclxualF1ZXJ5LmZ4LnByb3RvdHlwZSA9IHtcclxuXHJcblx0Ly8gU2ltcGxlIGZ1bmN0aW9uIGZvciBzZXR0aW5nIGEgc3R5bGUgdmFsdWVcclxuXHR1cGRhdGU6IGZ1bmN0aW9uKCl7XHJcblx0XHRpZiAoIHRoaXMub3B0aW9ucy5zdGVwIClcclxuXHRcdFx0dGhpcy5vcHRpb25zLnN0ZXAuYXBwbHkoIHRoaXMuZWxlbSwgWyB0aGlzLm5vdywgdGhpcyBdICk7XHJcblxyXG5cdFx0KGpRdWVyeS5meC5zdGVwW3RoaXMucHJvcF0gfHwgalF1ZXJ5LmZ4LnN0ZXAuX2RlZmF1bHQpKCB0aGlzICk7XHJcblxyXG5cdFx0Ly8gU2V0IGRpc3BsYXkgcHJvcGVydHkgdG8gYmxvY2sgZm9yIGhlaWdodC93aWR0aCBhbmltYXRpb25zXHJcblx0XHRpZiAoIHRoaXMucHJvcCA9PSBcImhlaWdodFwiIHx8IHRoaXMucHJvcCA9PSBcIndpZHRoXCIgKVxyXG5cdFx0XHR0aGlzLmVsZW0uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuXHR9LFxyXG5cclxuXHQvLyBHZXQgdGhlIGN1cnJlbnQgc2l6ZVxyXG5cdGN1cjogZnVuY3Rpb24oZm9yY2Upe1xyXG5cdFx0aWYgKCB0aGlzLmVsZW1bdGhpcy5wcm9wXSAhPSBudWxsICYmIHRoaXMuZWxlbS5zdHlsZVt0aGlzLnByb3BdID09IG51bGwgKVxyXG5cdFx0XHRyZXR1cm4gdGhpcy5lbGVtWyB0aGlzLnByb3AgXTtcclxuXHJcblx0XHR2YXIgciA9IHBhcnNlRmxvYXQoalF1ZXJ5LmN1ckNTUyh0aGlzLmVsZW0sIHRoaXMucHJvcCwgZm9yY2UpKTtcclxuXHRcdHJldHVybiByICYmIHIgPiAtMTAwMDAgPyByIDogcGFyc2VGbG9hdChqUXVlcnkuY3NzKHRoaXMuZWxlbSwgdGhpcy5wcm9wKSkgfHwgMDtcclxuXHR9LFxyXG5cclxuXHQvLyBTdGFydCBhbiBhbmltYXRpb24gZnJvbSBvbmUgbnVtYmVyIHRvIGFub3RoZXJcclxuXHRjdXN0b206IGZ1bmN0aW9uKGZyb20sIHRvLCB1bml0KXtcclxuXHRcdHRoaXMuc3RhcnRUaW1lID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKTtcclxuXHRcdHRoaXMuc3RhcnQgPSBmcm9tO1xyXG5cdFx0dGhpcy5lbmQgPSB0bztcclxuXHRcdHRoaXMudW5pdCA9IHVuaXQgfHwgdGhpcy51bml0IHx8IFwicHhcIjtcclxuXHRcdHRoaXMubm93ID0gdGhpcy5zdGFydDtcclxuXHRcdHRoaXMucG9zID0gdGhpcy5zdGF0ZSA9IDA7XHJcblx0XHR0aGlzLnVwZGF0ZSgpO1xyXG5cclxuXHRcdHZhciBzZWxmID0gdGhpcztcclxuXHRcdGZ1bmN0aW9uIHQoKXtcclxuXHRcdFx0cmV0dXJuIHNlbGYuc3RlcCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHQuZWxlbSA9IHRoaXMuZWxlbTtcclxuXHJcblx0XHRqUXVlcnkudGltZXJzLnB1c2godCk7XHJcblxyXG5cdFx0aWYgKCBqUXVlcnkudGltZXJzLmxlbmd0aCA9PSAxICkge1xyXG5cdFx0XHR2YXIgdGltZXIgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHZhciB0aW1lcnMgPSBqUXVlcnkudGltZXJzO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGZvciAoIHZhciBpID0gMDsgaSA8IHRpbWVycy5sZW5ndGg7IGkrKyApXHJcblx0XHRcdFx0XHRpZiAoICF0aW1lcnNbaV0oKSApXHJcblx0XHRcdFx0XHRcdHRpbWVycy5zcGxpY2UoaS0tLCAxKTtcclxuXHJcblx0XHRcdFx0aWYgKCAhdGltZXJzLmxlbmd0aCApXHJcblx0XHRcdFx0XHRjbGVhckludGVydmFsKCB0aW1lciApO1xyXG5cdFx0XHR9LCAxMyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0Ly8gU2ltcGxlICdzaG93JyBmdW5jdGlvblxyXG5cdHNob3c6IGZ1bmN0aW9uKCl7XHJcblx0XHQvLyBSZW1lbWJlciB3aGVyZSB3ZSBzdGFydGVkLCBzbyB0aGF0IHdlIGNhbiBnbyBiYWNrIHRvIGl0IGxhdGVyXHJcblx0XHR0aGlzLm9wdGlvbnMub3JpZ1t0aGlzLnByb3BdID0galF1ZXJ5LmF0dHIoIHRoaXMuZWxlbS5zdHlsZSwgdGhpcy5wcm9wICk7XHJcblx0XHR0aGlzLm9wdGlvbnMuc2hvdyA9IHRydWU7XHJcblxyXG5cdFx0Ly8gQmVnaW4gdGhlIGFuaW1hdGlvblxyXG5cdFx0dGhpcy5jdXN0b20oMCwgdGhpcy5jdXIoKSk7XHJcblxyXG5cdFx0Ly8gTWFrZSBzdXJlIHRoYXQgd2Ugc3RhcnQgYXQgYSBzbWFsbCB3aWR0aC9oZWlnaHQgdG8gYXZvaWQgYW55XHJcblx0XHQvLyBmbGFzaCBvZiBjb250ZW50XHJcblx0XHRpZiAoIHRoaXMucHJvcCA9PSBcIndpZHRoXCIgfHwgdGhpcy5wcm9wID09IFwiaGVpZ2h0XCIgKVxyXG5cdFx0XHR0aGlzLmVsZW0uc3R5bGVbdGhpcy5wcm9wXSA9IFwiMXB4XCI7XHJcblx0XHRcclxuXHRcdC8vIFN0YXJ0IGJ5IHNob3dpbmcgdGhlIGVsZW1lbnRcclxuXHRcdGpRdWVyeSh0aGlzLmVsZW0pLnNob3coKTtcclxuXHR9LFxyXG5cclxuXHQvLyBTaW1wbGUgJ2hpZGUnIGZ1bmN0aW9uXHJcblx0aGlkZTogZnVuY3Rpb24oKXtcclxuXHRcdC8vIFJlbWVtYmVyIHdoZXJlIHdlIHN0YXJ0ZWQsIHNvIHRoYXQgd2UgY2FuIGdvIGJhY2sgdG8gaXQgbGF0ZXJcclxuXHRcdHRoaXMub3B0aW9ucy5vcmlnW3RoaXMucHJvcF0gPSBqUXVlcnkuYXR0ciggdGhpcy5lbGVtLnN0eWxlLCB0aGlzLnByb3AgKTtcclxuXHRcdHRoaXMub3B0aW9ucy5oaWRlID0gdHJ1ZTtcclxuXHJcblx0XHQvLyBCZWdpbiB0aGUgYW5pbWF0aW9uXHJcblx0XHR0aGlzLmN1c3RvbSh0aGlzLmN1cigpLCAwKTtcclxuXHR9LFxyXG5cclxuXHQvLyBFYWNoIHN0ZXAgb2YgYW4gYW5pbWF0aW9uXHJcblx0c3RlcDogZnVuY3Rpb24oKXtcclxuXHRcdHZhciB0ID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKTtcclxuXHJcblx0XHRpZiAoIHQgPiB0aGlzLm9wdGlvbnMuZHVyYXRpb24gKyB0aGlzLnN0YXJ0VGltZSApIHtcclxuXHRcdFx0dGhpcy5ub3cgPSB0aGlzLmVuZDtcclxuXHRcdFx0dGhpcy5wb3MgPSB0aGlzLnN0YXRlID0gMTtcclxuXHRcdFx0dGhpcy51cGRhdGUoKTtcclxuXHJcblx0XHRcdHRoaXMub3B0aW9ucy5jdXJBbmltWyB0aGlzLnByb3AgXSA9IHRydWU7XHJcblxyXG5cdFx0XHR2YXIgZG9uZSA9IHRydWU7XHJcblx0XHRcdGZvciAoIHZhciBpIGluIHRoaXMub3B0aW9ucy5jdXJBbmltIClcclxuXHRcdFx0XHRpZiAoIHRoaXMub3B0aW9ucy5jdXJBbmltW2ldICE9PSB0cnVlIClcclxuXHRcdFx0XHRcdGRvbmUgPSBmYWxzZTtcclxuXHJcblx0XHRcdGlmICggZG9uZSApIHtcclxuXHRcdFx0XHRpZiAoIHRoaXMub3B0aW9ucy5kaXNwbGF5ICE9IG51bGwgKSB7XHJcblx0XHRcdFx0XHQvLyBSZXNldCB0aGUgb3ZlcmZsb3dcclxuXHRcdFx0XHRcdHRoaXMuZWxlbS5zdHlsZS5vdmVyZmxvdyA9IHRoaXMub3B0aW9ucy5vdmVyZmxvdztcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRcdC8vIFJlc2V0IHRoZSBkaXNwbGF5XHJcblx0XHRcdFx0XHR0aGlzLmVsZW0uc3R5bGUuZGlzcGxheSA9IHRoaXMub3B0aW9ucy5kaXNwbGF5O1xyXG5cdFx0XHRcdFx0aWYgKCBqUXVlcnkuY3NzKHRoaXMuZWxlbSwgXCJkaXNwbGF5XCIpID09IFwibm9uZVwiIClcclxuXHRcdFx0XHRcdFx0dGhpcy5lbGVtLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQvLyBIaWRlIHRoZSBlbGVtZW50IGlmIHRoZSBcImhpZGVcIiBvcGVyYXRpb24gd2FzIGRvbmVcclxuXHRcdFx0XHRpZiAoIHRoaXMub3B0aW9ucy5oaWRlIClcclxuXHRcdFx0XHRcdHRoaXMuZWxlbS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcblxyXG5cdFx0XHRcdC8vIFJlc2V0IHRoZSBwcm9wZXJ0aWVzLCBpZiB0aGUgaXRlbSBoYXMgYmVlbiBoaWRkZW4gb3Igc2hvd25cclxuXHRcdFx0XHRpZiAoIHRoaXMub3B0aW9ucy5oaWRlIHx8IHRoaXMub3B0aW9ucy5zaG93IClcclxuXHRcdFx0XHRcdGZvciAoIHZhciBwIGluIHRoaXMub3B0aW9ucy5jdXJBbmltIClcclxuXHRcdFx0XHRcdFx0alF1ZXJ5LmF0dHIodGhpcy5lbGVtLnN0eWxlLCBwLCB0aGlzLm9wdGlvbnMub3JpZ1twXSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIElmIGEgY2FsbGJhY2sgd2FzIHByb3ZpZGVkLCBleGVjdXRlIGl0XHJcblx0XHRcdGlmICggZG9uZSAmJiBqUXVlcnkuaXNGdW5jdGlvbiggdGhpcy5vcHRpb25zLmNvbXBsZXRlICkgKVxyXG5cdFx0XHRcdC8vIEV4ZWN1dGUgdGhlIGNvbXBsZXRlIGZ1bmN0aW9uXHJcblx0XHRcdFx0dGhpcy5vcHRpb25zLmNvbXBsZXRlLmFwcGx5KCB0aGlzLmVsZW0gKTtcclxuXHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHZhciBuID0gdCAtIHRoaXMuc3RhcnRUaW1lO1xyXG5cdFx0XHR0aGlzLnN0YXRlID0gbiAvIHRoaXMub3B0aW9ucy5kdXJhdGlvbjtcclxuXHJcblx0XHRcdC8vIFBlcmZvcm0gdGhlIGVhc2luZyBmdW5jdGlvbiwgZGVmYXVsdHMgdG8gc3dpbmdcclxuXHRcdFx0dGhpcy5wb3MgPSBqUXVlcnkuZWFzaW5nW3RoaXMub3B0aW9ucy5lYXNpbmcgfHwgKGpRdWVyeS5lYXNpbmcuc3dpbmcgPyBcInN3aW5nXCIgOiBcImxpbmVhclwiKV0odGhpcy5zdGF0ZSwgbiwgMCwgMSwgdGhpcy5vcHRpb25zLmR1cmF0aW9uKTtcclxuXHRcdFx0dGhpcy5ub3cgPSB0aGlzLnN0YXJ0ICsgKCh0aGlzLmVuZCAtIHRoaXMuc3RhcnQpICogdGhpcy5wb3MpO1xyXG5cclxuXHRcdFx0Ly8gUGVyZm9ybSB0aGUgbmV4dCBzdGVwIG9mIHRoZSBhbmltYXRpb25cclxuXHRcdFx0dGhpcy51cGRhdGUoKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcblxyXG59O1xyXG5cclxualF1ZXJ5LmZ4LnN0ZXAgPSB7XHJcblx0c2Nyb2xsTGVmdDogZnVuY3Rpb24oZngpe1xyXG5cdFx0ZnguZWxlbS5zY3JvbGxMZWZ0ID0gZngubm93O1xyXG5cdH0sXHJcblxyXG5cdHNjcm9sbFRvcDogZnVuY3Rpb24oZngpe1xyXG5cdFx0ZnguZWxlbS5zY3JvbGxUb3AgPSBmeC5ub3c7XHJcblx0fSxcclxuXHJcblx0b3BhY2l0eTogZnVuY3Rpb24oZngpe1xyXG5cdFx0alF1ZXJ5LmF0dHIoZnguZWxlbS5zdHlsZSwgXCJvcGFjaXR5XCIsIGZ4Lm5vdyk7XHJcblx0fSxcclxuXHJcblx0X2RlZmF1bHQ6IGZ1bmN0aW9uKGZ4KXtcclxuXHRcdGZ4LmVsZW0uc3R5bGVbIGZ4LnByb3AgXSA9IGZ4Lm5vdyArIGZ4LnVuaXQ7XHJcblx0fVxyXG59O1xyXG4vLyBUaGUgT2Zmc2V0IE1ldGhvZFxyXG4vLyBPcmlnaW5hbGx5IEJ5IEJyYW5kb24gQWFyb24sIHBhcnQgb2YgdGhlIERpbWVuc2lvbiBQbHVnaW5cclxuLy8gaHR0cDovL2pxdWVyeS5jb20vcGx1Z2lucy9wcm9qZWN0L2RpbWVuc2lvbnNcclxualF1ZXJ5LmZuLm9mZnNldCA9IGZ1bmN0aW9uKCkge1xyXG5cdHZhciBsZWZ0ID0gMCwgdG9wID0gMCwgZWxlbSA9IHRoaXNbMF0sIHJlc3VsdHM7XHJcblx0XHJcblx0aWYgKCBlbGVtICkgd2l0aCAoIGpRdWVyeS5icm93c2VyICkge1xyXG5cdFx0dmFyXHRwYXJlbnQgICAgICAgPSBlbGVtLnBhcmVudE5vZGUsIFxyXG5cdFx0ICAgIG9mZnNldENoaWxkICA9IGVsZW0sXHJcblx0XHQgICAgb2Zmc2V0UGFyZW50ID0gZWxlbS5vZmZzZXRQYXJlbnQsIFxyXG5cdFx0ICAgIGRvYyAgICAgICAgICA9IGVsZW0ub3duZXJEb2N1bWVudCxcclxuXHRcdCAgICBzYWZhcmkyICAgICAgPSBzYWZhcmkgJiYgcGFyc2VJbnQodmVyc2lvbikgPCA1MjIsXHJcblx0XHQgICAgZml4ZWQgICAgICAgID0galF1ZXJ5LmNzcyhlbGVtLCBcInBvc2l0aW9uXCIpID09IFwiZml4ZWRcIjtcclxuXHRcclxuXHRcdC8vIFVzZSBnZXRCb3VuZGluZ0NsaWVudFJlY3QgaWYgYXZhaWxhYmxlXHJcblx0XHRpZiAoIGVsZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0ICkge1xyXG5cdFx0XHR2YXIgYm94ID0gZWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHRcdFxyXG5cdFx0XHQvLyBBZGQgdGhlIGRvY3VtZW50IHNjcm9sbCBvZmZzZXRzXHJcblx0XHRcdGFkZChcclxuXHRcdFx0XHRib3gubGVmdCArIE1hdGgubWF4KGRvYy5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdCwgZG9jLmJvZHkuc2Nyb2xsTGVmdCksXHJcblx0XHRcdFx0Ym94LnRvcCAgKyBNYXRoLm1heChkb2MuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcCwgIGRvYy5ib2R5LnNjcm9sbFRvcClcclxuXHRcdFx0KTtcclxuXHRcdFxyXG5cdFx0XHQvLyBJRSBhZGRzIHRoZSBIVE1MIGVsZW1lbnQncyBib3JkZXIsIGJ5IGRlZmF1bHQgaXQgaXMgbWVkaXVtIHdoaWNoIGlzIDJweFxyXG5cdFx0XHQvLyBJRSA2IGFuZCBJRSA3IHF1aXJrcyBtb2RlIHRoZSBib3JkZXIgd2lkdGggaXMgb3ZlcndyaXRhYmxlIGJ5IHRoZSBmb2xsb3dpbmcgY3NzIGh0bWwgeyBib3JkZXI6IDA7IH1cclxuXHRcdFx0Ly8gSUUgNyBzdGFuZGFyZHMgbW9kZSwgdGhlIGJvcmRlciBpcyBhbHdheXMgMnB4XHJcblx0XHRcdGlmICggbXNpZSApIHtcclxuXHRcdFx0XHR2YXIgYm9yZGVyID0galF1ZXJ5KFwiaHRtbFwiKS5jc3MoXCJib3JkZXJXaWR0aFwiKTtcclxuXHRcdFx0XHRib3JkZXIgPSAoYm9yZGVyID09IFwibWVkaXVtXCIgfHwgalF1ZXJ5LmJveE1vZGVsICYmIHBhcnNlSW50KHZlcnNpb24pID49IDcpICYmIDIgfHwgYm9yZGVyO1xyXG5cdFx0XHRcdGFkZCggLWJvcmRlciwgLWJvcmRlciApO1xyXG5cdFx0XHR9XHJcblx0XHJcblx0XHQvLyBPdGhlcndpc2UgbG9vcCB0aHJvdWdoIHRoZSBvZmZzZXRQYXJlbnRzIGFuZCBwYXJlbnROb2Rlc1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFxyXG5cdFx0XHQvLyBJbml0aWFsIGVsZW1lbnQgb2Zmc2V0c1xyXG5cdFx0XHRhZGQoIGVsZW0ub2Zmc2V0TGVmdCwgZWxlbS5vZmZzZXRUb3AgKTtcclxuXHRcdFxyXG5cdFx0XHQvLyBHZXQgcGFyZW50IG9mZnNldHNcclxuXHRcdFx0d2hpbGUgKCBvZmZzZXRQYXJlbnQgKSB7XHJcblx0XHRcdFx0Ly8gQWRkIG9mZnNldFBhcmVudCBvZmZzZXRzXHJcblx0XHRcdFx0YWRkKCBvZmZzZXRQYXJlbnQub2Zmc2V0TGVmdCwgb2Zmc2V0UGFyZW50Lm9mZnNldFRvcCApO1xyXG5cdFx0XHRcclxuXHRcdFx0XHQvLyBNb3ppbGxhIGFuZCBTYWZhcmkgPiAyIGRvZXMgbm90IGluY2x1ZGUgdGhlIGJvcmRlciBvbiBvZmZzZXQgcGFyZW50c1xyXG5cdFx0XHRcdC8vIEhvd2V2ZXIgTW96aWxsYSBhZGRzIHRoZSBib3JkZXIgZm9yIHRhYmxlIG9yIHRhYmxlIGNlbGxzXHJcblx0XHRcdFx0aWYgKCBtb3ppbGxhICYmICEvXnQoYWJsZXxkfGgpJC9pLnRlc3Qob2Zmc2V0UGFyZW50LnRhZ05hbWUpIHx8IHNhZmFyaSAmJiAhc2FmYXJpMiApXHJcblx0XHRcdFx0XHRib3JkZXIoIG9mZnNldFBhcmVudCApO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0Ly8gQWRkIHRoZSBkb2N1bWVudCBzY3JvbGwgb2Zmc2V0cyBpZiBwb3NpdGlvbiBpcyBmaXhlZCBvbiBhbnkgb2Zmc2V0UGFyZW50XHJcblx0XHRcdFx0aWYgKCAhZml4ZWQgJiYgalF1ZXJ5LmNzcyhvZmZzZXRQYXJlbnQsIFwicG9zaXRpb25cIikgPT0gXCJmaXhlZFwiIClcclxuXHRcdFx0XHRcdGZpeGVkID0gdHJ1ZTtcclxuXHRcdFx0XHJcblx0XHRcdFx0Ly8gU2V0IG9mZnNldENoaWxkIHRvIHByZXZpb3VzIG9mZnNldFBhcmVudCB1bmxlc3MgaXQgaXMgdGhlIGJvZHkgZWxlbWVudFxyXG5cdFx0XHRcdG9mZnNldENoaWxkICA9IC9eYm9keSQvaS50ZXN0KG9mZnNldFBhcmVudC50YWdOYW1lKSA/IG9mZnNldENoaWxkIDogb2Zmc2V0UGFyZW50O1xyXG5cdFx0XHRcdC8vIEdldCBuZXh0IG9mZnNldFBhcmVudFxyXG5cdFx0XHRcdG9mZnNldFBhcmVudCA9IG9mZnNldFBhcmVudC5vZmZzZXRQYXJlbnQ7XHJcblx0XHRcdH1cclxuXHRcdFxyXG5cdFx0XHQvLyBHZXQgcGFyZW50IHNjcm9sbCBvZmZzZXRzXHJcblx0XHRcdHdoaWxlICggcGFyZW50LnRhZ05hbWUgJiYgIS9eYm9keXxodG1sJC9pLnRlc3QocGFyZW50LnRhZ05hbWUpICkge1xyXG5cdFx0XHRcdC8vIFJlbW92ZSBwYXJlbnQgc2Nyb2xsIFVOTEVTUyB0aGF0IHBhcmVudCBpcyBpbmxpbmUgb3IgYSB0YWJsZS1yb3cgdG8gd29yayBhcm91bmQgT3BlcmEgaW5saW5lL3RhYmxlIHNjcm9sbExlZnQvVG9wIGJ1Z1xyXG5cdFx0XHRcdGlmICggIS9eaW5saW5lfHRhYmxlLXJvdy4qJC9pLnRlc3QoalF1ZXJ5LmNzcyhwYXJlbnQsIFwiZGlzcGxheVwiKSkgKVxyXG5cdFx0XHRcdFx0Ly8gU3VidHJhY3QgcGFyZW50IHNjcm9sbCBvZmZzZXRzXHJcblx0XHRcdFx0XHRhZGQoIC1wYXJlbnQuc2Nyb2xsTGVmdCwgLXBhcmVudC5zY3JvbGxUb3AgKTtcclxuXHRcdFx0XHJcblx0XHRcdFx0Ly8gTW96aWxsYSBkb2VzIG5vdCBhZGQgdGhlIGJvcmRlciBmb3IgYSBwYXJlbnQgdGhhdCBoYXMgb3ZlcmZsb3cgIT0gdmlzaWJsZVxyXG5cdFx0XHRcdGlmICggbW96aWxsYSAmJiBqUXVlcnkuY3NzKHBhcmVudCwgXCJvdmVyZmxvd1wiKSAhPSBcInZpc2libGVcIiApXHJcblx0XHRcdFx0XHRib3JkZXIoIHBhcmVudCApO1xyXG5cdFx0XHRcclxuXHRcdFx0XHQvLyBHZXQgbmV4dCBwYXJlbnRcclxuXHRcdFx0XHRwYXJlbnQgPSBwYXJlbnQucGFyZW50Tm9kZTtcclxuXHRcdFx0fVxyXG5cdFx0XHJcblx0XHRcdC8vIFNhZmFyaSA8PSAyIGRvdWJsZXMgYm9keSBvZmZzZXRzIHdpdGggYSBmaXhlZCBwb3NpdGlvbiBlbGVtZW50L29mZnNldFBhcmVudCBvciBhYnNvbHV0ZWx5IHBvc2l0aW9uZWQgb2Zmc2V0Q2hpbGRcclxuXHRcdFx0Ly8gTW96aWxsYSBkb3VibGVzIGJvZHkgb2Zmc2V0cyB3aXRoIGEgbm9uLWFic29sdXRlbHkgcG9zaXRpb25lZCBvZmZzZXRDaGlsZFxyXG5cdFx0XHRpZiAoIChzYWZhcmkyICYmIChmaXhlZCB8fCBqUXVlcnkuY3NzKG9mZnNldENoaWxkLCBcInBvc2l0aW9uXCIpID09IFwiYWJzb2x1dGVcIikpIHx8IFxyXG5cdFx0XHRcdChtb3ppbGxhICYmIGpRdWVyeS5jc3Mob2Zmc2V0Q2hpbGQsIFwicG9zaXRpb25cIikgIT0gXCJhYnNvbHR1ZVwiKSApXHJcblx0XHRcdFx0XHRhZGQoIC1kb2MuYm9keS5vZmZzZXRMZWZ0LCAtZG9jLmJvZHkub2Zmc2V0VG9wICk7XHJcblx0XHRcdFxyXG5cdFx0XHQvLyBBZGQgdGhlIGRvY3VtZW50IHNjcm9sbCBvZmZzZXRzIGlmIHBvc2l0aW9uIGlzIGZpeGVkXHJcblx0XHRcdGlmICggZml4ZWQgKVxyXG5cdFx0XHRcdGFkZChcclxuXHRcdFx0XHRcdE1hdGgubWF4KGRvYy5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdCwgZG9jLmJvZHkuc2Nyb2xsTGVmdCksXHJcblx0XHRcdFx0XHRNYXRoLm1heChkb2MuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcCwgIGRvYy5ib2R5LnNjcm9sbFRvcClcclxuXHRcdFx0XHQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFJldHVybiBhbiBvYmplY3Qgd2l0aCB0b3AgYW5kIGxlZnQgcHJvcGVydGllc1xyXG5cdFx0cmVzdWx0cyA9IHsgdG9wOiB0b3AsIGxlZnQ6IGxlZnQgfTtcclxuXHR9XHJcblxyXG5cdHJldHVybiByZXN1bHRzO1xyXG5cclxuXHRmdW5jdGlvbiBib3JkZXIoZWxlbSkge1xyXG5cdFx0YWRkKCBqUXVlcnkuY3NzKGVsZW0sIFwiYm9yZGVyTGVmdFdpZHRoXCIpLCBqUXVlcnkuY3NzKGVsZW0sIFwiYm9yZGVyVG9wV2lkdGhcIikgKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGFkZChsLCB0KSB7XHJcblx0XHRsZWZ0ICs9IHBhcnNlSW50KGwpIHx8IDA7XHJcblx0XHR0b3AgKz0gcGFyc2VJbnQodCkgfHwgMDtcclxuXHR9XHJcbn07XHJcbn0pKCk7XHJcblxyXG4vKlxyXG4gKiBqUXVlcnkgQ29sb3IgQW5pbWF0aW9uc1xyXG4gKiBDb3B5cmlnaHQgMjAwNyBKb2huIFJlc2lnXHJcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgYW5kIEdQTCBsaWNlbnNlcy5cclxuICovXHJcblxyXG4oZnVuY3Rpb24oalF1ZXJ5KXtcclxuXHJcblx0Ly8gV2Ugb3ZlcnJpZGUgdGhlIGFuaW1hdGlvbiBmb3IgYWxsIG9mIHRoZXNlIGNvbG9yIHN0eWxlc1xyXG5cdGpRdWVyeS5lYWNoKFsnYmFja2dyb3VuZENvbG9yJywgJ2JvcmRlckJvdHRvbUNvbG9yJywgJ2JvcmRlckxlZnRDb2xvcicsICdib3JkZXJSaWdodENvbG9yJywgJ2JvcmRlclRvcENvbG9yJywgJ2NvbG9yJywgJ291dGxpbmVDb2xvciddLCBmdW5jdGlvbihpLGF0dHIpe1xyXG5cdFx0alF1ZXJ5LmZ4LnN0ZXBbYXR0cl0gPSBmdW5jdGlvbihmeCl7XHJcblx0XHRcdGlmICggZnguc3RhdGUgPT0gMCApIHtcclxuXHRcdFx0XHRmeC5zdGFydCA9IGdldENvbG9yKCBmeC5lbGVtLCBhdHRyICk7XHJcblx0XHRcdFx0ZnguZW5kID0gZ2V0UkdCKCBmeC5lbmQgKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZnguZWxlbS5zdHlsZVthdHRyXSA9IFwicmdiKFwiICsgW1xyXG5cdFx0XHRcdE1hdGgubWF4KE1hdGgubWluKCBwYXJzZUludCgoZngucG9zICogKGZ4LmVuZFswXSAtIGZ4LnN0YXJ0WzBdKSkgKyBmeC5zdGFydFswXSksIDI1NSksIDApLFxyXG5cdFx0XHRcdE1hdGgubWF4KE1hdGgubWluKCBwYXJzZUludCgoZngucG9zICogKGZ4LmVuZFsxXSAtIGZ4LnN0YXJ0WzFdKSkgKyBmeC5zdGFydFsxXSksIDI1NSksIDApLFxyXG5cdFx0XHRcdE1hdGgubWF4KE1hdGgubWluKCBwYXJzZUludCgoZngucG9zICogKGZ4LmVuZFsyXSAtIGZ4LnN0YXJ0WzJdKSkgKyBmeC5zdGFydFsyXSksIDI1NSksIDApXHJcblx0XHRcdF0uam9pbihcIixcIikgKyBcIilcIjtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0Ly8gQ29sb3IgQ29udmVyc2lvbiBmdW5jdGlvbnMgZnJvbSBoaWdobGlnaHRGYWRlXHJcblx0Ly8gQnkgQmxhaXIgTWl0Y2hlbG1vcmVcclxuXHQvLyBodHRwOi8vanF1ZXJ5Lm9mZnB1dC5jYS9oaWdobGlnaHRGYWRlL1xyXG5cclxuXHQvLyBQYXJzZSBzdHJpbmdzIGxvb2tpbmcgZm9yIGNvbG9yIHR1cGxlcyBbMjU1LDI1NSwyNTVdXHJcblx0ZnVuY3Rpb24gZ2V0UkdCKGNvbG9yKSB7XHJcblx0XHR2YXIgcmVzdWx0O1xyXG5cclxuXHRcdC8vIENoZWNrIGlmIHdlJ3JlIGFscmVhZHkgZGVhbGluZyB3aXRoIGFuIGFycmF5IG9mIGNvbG9yc1xyXG5cdFx0aWYgKCBjb2xvciAmJiBjb2xvci5jb25zdHJ1Y3RvciA9PSBBcnJheSAmJiBjb2xvci5sZW5ndGggPT0gMyApXHJcblx0XHRcdHJldHVybiBjb2xvcjtcclxuXHJcblx0XHQvLyBMb29rIGZvciByZ2IobnVtLG51bSxudW0pXHJcblx0XHRpZiAocmVzdWx0ID0gL3JnYlxcKFxccyooWzAtOV17MSwzfSlcXHMqLFxccyooWzAtOV17MSwzfSlcXHMqLFxccyooWzAtOV17MSwzfSlcXHMqXFwpLy5leGVjKGNvbG9yKSlcclxuXHRcdFx0cmV0dXJuIFtwYXJzZUludChyZXN1bHRbMV0pLCBwYXJzZUludChyZXN1bHRbMl0pLCBwYXJzZUludChyZXN1bHRbM10pXTtcclxuXHJcblx0XHQvLyBMb29rIGZvciByZ2IobnVtJSxudW0lLG51bSUpXHJcblx0XHRpZiAocmVzdWx0ID0gL3JnYlxcKFxccyooWzAtOV0rKD86XFwuWzAtOV0rKT8pXFwlXFxzKixcXHMqKFswLTldKyg/OlxcLlswLTldKyk/KVxcJVxccyosXFxzKihbMC05XSsoPzpcXC5bMC05XSspPylcXCVcXHMqXFwpLy5leGVjKGNvbG9yKSlcclxuXHRcdFx0cmV0dXJuIFtwYXJzZUZsb2F0KHJlc3VsdFsxXSkqMi41NSwgcGFyc2VGbG9hdChyZXN1bHRbMl0pKjIuNTUsIHBhcnNlRmxvYXQocmVzdWx0WzNdKSoyLjU1XTtcclxuXHJcblx0XHQvLyBMb29rIGZvciAjYTBiMWMyXHJcblx0XHRpZiAocmVzdWx0ID0gLyMoW2EtZkEtRjAtOV17Mn0pKFthLWZBLUYwLTldezJ9KShbYS1mQS1GMC05XXsyfSkvLmV4ZWMoY29sb3IpKVxyXG5cdFx0XHRyZXR1cm4gW3BhcnNlSW50KHJlc3VsdFsxXSwxNiksIHBhcnNlSW50KHJlc3VsdFsyXSwxNiksIHBhcnNlSW50KHJlc3VsdFszXSwxNildO1xyXG5cclxuXHRcdC8vIExvb2sgZm9yICNmZmZcclxuXHRcdGlmIChyZXN1bHQgPSAvIyhbYS1mQS1GMC05XSkoW2EtZkEtRjAtOV0pKFthLWZBLUYwLTldKS8uZXhlYyhjb2xvcikpXHJcblx0XHRcdHJldHVybiBbcGFyc2VJbnQocmVzdWx0WzFdK3Jlc3VsdFsxXSwxNiksIHBhcnNlSW50KHJlc3VsdFsyXStyZXN1bHRbMl0sMTYpLCBwYXJzZUludChyZXN1bHRbM10rcmVzdWx0WzNdLDE2KV07XHJcblxyXG5cdFx0Ly8gT3RoZXJ3aXNlLCB3ZSdyZSBtb3N0IGxpa2VseSBkZWFsaW5nIHdpdGggYSBuYW1lZCBjb2xvclxyXG5cdFx0cmV0dXJuIGNvbG9yc1tqUXVlcnkudHJpbShjb2xvcikudG9Mb3dlckNhc2UoKV07XHJcblx0fVxyXG5cdFxyXG5cdGZ1bmN0aW9uIGdldENvbG9yKGVsZW0sIGF0dHIpIHtcclxuXHRcdHZhciBjb2xvcjtcclxuXHJcblx0XHRkbyB7XHJcblx0XHRcdGNvbG9yID0galF1ZXJ5LmN1ckNTUyhlbGVtLCBhdHRyKTtcclxuXHJcblx0XHRcdC8vIEtlZXAgZ29pbmcgdW50aWwgd2UgZmluZCBhbiBlbGVtZW50IHRoYXQgaGFzIGNvbG9yLCBvciB3ZSBoaXQgdGhlIGJvZHlcclxuXHRcdFx0aWYgKCBjb2xvciAhPSAnJyAmJiBjb2xvciAhPSAndHJhbnNwYXJlbnQnIHx8IGpRdWVyeS5ub2RlTmFtZShlbGVtLCBcImJvZHlcIikgKVxyXG5cdFx0XHRcdGJyZWFrOyBcclxuXHJcblx0XHRcdGF0dHIgPSBcImJhY2tncm91bmRDb2xvclwiO1xyXG5cdFx0fSB3aGlsZSAoIGVsZW0gPSBlbGVtLnBhcmVudE5vZGUgKTtcclxuXHJcblx0XHRyZXR1cm4gZ2V0UkdCKGNvbG9yKTtcclxuXHR9O1xyXG5cdFxyXG5cdC8vIFNvbWUgbmFtZWQgY29sb3JzIHRvIHdvcmsgd2l0aFxyXG5cdC8vIEZyb20gSW50ZXJmYWNlIGJ5IFN0ZWZhbiBQZXRyZVxyXG5cdC8vIGh0dHA6Ly9pbnRlcmZhY2UuZXllY29uLnJvL1xyXG5cclxuXHR2YXIgY29sb3JzID0ge1xyXG5cdFx0YXF1YTpbMCwyNTUsMjU1XSxcclxuXHRcdGF6dXJlOlsyNDAsMjU1LDI1NV0sXHJcblx0XHRiZWlnZTpbMjQ1LDI0NSwyMjBdLFxyXG5cdFx0YmxhY2s6WzAsMCwwXSxcclxuXHRcdGJsdWU6WzAsMCwyNTVdLFxyXG5cdFx0YnJvd246WzE2NSw0Miw0Ml0sXHJcblx0XHRjeWFuOlswLDI1NSwyNTVdLFxyXG5cdFx0ZGFya2JsdWU6WzAsMCwxMzldLFxyXG5cdFx0ZGFya2N5YW46WzAsMTM5LDEzOV0sXHJcblx0XHRkYXJrZ3JleTpbMTY5LDE2OSwxNjldLFxyXG5cdFx0ZGFya2dyZWVuOlswLDEwMCwwXSxcclxuXHRcdGRhcmtraGFraTpbMTg5LDE4MywxMDddLFxyXG5cdFx0ZGFya21hZ2VudGE6WzEzOSwwLDEzOV0sXHJcblx0XHRkYXJrb2xpdmVncmVlbjpbODUsMTA3LDQ3XSxcclxuXHRcdGRhcmtvcmFuZ2U6WzI1NSwxNDAsMF0sXHJcblx0XHRkYXJrb3JjaGlkOlsxNTMsNTAsMjA0XSxcclxuXHRcdGRhcmtyZWQ6WzEzOSwwLDBdLFxyXG5cdFx0ZGFya3NhbG1vbjpbMjMzLDE1MCwxMjJdLFxyXG5cdFx0ZGFya3Zpb2xldDpbMTQ4LDAsMjExXSxcclxuXHRcdGZ1Y2hzaWE6WzI1NSwwLDI1NV0sXHJcblx0XHRnb2xkOlsyNTUsMjE1LDBdLFxyXG5cdFx0Z3JlZW46WzAsMTI4LDBdLFxyXG5cdFx0aW5kaWdvOls3NSwwLDEzMF0sXHJcblx0XHRraGFraTpbMjQwLDIzMCwxNDBdLFxyXG5cdFx0bGlnaHRibHVlOlsxNzMsMjE2LDIzMF0sXHJcblx0XHRsaWdodGN5YW46WzIyNCwyNTUsMjU1XSxcclxuXHRcdGxpZ2h0Z3JlZW46WzE0NCwyMzgsMTQ0XSxcclxuXHRcdGxpZ2h0Z3JleTpbMjExLDIxMSwyMTFdLFxyXG5cdFx0bGlnaHRwaW5rOlsyNTUsMTgyLDE5M10sXHJcblx0XHRsaWdodHllbGxvdzpbMjU1LDI1NSwyMjRdLFxyXG5cdFx0bGltZTpbMCwyNTUsMF0sXHJcblx0XHRtYWdlbnRhOlsyNTUsMCwyNTVdLFxyXG5cdFx0bWFyb29uOlsxMjgsMCwwXSxcclxuXHRcdG5hdnk6WzAsMCwxMjhdLFxyXG5cdFx0b2xpdmU6WzEyOCwxMjgsMF0sXHJcblx0XHRvcmFuZ2U6WzI1NSwxNjUsMF0sXHJcblx0XHRwaW5rOlsyNTUsMTkyLDIwM10sXHJcblx0XHRwdXJwbGU6WzEyOCwwLDEyOF0sXHJcblx0XHR2aW9sZXQ6WzEyOCwwLDEyOF0sXHJcblx0XHRyZWQ6WzI1NSwwLDBdLFxyXG5cdFx0c2lsdmVyOlsxOTIsMTkyLDE5Ml0sXHJcblx0XHR3aGl0ZTpbMjU1LDI1NSwyNTVdLFxyXG5cdFx0eWVsbG93OlsyNTUsMjU1LDBdXHJcblx0fTtcclxuXHRcclxufSkoalF1ZXJ5KTsiXSwiZmlsZSI6ImpxdWVyeS5qcyJ9
