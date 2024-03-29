#!/usr/bin/env node

const path = require('path');
const { createIndexHtml } = require('../utils/createIndexHtml');
const { copyViteConfig } = require('../utils/copyViteConfig');
const { copyViteUtils } = require('../utils/copyViteUtils');
const { installPackage } = require('../utils/installPackages');
const { addStartScript } = require('../utils/addStartScript');

function run() {
    createIndexHtml()
    copyViteConfig()
    copyViteUtils()
    addStartScript()
    installPackage()
}

run();