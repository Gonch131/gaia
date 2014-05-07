define(function(require, exports, module) {
'use strict';

/**
 * Dependencies
 */

var debug = require('debug')('controller:hud');
var bindAll = require('lib/bind-all');

/**
 * Exports
 */

module.exports = function(app) { return new HudController(app); };
module.exports.HudController = HudController;

/**
 * Initialize a new `HudController`
 *
 * @param {AppController} app
 * @constructor
 *
 */
function HudController(app) {
  bindAll(this);
  this.app = app;
  this.hud = app.views.hud;
  this.settings = app.settings;
  this.localize = app.localize;
  this.notification = app.views.notification;
  this.configure();
  this.bindEvents();
  debug('initialized');
}

/**
 * Initially configure state.
 *
 * @private
 */
HudController.prototype.configure = function() {
  var hasDualCamera = this.settings.cameras.get('options').length > 1;
  this.hud.enable('camera', hasDualCamera);

  // Disable flash button until we
  // know whether the hardware has flash
  this.hud.enable('flash', false);
};

/**
 * Bind callbacks to events.
 *
 * @return {HudController} for chaining
 * @private
 */
HudController.prototype.bindEvents = function() {
  this.app.settings.flashModes.on('change:selected', this.updateFlashMode);
  this.app.settings.mode.on('change:selected', this.updateFlashMode);
  this.app.on('settings:configured', this.updateFlashSupport);
  this.app.once('criticalpathdone', this.hud.show);

  // View
  this.hud.on('click:settings', this.app.firer('settings:toggle'));
  this.hud.on('click:camera', this.onCameraClick);
  this.hud.on('click:flash', this.onFlashClick);

  // Camera
  this.app.on('camera:ready', this.hud.setter('camera', 'ready'));
  this.app.on('camera:busy', this.hud.setter('camera', 'busy'));
  this.app.on('change:recording', this.hud.setter('recording'));

  // Timer
  this.app.on('timer:cleared', this.hud.setter('timer', 'inactive'));
  this.app.on('timer:started', this.hud.setter('timer', 'active'));
  this.app.on('timer:ended', this.hud.setter('timer', 'inactive'));

  // Settings
  this.app.on('settings:opened', this.hud.hide);
  this.app.on('settings:closed', this.hud.show);
};

HudController.prototype.onSettingsConfigured = function() {
  this.updateFlashSupport();
};

HudController.prototype.onModeChange = function() {
  this.clearNotifications();
  this.updateFlashMode();
};

HudController.prototype.onCameraClick = function() {
  this.clearNotifications();
  this.app.settings.cameras.next();
};

HudController.prototype.clearNotifications = function() {
  this.notification.clear(this.flashNotification);
};

/**
 * Cycle to the next available flash
 * option, update the HUD view and
 * show a change notification.
 *
 * @private
 */
HudController.prototype.onFlashClick = function() {
  var setting = this.settings.flashModes;
  var ishdrOn = this.settings.hdr.selected('key') === 'on';

  setting.next();
  this.hud.set('flashMode' , setting.selected('key'));
  this.notify(setting, ishdrOn);
};

/**
 * Display a notifcation showing the
 * current state of the given setting.
 *
 * @param  {Setting} setting
 * @private
 */
HudController.prototype.notify = function(setting, hdrDeactivated) {
  var optionTitle = this.localize(setting.selected('title'));
  var title = this.localize(setting.get('title'));
  var html;

  // Check if the `hdr` setting is going to be deactivated as part
  // of the change in the `flashMode` setting and display a specialized
  // notification if that is the case
  if (hdrDeactivated) {
    html = title + ' ' + optionTitle + '<br/>' +
      this.localize('hdr-deactivated');
  } else {
    html = title + '<br/>' + optionTitle;
  }

  this.flashNotification = this.notification.display({ text: html });
};

HudController.prototype.updateFlashMode = function() {
  var selected = this.settings.flashModes.selected();
  if (!selected) { return; }
  this.hud.setFlashMode(selected);
  debug('updated flash mode: %s', selected.key);
};

HudController.prototype.updateFlashSupport = function() {
  var supported = this.settings.flashModes.supported();
  this.hud.enable('flash', supported);
  this.updateFlashMode();
  debug('flash supported: %s', supported);
};

});
