
Ext.define('F3Dev.Flow3Connector', {
	statics: {
		_compilationCurrentlyRunning: false,
		
		init: function() {
			Titanium.API.addEventListener(Titanium.APP_EXIT, function() {
				F3Dev.Flow3Connector.deactivateClassFileMonitoring();
			});
		},
		
		runCompileStep: function() {
			if (this._compilationCurrentlyRunning) return;
			if (!F3Dev.Preferences.currentInstanceBasePath) return;
			
			this._showNotification('Compilation started');
			this._compilationCurrentlyRunning = true;
			
			var proc = Titanium.Process.createProcess({
				args: ['/opt/local/bin/php', F3Dev.Preferences.currentInstanceBasePath + 'flow3', 'flow3:core:compile'],
				env: {
					'FLOW3_ROOTPATH': F3Dev.Preferences.currentInstanceBasePath
				}
			});
			
			proc.setOnExit(function() {
				F3Dev.Flow3Connector._showNotification('Compilation finished');
				F3Dev.Flow3Connector._compilationCurrentlyRunning = false;
			});
			proc.launch();
		},
		
		clearSettingsFileCache: function() {
			if (!F3Dev.Preferences.currentInstanceBasePath) return;
			
			var file = Titanium.Filesystem.getFile(F3Dev.Preferences.currentInstanceBasePath + 'Data/Temporary/Production/Configuration/ProductionConfigurations.php');
			if (file.exists()) {
				var returnValue = file.deleteFile();
				if (returnValue) {
					this._showNotification('Removed configuration');
				} else {
					this._showNotification('!!! Could not remove configuration, Permission issue?');
				}
			}
		},
		
		activateClassFileMonitoring: function() {
			var fileMonitor = Titanium.Process.createProcess({
				//args: ['osascript', '-e', 'do shell script "/Applications/fseventer/fseventer.app/Contents/Resources/fetool" with administrator privileges']
				args: F3Dev.Preferences.get('Programs.FileSystemEvents')
			});

			var timeout;
			var customMonitorExpression = F3Dev.Preferences.get('customClassMonitoringExpression');
			fileMonitor.setOnReadLine(function(changedFileName) {
				if (changedFileName.match(/Configuration.*yaml$/)) {
					F3Dev.Flow3Connector.clearSettingsFileCache();
				}
				if (changedFileName.match(/Packages.*Classes.*\.php$/) || (customMonitorExpression && changedFileName.match(customMonitorExpression))) {
					if (timeout) window.clearTimeout(timeout);
					timeout = window.setTimeout(function() {
						F3Dev.Flow3Connector.runCompileStep();
					}, 100);
				}					
			});
			fileMonitor.launch();
			this._showNotification('Activated automatic compilation');
		},
		deactivateClassFileMonitoring: function() {
			Titanium.Process.createProcess({
				args: ['sudo', 'killall', 'fetool']
			}).launch();
			this._showNotification('Deactivated automatic compilation');
		},
		_showNotification: function(title) {
			var notification = Titanium.Notification.createNotification();
			if (F3Dev.Preferences.currentInstanceName) {
				notification.setTitle(F3Dev.Preferences.currentInstanceName);
			} else {
				notification.setTitle("!!! NO INSTANCE SET YET!");
			}
			notification.setMessage(title);
			notification.setTimeout(1);
			notification.show();
			return notification;
		}
	}
});