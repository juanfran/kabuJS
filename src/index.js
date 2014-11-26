(function() {
  "use strict";

  window.kabu = {};

  var forEach = function (array, callback, scope) {
    for (var i = 0; i < array.length; i++) {
      callback.call(scope, i, array[i]);
    }
  };

  kabu.module = function (dpName, dependencies, fn) {
    Injector.add(dpName, fn);
    fn._inject = dependencies;
  };

  kabu.service = kabu.module;
  kabu.view = kabu.module;

  kabu.getViews = function (parent) {
    if (parent) {
      return elm.querySelectorAll('[view]');
    } else {
      return document.querySelectorAll('[view]');
    }
  };

  kabu.compile = function (elm) {
    var views = kabu.getViews(elm);

    forEach(views, function (index, elm) {
      var viewsName = elm.getAttribute('view').split(',');

      for (var i = 0; i < viewsName.length; i++) {
        var fn = Injector.get(viewsName[i].trim());
        if (fn) {
          Injector.invoke(fn, {el: function () {
            return elm;
          }});
        } else {
          throw new Error(viewsName + ' does not exist');
        }
      }
    });
  };

  kabu.exec = function (moduleName) {
    var fn = Injector.get(moduleName);
    return Injector.invoke(fn);
  };

  // exec before init views
  kabu.configure = {};
  kabu.configure.fns = [];
  kabu.configure.exec = function () {
    for (var i = 0; i < kabu.configure.fns.length; i++) {
      kabu.configure.fns[i]();
    }
  };

  kabu.configure.addConfiguration = function (fn) {
    kabu.configure.fns.push(fn);
  };

  // exec after init views
  kabu.load = {};
  kabu.load.fns = [];
  kabu.load.exec = function () {
    for (var i = 0; i < kabu.load.fns.length; i++) {
      kabu.load.fns[i]();
    }
  };

  kabu.load.onLoad = function (fn) {
    kabu.load.fns.push(fn);
  };

  kabu.init = function () {
    kabu.configure.exec();
    kabu.compile();
    kabu.load.exec();
  };
}());
