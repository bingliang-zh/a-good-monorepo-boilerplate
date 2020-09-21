module.exports = {
  rules: {
    // Component should be pure react without any state manager.
    // Large libraries such as lodash is not recommended.
    // If it is necessary, tsdx made a tutorial on its [homepage](https://github.com/formium/tsdx#using-lodash), follow the guide.
    'no-restricted-imports': [
      'error',
      {
        paths: ['redux', 'mobx', 'lodash'],
        patterns: ['lodash*'],
      },
    ],
  },
};
