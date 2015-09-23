var wifiListener = null;

extension.setMessageListener(function(msg) {
  if (wifiListener instanceof Function) {
    wifiListener(msg);
  };
});

exports.wifiAsync = function (msg, callback) {
  wifiListener = callback;
  extension.postMessage(msg);
};

exports.wifiSync = function (msg) {
  return extension.internal.sendSyncMessage(msg);
};