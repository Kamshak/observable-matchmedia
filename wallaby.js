module.exports = function () {

  return {
    files: [
      {pattern: 'jspm_packages/system.js', instrument: false},
      {pattern: 'systemjs.conf.js', instrument: false},

      {pattern: 'src/**/*.ts', load: false}
    ],
    tests: [
      {pattern: 'test/**/*spec.ts', load: false}
    ],

    // todo set compiler option to set another module format e.g amd

    middleware: function (app, express) {
      app.use('/jspm_packages', express.static(require('path').join(__dirname, 'jspm_packages')));
    },

    setup: function (wallaby) {
      wallaby.delayStart();

      var promises = [];
      for (var i = 0, len = wallaby.tests.length; i < len; i++) {
        promises.push(System['import'](wallaby.tests[i].replace(/\.js$/, '')));
      }

      Promise.all(promises).then(function () {
        wallaby.start();
      }).catch(function (e) { setTimeout(function (){ throw e; }, 0); });
    }
  };
};
