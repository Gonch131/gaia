var assert = require('assert');

var CALENDAR_APP = 'app://calendar.gaiamobile.org';
var CALENDAR_APP_MANIFEST = CALENDAR_APP + '/manifest.webapp';

marionette('Notification.get():', function() {

<<<<<<< HEAD
  // Disabled: bug 974734
  return;

=======
>>>>>>> c250da9f8fdc511ad718ba594a0aa60a5959e74b
  var client = marionette.client({
    settings: {
      'ftu.manifestURL': null
    }
  });

  test('promise is fulfilled', function(done) {
    var error = client.executeAsyncScript(function() {
      if (!Notification.get) {
        return marionetteScriptFinished('no .get memeber');
      }

      var promise = Notification.get();
      if (!promise || !promise.then) {
        return marionetteScriptFinished('no promise returned');
      }

      promise.then(
        function(notifications) {
          marionetteScriptFinished(false);
        },
        function(err) {
          marionetteScriptFinished('promise errored');
        });
    });
    assert.equal(error, false, 'Notification.get fulfilled promise');
    done();
  });

  test('promise returns a new notification', function(done) {
    var error = client.executeAsyncScript(function() {
      try {
        var title = 'test title';
        var notification = new Notification(title);
        var promise = Notification.get();
        promise.then(function(notifications) {
          if (!notifications || !notifications.length) {
            marionetteScriptFinished('get returned no notifications');
          }
          var found = notifications.some(function(notification) {
            return notification.title === title;
          });
          if (!found) {
            marionetteScriptFinished('new notification not returned');
          }
          // success, return no error
          marionetteScriptFinished(false);
        }, function(error) {
          marionetteScriptFinished('promise.then error :' + error);
        });
      } catch (error) {
        marionetteScriptFinished('uncaught error: ' + error);
      }
    });
    assert.equal(error, false, 'new notification error: ' + error);
    done();
  });

  test('get works with tag option', function(done) {
    var error = client.executeAsyncScript(function() {
      try {
        var title = 'test title, tag';
        var options = {
          tag: 'my tag:' + Date.now()
        };
        var notification = new Notification(title, options);
        var promise = Notification.get({tag: options.tag});
        promise.then(function(notifications) {
          if (!notifications) {
            marionetteScriptFinished('promise return no notifications');
          }
          if (notifications.length !== 1) {
            marionetteScriptFinished('tag filter did not give us 1 result');
          }
          var n = notifications[0];
          if (n.title !== title || n.tag !== options.tag) {
            marionetteScriptFinished(
              'tag filter returned wrong notification');
          }
          // success, return no error
          marionetteScriptFinished(false);
        }, function(error) {
          marionetteScriptFinished('promise.then error: ' + error);
        });
      } catch (error) {
        marionetteScriptFinished('uncaught error: ' + error);
      }
    });
    assert.equal(error, false, 'get with tag error: ' + error);
    done();
  });

  // skip until gecko part of bug 1000337 lands
  test.skip('should work across domains', function(done) {
    var sharedTag = 'shared tag:' + Date.now();
    var emailTitle = 'email title:' + Date.now();
    var systemTitle = 'system tite:' + Date.now();

    // switch to email app and send notification
    client.apps.launch(CALENDAR_APP);
    client.apps.switchToApp(CALENDAR_APP);
    client.executeScript(function(title, tag) {
      var notification = new Notification(title, {tag: tag});
    }, [emailTitle, sharedTag]);

    // switch to system app and send system notification
    client.switchToFrame();
    client.executeScript(function(title, tag) {
      var notification = new Notification(title, {tag: tag});
    }, [systemTitle, sharedTag]);

    // switch back to email, and fetch notification by tag
    client.apps.launch(CALENDAR_APP);
    client.apps.switchToApp(CALENDAR_APP);
    var error = client.executeAsyncScript(function(title, tag) {
      var promise = Notification.get({tag: tag});
      promise.then(function(notifications) {
        if (!notifications || notifications.length !== 1) {
          marionetteScriptFinished('no notifications returned');
        }
        var notification = notifications[0];
        if (notification.tag !== tag || notification.title !== title) {
          marionetteScriptFinished('incorrent notification data returned');
        }
        // success, return no error
        marionetteScriptFinished(false);
      }, function(error) {
        marionetteScriptFinished('promise.then error: ' + error);
      });
    }, [emailTitle, sharedTag]);
    assert.equal(error, false, 'email domain error: ' + error);

    // switch to system app, fetch it's notifications by tag
    client.switchToFrame();
    error = client.executeAsyncScript(function(title, tag) {
      var promise = Notification.get({tag: tag});
      promise.then(function(notifications) {
        if (!notifications || notifications.length !== 1) {
          marionetteScriptFinished('no notifications returned');
        }
        var notification = notifications[0];
        if (notification.tag !== tag || notification.title !== title) {
          marionetteScriptFinished('incorrent notification data returned');
        }
        // success, return no error
        marionetteScriptFinished(false);
      }, function(error) {
        marionetteScriptFinished('promise.then error: ' + error);
      });
    }, [systemTitle, sharedTag]);
    assert.equal(error, false, 'system domain error: ' + error);
    done();
  });

  test('notifications should persist even after closing app',
  function(done) {
    var title = 'test title:' + Date.now();
    var tag = 'test tag:' + Date.now();

    client.apps.launch(CALENDAR_APP);
    client.apps.switchToApp(CALENDAR_APP);

    client.executeScript(function(title, tag) {
      var notification = new Notification(title, {tag: tag});
    }, [title, tag]);

    client.switchToFrame();
    client.apps.close(CALENDAR_APP);

    client.apps.launch(CALENDAR_APP);
    client.apps.switchToApp(CALENDAR_APP);

    var error = client.executeAsyncScript(function(title, tag) {
      var promise = Notification.get({tag: tag});
      promise.then(function(notifications) {
        if (!notifications || notifications.length !== 1) {
          marionetteScriptFinished('no notifications returned');
        }
        var notification = notifications[0];
        if (notification.tag !== tag || notification.title !== title) {
          marionetteScriptFinished('incorrent notification data returned');
        }
        // success, return no error
        marionetteScriptFinished(false);
      }, function(error) {
        marionetteScriptFinished('promise.then error: ' + error);
      });
    }, [title, tag]);
    assert.equal(error, false, 'notification persist error: ' + error);
    done();
  });

  test('bug 931307, empty title should not cause crash', function(done) {
    var error = client.executeAsyncScript(function() {
      var notification = new Notification('');
      var promise = Notification.get();
      promise.then(function() {
        marionetteScriptFinished(false);
      }, function() {
        marionetteScriptFinished('promise returned an error');
      });
    });
    assert.equal(error, false, 'empty title returned error: ' + error);
    done();
  });

  test('desktop-notification-close removes notification', function(done) {
    var notificationTitle = 'Title:' + Date.now();

    // switch to calendar app and send notification
    client.apps.launch(CALENDAR_APP);
    client.apps.switchToApp(CALENDAR_APP);
    client.executeScript(function(title) {
      var notification = new Notification(title);
    }, [notificationTitle]);

    // switch to system app and send desktop-notification-close
    client.switchToFrame();
    var error = client.executeAsyncScript(function(manifest) {
      var container =
        document.getElementById('desktop-notifications-container');
      var selector = '[data-manifest-u-r-l="' + manifest + '"]';
      var nodes = container.querySelectorAll(selector);
      if (nodes.length === 0) {
        marionetteScriptFinished('no node to query');
      }
      for (var i = nodes.length - 1; i >= 0; i--) {
        var event = document.createEvent('CustomEvent');
        event.initCustomEvent('mozContentEvent', true, true, {
          type: 'desktop-notification-close',
          id: nodes[i].dataset.notificationId
        });
        window.dispatchEvent(event);
      }
      marionetteScriptFinished(false);
    }, [CALENDAR_APP_MANIFEST]);
    assert.equal(error, false, 'desktop-notification-close error: ' + error);

    // switch back to calendar, and fetch notifications
    client.apps.launch(CALENDAR_APP);
    client.apps.switchToApp(CALENDAR_APP);
    var error = client.executeAsyncScript(function() {
      var promise = Notification.get();
      promise.then(function(notifications) {
        if (notifications && notifications.length !== 0) {
          marionetteScriptFinished('notification still present');
        }
        // success, return no error
        marionetteScriptFinished(false);
      }, function(error) {
        marionetteScriptFinished('promise.then error: ' + error);
      });
    });
    assert.equal(error, false, 'desktop-notification-close error: ' + error);
    done();
  });

});
