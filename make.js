#!/usr/bin/env node

var PUBLIC_DIR = 'public',
    BUTTER_DIR = PUBLIC_DIR + '/butter',
    EXTERNAL_DIR = 'external',
    EXTERNAL_BUTTER_DIR = EXTERNAL_DIR + '/butter',
    EXTERNAL_CORNFIELD_DIR = EXTERNAL_BUTTER_DIR + '/cornfield';

require('shelljs/make');

target.all = function() {
  target.submodules();
  target.build();
};

target.server = function() {
  target.submodules();
  echo('### Starting cornfield server');
  mkdir('-p', PUBLIC_DIR);
  exec('node ' + EXTERNAL_CORNFIELD_DIR + '/app.js');
};

target.keener = function() {
  echo('### Fetching and updating latest submodules')
  exec('cd ' + EXTERNAL_BUTTER_DIR + ' && git pull git://github.com/mozilla/butter.git master && git submodule update --init --recursive');
};

target.submodules = function() {
  echo('### Updating git submodules');
  mkdir('-p', EXTERNAL_DIR);
  exec('git submodule update --init --recursive');
};

target.build = function() {
  echo('### Building environment');
  mkdir('-p', PUBLIC_DIR);
  exec('cd ' + EXTERNAL_BUTTER_DIR + ' && npm install');
  exec('cd ' + EXTERNAL_BUTTER_DIR + ' && node make package');
  mkdir('-p', BUTTER_DIR);
  echo('### Copying files')
  cp('-r', EXTERNAL_BUTTER_DIR + '/dist/*', BUTTER_DIR + '/');
};

target.clean = function() {
  echo('### Cleaning environment');
  rm('-fr', BUTTER_DIR);
};
