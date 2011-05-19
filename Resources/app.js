// Register namespaces and their corresponding paths to Ext.Loader
Ext.Loader.setConfig({enabled:true});
Ext.Loader.setPath({
    'F3Dev': 'app'
});

// Specify a list of classes your application your application needs
Ext.require([
    'F3Dev.MainPanel',
    'F3Dev.Viewport',
    'F3Dev.Flow3Connector',
    'F3Dev.Preferences',
    'F3Dev.LogViewer'
]);

// Application's initialization
Ext.onReady(function() {
	F3Dev.Preferences.load();
	F3Dev.Flow3Connector.init();
	var bootstrap = new F3Dev.Viewport;
});