const colors = require('chalk');

const styles = {
  error: colors.bgRed.white.bold,
  log: colors.grey,
};

module.exports = {
  colors,
  styles,

  log(msg) {
    console.log(styles.log(msg));
  },

  error(msg) {
    console.log(styles.error(msg));
  },
};
