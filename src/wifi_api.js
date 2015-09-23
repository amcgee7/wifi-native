var postMessage = function(msg) {
	return $.Deferred(function(pmdfd) {
		//!msg && pmdfd.reject('no msg passed to postMessage');
		$.when(extension.postMessage(JSON.stringify(msg))).then(function postMessageSuccess(returnMSG) {
			pmdfd.resolve(JSON.parse(returnMSG));
		}, function postMessageFailure(fail) {
			var failObj = (!fail) ? 'postMessageFailure': fail;
			pmdfd.reject(fail);
		});
	}).promise();
},
postSyncMessage = function(msg) {
	return $.Deferred(function(psmdfd) {
		$.when(extension.internal.sendSyncMessage(JSON.stringify(msg))).then(function postSyncMessageSuccess(returnMSG) {
			!!development && console.log('in postSyncMessageSuccess');
			psmdfd.resolve(JSON.parse(returnMSG));
		},function postSyncMessageFailure(fail) {
			!!development && console.log('in postSyncMessageFailure');
			psmdfd.reject(fail);
		});
	}).promise();
};

exports.scan = function() {
	$.when(postSyncMessage({"cmd": "Scan"})).then(function scanSuccess(retMsg) {
		var msg = (retMsg) ? retMsg: 'no message came back';
		console.log('in scanSuccess: ', msg);
	}, function scanFailure(failMsg) {
		var msg = (failMsg) ? failMsg: 'no fail message came back';
		console.error('in scanFailure: ', msg);
	});
}

/* * /



// Copyright (c) 2015 Jaguar Land Rover. All rights reserved.
//

var WifiManager = (function() {
	var development = true,
		undefined,
		self,
		postMessage = function(msg) {
			return $.Deferred(function(pmdfd) {
				!msg && pmdfd.reject('no msg passed to postMessage');
				$.when(extension.postMessage(msg)).then(function postMessageSuccess(returnMSG) {
					!!development && console.log('in postMessageSuccess with returnMSG: ', JSON.parse(returnMSG));
					pmdfd.resolve(returnMSG);
				}, function postMessageFailure(fail) {
					!!development && console.log('in postMessageFailure');
					console.error('failed to retrieve msg from C with this fail error: ', fail);
					pmdfd.reject(fail);
				});
			}).promise();
		};

	return {
		init: function() {
			self = (!self) ? this: self;
			!!development && console.log(self);
		},
		/* * /
		FUTURE DEV
		catchUserMsg: function(msgObj) {
			$.when(postMessage(JSON.stringify(msgObj))).then(self.hollaBack, self.failBack);
			
			
			return $.Deferred(function(umdfd) {
				!msgObj && umdfd.reject('no msgObj was passed to catchUserMsg');
				!msgObj.cmd && umdfd.reject('no command to issue the hardware');
				$.when(postMessage(JSON.stringify(msgObj))).then(function postMessageReturnSuccess(returnObj) {
					!!development && console.log('in postMessageReturnSuccess');
					umdfd.resolve(returnObj);
				}, function postMessageReturnFailure(fail) {
					!!development && console.log('in catchUserMsgFail');
					!!development && console.log('fail: ', fail);
					umdfd.reject(fail);
				});
			}).promise();
			
		},
		sendIt: function(msgObj) {
			$.when(postMessage(JSON.stringify(msgObj))).then(function(retObj) {
				!!development && console.log('in hollaback with retObj: ', retObj);
				return retObj;
			}, function(fail) {
				!!development && console.log('in fail callback with fail: ', fail);
				return fail;
			});
		},
		serverSetPowered: function(msgObj) {
			return self.sendIt({cmd: "Activate"});
		},
		handleGetPowered: function(msgObj) {
			return self.sendIt({cmd: "GetPowered"});
		},
		handleSetTethering: function(msgObj) {
			return self.sendIt({cmd: "SetTethering"});
		},
		handleConnect: function(msgObj) {
			return self.sendIt({cmd: "Connect"});
		},
		handleDisconnect: function(msgObj) {
			return self.sendIt({cmd: "Disconnect"});
		},
		handleSetAutoConnect: function(msgObj) {
			return self.sendIt({cmd: ""});
		},
		handleGetTechnologies: function(msgObj) {
			return self.sendIt({cmd: ""});
		},
		handleGetServices: function() {
			return self.sendIt({cmd: "GetServices"});
		},
		handleScan: function() {
			var msgObj = {cmd: "Scan", reply_id: 42};
			// $.when(postMessage(JSON.stringify(msgObj))).then(self.hollaBack, self.failBack);
			$.when(postMessage(JSON.stringify(msgObj))).then(function(retObj) {
				!!development && console.log('in hollaback with retObj: ', retObj);
				return retObj;
			}, function(fail) {
				!!development && console.log('in fail callback with fail: ', fail);
				return fail;
			});
		}
	}
}());

WifiManager.init();

exports.handleSetPowered = WifiManager.clientSetPowered;

exports.handleGetPowered = WifiManager.handleGetPowered;

exports.handleSetTethering = WifiManager.handleSetTethering;

exports.handleConnect = WifiManager.handleConnect;

exports.handleDisconnect = WifiManager.handleDisconnect;

exports.handleSetAutoConnect = WifiManager.handleSetAutoConnect;

exports.handleGetTechnologies = WifiManager.handleGetTechnologies;

exports.handleGetServices = WifiManager.handleGetServices;

exports.handleScan = WifiManager.handleScan;
/* */
