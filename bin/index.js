#!/usr/bin/env node

const path = require('path');
const { createIndexHtml } = require('../utils/createIndexHtml');
const { copyViteConfig } = require('../utils/copyViteConfig');
const { installPackage } = require('../utils/installPackages');
const { addStartScript } = require('../utils/addStartScript');
const { inquirer, questions, defaultConfig } = require('../utils/getUserConfig');


async function run() {
    const answers = await inquirer.prompt(questions)
    const config = {}
    if(answers.indexHtmlIsDefault) {
        config.indexDist = defaultConfig.indexDist
    }else {
        config.indexDist = answers.indexHtmlIsDefaultDest
    }
    if(answers.mainJsIsDefault) {
        config.entry = defaultConfig.entry
    }else {
        config.entry = answers.mainJsIsDefaultDest
    }
    createIndexHtml(config)
    copyViteConfig()
    addStartScript()
    installPackage()
}

run();