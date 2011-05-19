
Ext.define('F3Dev.MainPanel', {
	extend: 'Ext.tab.Panel',
	
	initComponent: function(){
		Ext.apply(this, {
			padding: 5,
			items: []
		});
		this.callParent(arguments);
		var scope = this;
		// TODO: use proper event handling here
		F3Dev.Preferences.preferencesChanged = function() {
			scope.add(Ext.create('F3Dev.LogViewer', {title: 'System Log', logFile: 'System.log'}));
			scope.add(Ext.create('F3Dev.LogViewer', {title: 'Security Log', logFile: 'Security.log'}));
		};
	}
});