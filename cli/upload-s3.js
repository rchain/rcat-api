#!/usr/bin/env node

const fs = require('fs');

var argv = require('yargs')
    .usage('Usage: $0 <command> [options]')
    .command('upload', 'Upload a file to S3')
    .example('$0 upload -f foo.wav -r eu-west-1 -b some_bucket_name', '')
    .alias('f', 'file')
    .alias('b', 'bucket')
    .alias('r', 'region')
    .nargs('f', 1)
    .nargs('b', 1)
    .nargs('r', 1)
    .describe('f', 'File to be uploaded')
    .describe('b', 'S3 bucket name')
    .describe('r', 'AWS Region')
    .demandOption(['f', 'b', 'r'])
    .help('h')
    .alias('h', 'help')
    .epilog('Hope this helpes :)')
    .argv;


const filePath = argv.file;

if (!fs.existsSync(filePath)) {
    throw `File ${filePath} not found :(`;
}