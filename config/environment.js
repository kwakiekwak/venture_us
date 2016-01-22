var _ = require('lodash');

var localEnvVars = {
  TITLE:      'venture_us',
  SAFE_TITLE: 'venture_us'
};

// Merge all environmental variables into one object.
module.exports = _.extend(process.env, localEnvVars);
