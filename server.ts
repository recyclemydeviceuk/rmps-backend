import app from './src/app';
import { connectDatabase } from './src/config/database';
import { env } from './src/config/env';
import { logger } from './src/utils/logger';

const PORT = env.PORT || 5000;

async function bootstrap() {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
      logger.info(`   Environment : ${env.NODE_ENV}`);
      logger.info(`   Frontend    : ${env.FRONTEND_URL}`);
      logger.info(`   Admin Panel : ${env.ADMIN_URL}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
