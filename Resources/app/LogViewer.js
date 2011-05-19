
Ext.define('F3Dev.LogViewer', {
	extend: 'Ext.panel.Panel',
	
	initComponent: function(){
		Ext.apply(this, {
			padding: 5,
			title: 'Log Viewer',
			autoScroll: true
		});
		this.callParent(arguments);
		console.log(F3Dev.Preferences.currentInstanceBasePath);
		var logMonitor = Titanium.Process.createProcess({
			args: ['tail', '-f', F3Dev.Preferences.currentInstanceBasePath + 'Data/Logs/System.log']
		});

		var scope = this;
		var timeOfLastChange = 0;
		logMonitor.setOnReadLine(function(logMessage) {
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
			} else if (logMessage.match('ERROR')) {
				cls += 'error';
			}
			scope.getTargetEl().insertFirst({
				cls: cls,
				html: logMessage
			});
		});
		logMonitor.launch();
		
		Titanium.API.addEventListener(Titanium.APP_EXIT, function() {
			logMonitor.kill();
		});
	}
});