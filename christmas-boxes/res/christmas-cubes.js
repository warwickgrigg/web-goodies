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
	var ChristmasCubes = glob.ChristmasCubes = function(width, height, container, background) {

		// Pre-populate variables
		if (!width) width=500;
		if (!height) height=500;
		if (!container) container=document.body;
		if (typeof(container) == 'string') container=document.getElementById(container);

		// Check if we should enter IE-compatibility mode
		// (Up to IE10, there is *NO* proper support of 3D CSS3 transformations)
		this.compat = (navigator.appVersion.indexOf("MSIE") != -1);

		// Create host element
		this.host = document.createElement('div');
		this.host.className = "cb-host";
		this.host.style['width'] = width + 'px';
		this.host.style['height'] = height + 'px';

		// Setup background image
		if (background) {
			this.host.style['background-image'] = 'url(' + background + ')';
			this.host.style['background-size'] = 'contain';
			this.host.style['background-position'] = 'center center';
			this.host.style['background-repeat'] = 'no-repeat';
		}

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
	 * 	 face : The number to put in front of the box
	 *	title : The title of the mssage inside the box
	 *	 text : The text in the message inside the box
	 *	 link : The URL to redirect to when clicked
	 * imgURL : The image to place inside the cube
	 * toolTip: The text to be shown when the user hovers the mouse over the person
	 *
	 */
	ChristmasCubes.prototype.addCube = function(x,y,cfg) {

		// Prepare variables
		if (!cfg) cfg={};
		var faceText = cfg.face || null,
			link = cfg.link || "javascript:;",
			title = cfg.title || null,
			text = cfg.text || null,
			imgURL = cfg.imgURL || null,
			toolTip = cfg.toolTip || "";

		// Check if we should use the IE-Compatible cube
		var suffix = "";
		if (this.compat) suffix = " compat";

		// Create cube
		var cube = document.createElement('a');
		cube.title = toolTip;
		cube.target = "_blank";
		cube.className = 'cube' + suffix;
		cube.style['left'] = x + 'px';
		cube.style['top'] = y + 'px';
		cube.href = link || "javascript:void;";
		this.host.appendChild(cube);

		// If we are in compatibility mode, add only a single
		// face. Otherwise, implement the full message stack.
		if (this.compat) {

			// Animation container
			var anibox = document.createElement('div');
			anibox.className = 'ani';
			cube.appendChild(anibox);

			// Replace cube
			cube = anibox;

			// Append single face
			var face = document.createElement('figure');
			face.className = 'f fr';
			cube.appendChild(face);

			// Put the number in the face
			if (faceText!=null) {
				var num = document.createElement('div');
				num.className = 'num';
				num.innerHTML = faceText;
				face.appendChild(num);
			}

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
					if ((s==0) && (f==0) && (faceText!=null)) {
						var num = document.createElement('div');
						num.className = 'num';
						num.innerHTML = faceText;
						face.appendChild(num);
					}
				}
			}
		}

		// Create message node
		var msg = document.createElement('figure');
		msg.className = "message";
		cube.appendChild(msg);

		// Setup background image
		if (imgURL!=null) {
			msg.style['background-image'] = 'url(' + imgURL + ')';
			msg.style['background-size'] = 'cover';
			msg.style['background-position'] = 'center center';
			msg.style['background-repeat'] = 'no-repeat';
		}

		// Append title
		if (title!=null) {
			var msgTitle = document.createElement('h4');
			msgTitle.innerHTML = title;
			msg.appendChild(msgTitle);
		}

		// Append text
		if (text!=null) {
			var msgText = document.createElement('p');
			msgText.innerHTML = text;
			msg.appendChild(msgText);
		}

	}

})(window);
