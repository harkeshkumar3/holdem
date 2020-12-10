const winston = require('winston');
 
const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  ],
});

logger.stream = {
  write: function(message, encoding){
      logger.info(message);
  }
}

module.exports = logger;
