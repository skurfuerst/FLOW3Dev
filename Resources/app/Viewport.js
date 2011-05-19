
Ext.define('F3Dev.Viewport', {
	extend: 'Ext.container.Viewport',
	
	initComponent: function(){
		Ext.apply(this, {
			layout: 'border',
			padding: 5,
			items: [Ext.create('F3Dev.MainPanel', {region: 'center'})]
		});
		this.callParent(arguments);
		this._initMenu();
	},
	_initMenu: function() {
		var menu = Titanium.UI.createMenu();
		var developmentMenuElement = Titanium.UI.createMenuItem("Development");
		menu.appendItem(developmentMenuElement);

		var compile = developmentMenuElement.addItem("Compile");		
		compile.addEventListener(function() {
			F3Dev.Flow3Connector.runCompileStep();
		});
		
		var monitorCompilationMenuElement;
		monitorCompilationMenuElement = developmentMenuElement.addCheckItem("Monitor Compilation", function() {
			var oldState = monitorCompilationMenuElement.getState();
			if (oldState == true) {
				// it was checked, so it will be unchecked now
				F3Dev.Flow3Connector.deactivateClassFileMonitoring();
			} else {
				// it was not checked, so it will be checked now.
				F3Dev.Flow3Connector.activateClassFileMonitoring();
			}
		});
		
		developmentMenuElement.addSeparatorItem();
		
		var editSettings = developmentMenuElement.addItem("Edit Settings");
		editSettings.addEventListener(function() {
			Titanium.Platform.openApplication(F3Dev.Preferences.getPreferencesFile().toString());
		});
		
		
		var environmentMenuElement = Titanium.UI.createMenuItem("Environment");
		menu.appendItem(environmentMenuElement);
		var menuItems = [];
		Ext.iterate(F3Dev.Preferences.get('FLOW3Instances'), function(shortName, path) {
			var menuItem = environmentMenuElement.addCheckItem(shortName, function() {
				var currentItem = this;
				Ext.each(menuItems, function(item) {
					if (item !== currentItem) {
						item.setState(false);
					}
				});
				F3Dev.Preferences.currentInstanceName = shortName;
				F3Dev.Preferences.currentInstanceBasePath = path;
				if (F3Dev.Preferences.preferencesChanged) {
					F3Dev.Preferences.preferencesChanged(); // TODO: use real events here!
				}
			});
			menuItems.push(menuItem);
		});
		Titanium.UI.setMenu(menu);
	}
});