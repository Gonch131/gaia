'use strict';

function includeJS(elementContainer) {

  var scripts = new Array(
    "js/nfc_consts.js",
    "js/records/nfc_text.js",
    "js/records/nfc_uri.js",
    "js/records/nfc_sms.js",
    "js/records/nfc_smartposter.js",
    "js/nfc_writer.js",
    "js/nfc_ui.js"
  );
  for (var i=0; i < scripts.length; i++) {
    var element = document.createElement('script');
    element.type = 'text/javascript';
    element.src = scripts[i];
    elementContainer.appendChild(element);
  }
}

// Include scripts at head:
includeJS(document.getElementsByTagName("head")[0]);
