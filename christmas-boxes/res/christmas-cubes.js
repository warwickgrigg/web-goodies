/*!
 * The MIT License (MIT)
 *
 * Copyright (c) 2013 Charalampidis Ioannis
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

(function(glob) {

	/**
	 * Constructor for the christmas boxes
	 */
	var ChristmasCubes = glob.ChristmasCubes = function(width, height, container) {

		// Pre-populate variables
		if (!width) width=500;
		if (!height) height=500;
		if (!container) container=document.body;

		// Check if we should enter IE-compatibility mode
		// (Up to IE10, there is *NO* proper support of 3D CSS3 transformations)
		this.compat = (navigator.appVersion.indexOf("MSIE") != -1);

		// Create host element
		this.host = document.createElement('div');
		this.host.className = "cb-host";
		this.host.style['width'] = width + 'px';
		this.host.style['height'] = height + 'px';

		// Append to DOM
		container.appendChild(this.host);

	};

	/**
	 * Function to allocate a cube with a message
	 *
	 * Parameters:
	 *
	 *		x : The X-position of the cube in pixels
	 *		y : The Y-position of the cube in pixels
	 * 	  num : The number to put in front of the box
	 *	title : The title of the mssage inside the box
	 *	 text : The text in the message inside the box
	 *	  url : The URL to redirect to when clicked
	 *
	 */
	ChristmasCubes.prototype.addCube = function(x,y,num,title,text,url) {

		// Check if we should use the IE-Compatible cube
		var suffix = "";
		if (this.compat) suffix = " compat";

		// Create cube
		var cube = document.createElement('a');
		cube.className = 'cube' + suffix;
		cube.style['left'] = x + 'pt';
		cube.style['top'] = y + 'pt';
		cube.href = url || "javascript:void;";
		this.host.appendChild(cube);

		// If we are in compatibility mode, add only a single
		// face. Otherwise, implement the full message stack.
		if (this.compat) {

			// Append single face
			var face = document.createElement('figure');
			face.className = 'f fr';
			cube.appendChild(face);

			// Put the number in the face
			var num = document.createElement('div');
			num.className = 'num';
			num.innerHTML = num;
			face.appendChild(num);

		} else {
			// Append faces
			var sides = ['f','b'];
			var faces = ['fr','bk','rt','lt', 'bt'];
			for (s=0;s<sides.length;s++){
				for (f=0;f<faces.length;f++){
					var face = document.createElement('figure');
					face.className = sides[s] + ' ' + faces[f];
					cube.appendChild(face);

					// Append num to the front
					if ((s==0) && (f==0)) {
						var num = document.createElement('div');
						num.className = 'num';
						num.innerHTML = num;
						face.appendChild(num);
					}
				}
			}
		}

		// Create message node
		var msg = document.createElement('figure');
		msg.className = "message";
		cube.appendChild(msg);

		// Append title
		var msgTitle = document.createElement('h4');
		msgTitle.innerHTML = title;
		msg.appendChild(msgTitle);

		// Append text
		var msgText = document.createElement('p');
		msgText.innerHTML = text;
		msg.appendChild(msgText);


	}

})(window);
