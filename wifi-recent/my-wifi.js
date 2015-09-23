var Wifi = (function() {
	var self = this,
	isPowered = false,
	$settingsPageList = $('#settingsPageList'),
	$WifiPage = $('#WifiPage'),
	$SettingsPage = $('#settingsPage'),
	$addNetworkButton = $('#addNetworkButton'),
	$addNetworkModal = $('#AddNetworkModal'),
	$addNetworkExitModal = $('#AddNetworkExitModal'),
	$closeButton = $('#wifiBackArrow'),
	$WifiDeviceTemplate = $('#WifiDeviceTemplate'),
	$wifiPowerButton = $('#wifiPowerButton'),
	networks = [],
	$template = $('#wifi-network'), // currently, this is the id of the content div. should be id of template. no need to set id to undefined.
	WifiError = function(message) {
	        !!development && console.log('in WifiError');
	        this.name = 'WifiError';
	        this.message = "Settings: " + message || 'Settings: Default Error message from WifiError';
	        this.callingMethod = WifiError.caller;
	    };
	WifiError.prototype = Object.create(Error.prototype);
	WifiError.prototype.constructor = WifiError;

	return {
		init: function() {},
		Settings: {
			sself: this,
			isUpdating: false,
			Page: {
				TemplateHTML: "DNA_common/components/wifi/wifi.html",
				showPage: function() {
					console.log('wifi page show_click();');
					$.when(self.loadComponents()).then(function loadComponentsSuccess() {
						$settingsPageList.fadeOut().promise().done(function() {
							$wifiPage.fadeIn();
						});
					}, function loadComponentsFailure(err) {
						throw new WifiError('failed to loadComponents: ', err);
					});
				},
				hidePage: function() {
					$wifiPage.fadeOut().promise().done(function() {
						$settingsPageList.fadeIn();
					});
				},
				pageUpdate: function() {
					console.log("wifi pageUpdate()");
					/* TODO: do this thing */
					// temporary until i can figure out exactly what is happening here.
					if (!$settingsPage.length) {
						setTimeout(self.Settings.pageUpdate, 1000);
					} else {
						$settingsPage.append($wifiPage);

						Settings.addUpdateSettingsPage('wifi', 'settings', WifiSettingsPage.ShowPage);

						$addNetworkButton.off('click').on('click', function(e) {
							e.preventDefault();
							e.stopPropagation();
							$AddNetworkModal.fadeIn();
						});

						$AddNetworkExitModal.off('click').on('click', function(e) {
							e.preventDefault();
							e.stopPropagation();

							$AddNetworkModal.fadeOut();
						});

						$closeButton.off('click').on('click', function(e) {
							e.preventDefault();
							e.stopPropagation();
							sself.HidePage();
						});
					}
				},
				includeHTMLSuccess: function(linkobj) {
					/**
					 ** TODO: look into the purpose of this (includeHTMLSuccess() [sic]).
					**/
					console.log("loaded wifi.html");
					WifiSettingsPage.import = linkobj.path[0].import;
					WifiSettingsPage.wifiPageHTML = WifiSettingsPage.import.getElementById('WifiPage');
					WifiSettingsPage.WifiDeviceHTML = WifiSettingsPage.import.getElementById('WifiDeviceTemplate');
					WifiSettingsPage.WifiAddNetworkModalHTML = WifiSettingsPage.import.getElementById('AddNetworkModal');
					$("#WifiPage").append(WifiSettingsPage.WifiAddNetworkModalHTML);
					//$("#settingsPage").append(WifiSettingsPage.import.getElementById('WifiPage'));
					//$("body").append(WifiSettingsPage.import.getElementById('WifiPage'));
					//var close_button = document.getElementById('tabsCloseSubPanelWifiButton').onclick = WifiSettingsPage.HidePage;
					onDependency("Settings.settingsPage",WifiSettingsPage.pageUpdate,"Wifi");
					//WifiSettingsPage.pageUpdate();
				},
				includeHTMLFailed: function(linkobj) {
					!!linkobj && throw new WifiError('no linkobj was passed to includeHTMLFailed');
					throw new WifiError('load wifi.html failed: ', linkobj);
				}
			},
			togglePoweredState: function(newState) {
				!newState && throw new WifiError('no newState was passed to togglePoweredState');
				isPowered = !isPowered;
				$wifiPowerButton.toggleClass('on', isPowered);
				$wifiPowerButton.toggleClass('off', !isPowered);
			},
			updateNetworks: function(services) {
				var tempServices = [],
				existingServices = services.filter(function(ns) {
					return ns.prop.Type === 'wifi';
				});

				if (existingServices) {
					if (existingServices.length > 1) {
						$.each(existingServices, function(i, svc) {
							tempServices.push(svc);
						});
					} else {
						tempServices.push(existingServices);
					}
				}
				if (tempServices.length) {
					self.networks = tempServices;
				}
				self.displayNetworks();
			},
			displayNetworks: function() {
				$wifiNetworksList.empty();
				var networksToAdd = [];

				$.each(self.networks, function(i, network) {
					var newNetwork = $template.clone();
					$(newNetwork).find('.wifiElementTitle').text(network.prop.Name);
					networksToAdd.push(newNetwork);
				});

				if (networksToAdd.length) {
					$wifiNetworksList.append(networksToAdd.join(''));
				}
			}
		}
	}
}());