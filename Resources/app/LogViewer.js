
Ext.define('F3Dev.LogViewer', {
	extend: 'Ext.panel.Panel',
	
	logFile: null,
	
	initComponent: function(){
		Ext.apply(this, {
			padding: 5,
			autoScroll: true,
			listeners: {
				afterrender:Ext.Function.bind(this._setupFileMonitoring, this)
			}
		});
		this.callParent(arguments);
	},
	_setupFileMonitoring: function() {
		var scope = this;
		var timeOfLastChange = 0;
		this._monitorFile(F3Dev.Preferences.currentInstanceBasePath + 'Data/Logs/' + this.logFile, function(logMessage) {
			var timestampNow = (new Date()).getTime();

			if (timeOfLastChange <= timestampNow - 2000) {
				// If nothing happened for at least two seconds, we insert a horizontal line for better readability.
				scope.getTargetEl().insertFirst({
					tag: 'hr'
				});
			}
			timeOfLastChange = timestampNow;
  
			var cls = 'logMessage ';
			if (logMessage.match('INFO')) {
				cls += 'info';
			} else if (logMessage.match('NOTICE')) {
				cls += 'notice';
			} else if (logMessage.match('ERROR')) {
				cls += 'error';
			} else if (logMessage.match('CRITICAL')) {
				cls += 'critical';
				F3Dev.Flow3Connector._showNotification('!!! Critical message in log');
			}
			scope.getTargetEl().insertFirst({
				cls: cls,
				html: logMessage
			});
		});

		Titanium.API.addEventListener(Titanium.APP_EXIT, function() {
			logMonitor.kill();
		});
	},
	_monitorFile: function(filePath, callback) {
		var file = Titanium.Filesystem.getFile(filePath);
		var scope = this;
		if (!file.exists()) {
			var checkFileExistenceTimer;
			checkFileExistenceTimer = window.setInterval(function() {
				if (file.exists()) {
						// now, the file exists, so we start watching it, and
						// terminate our checker.
					window.clearTimeout(checkFileExistenceTimer);
					scope._monitorFile(filePath, callback);
				}
			}, 2000);
			
			return;
		}
		var oldSize = file.size() - 1024; // On first run of the interval function, the last 1024 bytes of the file will be displayed.
		if (oldSize < 0) oldSize = 0;
		window.setInterval(function() {
			var currentSize = file.size();
			if (oldSize !== currentSize) {
				var stream = file.open();
				stream.seek(oldSize);
				oldSize = currentSize;
				while(line = stream.readLine()) {
					try {
						callback(line.toString());
					} catch(e) {
						console.error("EXCEPTION");
						console.error(e);
					}
				}
				stream.close();
			}
		}, 100);
	}
});