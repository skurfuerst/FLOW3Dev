Ext.define('F3Dev.Preferences', {
	statics: {
		_properties: null,
		
		currentInstanceBasePath: null,
		currentInstanceName: null,
		preferencesChanged: null,
		 
		load: function() {
			if (!this.getPreferencesFile().exists()) {
				alert('Please create a preferences file at ' + this.getPreferencesFile().toString());
			}
			
			var fileContents = this.getPreferencesFile().open().read().toString();
			this._properties = Ext.JSON.decode(fileContents);
		},
		getPreferencesFile: function() {
			return Titanium.Filesystem.getFile(Titanium.API.application.dataPath + Titanium.Filesystem.getSeparator() + 'preferences.txt');
		},
		get: function(path) {
			var parts = path.split('.'), el=this._properties;
			
			for (var i in parts) {
				if (!el[parts[i]]) return null;
				el = el[parts[i]];
			}
	
			return el;
		}
	}
});