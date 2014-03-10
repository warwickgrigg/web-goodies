
var Callbacks = function() {
	this.callbacks = { };
}

/**
 * Enable the following calback
 */
Callbacks.prototype.supportCallback = function(name) {
	var camelName = name[0].toUpperCase() + name.substr(1),
		self = this;
	this.callbacks[name] = [];
	this['on' + camelName] = function(callback) {
		self.callbacks[name].push(callback);
	};
	this['off' + camelName] = function(callback) {
		var i = self.callbacks[name].indexOf(callback);
		if (i>=0) self.callbacks[name].splice(i,1);
	};
	this['fire' + camelName] = function() {
		for (var i=0; i<self.callbacks[name].length; i++) {
			self.callbacks[name][i].apply(self, arguments);
		}
	};
}
