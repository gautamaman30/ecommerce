import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {configObj} from './common/configEnv';
import {TransformInterceptor} from './common/interceptors';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalInterceptors(new TransformInterceptor());
    
    await app.listen(configObj.PORT, () => console.log(`Server is running at localhost port: ${configObj.PORT}`));
}
bootstrap();
