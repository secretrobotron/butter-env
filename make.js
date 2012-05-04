#!/usr/bin/env node

var BUTTER_DIR = 'butter',
    EXTERNAL_DIR = 'external',
    EXTERNAL_BUTTER_DIR = EXTERNAL_DIR + '/butter',
    EXTERNAL_CORNFIELD_DIR = EXTERNAL_BUTTER_DIR + '/cornfield'
    PACKAGE_NAME = 'butter';

require('shelljs/make');

target.all = function() {
  target.submodules();
  target.build();
};

target.server = function() {
  target.submodules();
  echo('### Starting cornfield server...');
  exec('node ' + EXTERNAL_CORNFIELD_DIR + '/app.js');
};

target.keener = function() {
  exec('cd ' + EXTERNAL_BUTTER_DIR + ' && git pull git://github.com/mozilla/butter.git master');
  target.submodules();
};

target.submodules = function() {
  echo('### Updating git submodules');
  mkdir('-p', EXTERNAL_DIR);
  exec('git submodule update --init --recursive');
};

target.build = function() {
  echo('### Building environment');
  exec('cd ' + EXTERNAL_BUTTER_DIR + ' && npm install');
  exec('cd ' + EXTERNAL_BUTTER_DIR + ' && node make package');
  mkdir('-p', BUTTER_DIR);
  cp('-r', EXTERNAL_BUTTER_DIR + '/dist/*', BUTTER_DIR + '/');
};

target.clean = function() {
  echo('### Cleaning environment');
  rm('-fr', BUTTER_DIR);
};
