exports.config = { tests: './*_test.js',
  timeout: 10000,
  output: './output',
  helpers:
   { Protractor:
      { url: 'http://localhost:8712/',
        driver: 'hosted',
        browser: 'chrome',
        rootElement: 'body' } },
  include: { I: './steps_file.js' },
  bootstrap: false,
  mocha: {},
  name: 'todoangular'
}