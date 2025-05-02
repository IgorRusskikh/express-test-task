import logger from 'jet-logger';
import server from './server';

const SERVER_START_MSG =
  'Express server started on port: ' + (process.env.PORT || 3000).toString();

server.listen(process.env.PORT || 3000, () => logger.info(SERVER_START_MSG));
