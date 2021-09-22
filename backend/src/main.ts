import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import * as session from "express-session";
import { AppModule } from "./app.module";
import * as admin from "firebase-admin";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, "..", "public"));
  app.setBaseViewsDir(join(__dirname, "..", "views"));
  app.setViewEngine("hbs");
  app.use(
    session({
      secret: '409c0c4nq$#%$^W%#TVY$',
      resave: false,
      saveUninitialized: true
    })
  );
  const options = new DocumentBuilder()
      .setTitle('LMS-WATCHER')
      .setDescription('NOTICE: Use with session ready.')
      .setVersion('1.0.0')
      .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
  const port = process.env["PORT"] || 3000;
  await app.listen(port);
}

(async () => {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "lms-watcher",
      privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCY31tPj93rxzh8\nBEU0T1ztRATD1dzuCu4A3v1tY0rk7jvDe4TYlATvbIP1QwvCQCADTDlEHPlJ7j1n\n8aG5WDRPs0Ufd16DYZwRCsLEP34BjKRS65vukT+s5OJ09N/feshFHkcUiM0y59kG\nx1AoB6h0hCD6xsCOgL2MA1hbb911HEAsIz3iGHufRIgKBpAeTLw4OtLJAh44Wz8x\nrm27+0ybNkXeK4JEIbt7jmyPVYbJHRnHwg/qNJaa+c1/IhadUZDal8Uc4tVmhbxB\nOUjquC3MrsYDZudUjta78KS6zFxv1d3XwaMrlmL8wStXxQX2AUZHQHjN7EIJVtm4\nFdxmqsT1AgMBAAECggEAEygvnyFzjpphNQQBUB7UkanBFxwecCN6foLIgK69XJbm\nHQcbjLBv4I5ZXaDQlmpxbeMIF3BculZakkNbdYiHdagMyiFWp2F8rJNhTjUkAI8J\nVe156u7UwJZ7h8CFVXy4ysCSk7uDoL92bj0H3xxROy4GRqbQITYiNVYt+mINqcvL\naEMOLtroZMPGOE52k3gjjY9DMSndvCaHSRhFNwP+h44sajjS6R69thO7dQ9ok6JA\neEJ5VCoD71iGXGj+yGd47edRwEiSku6nKUwkr+KUNJ/rnnGM8i9WXp00xOOcXlhQ\nAL99B//yh8G/vpS/+FXGldNftRHu5uMLgZYbOEiauQKBgQDXoBMLkz6cF08YoAYg\naPSwC+wimAsJ2lmZMH0IMXEmvsfelJ+8VDUe5raBPjni6hk3oZ6ogJiBXy57H5WG\nsz7SJ+xPEqgq4O9QL7ugjgKgWcRW1QnTPxtyAA/62hpuhXa+u0Ne9zB46pG5Sj22\nuaqRkDj/kjc39OxTsPPCSbIXXwKBgQC1fz9wPOdneB5SdrgXXu93iWFjbyEiBQ5S\nVOmMIf6o62RzSUywSQXa9gLzQE+P6ObeuZdKhyjpfSgYzUAyW0zpIZcrPbbTecQ9\nuntp73dPlpJmFqhdrV8Cy4SflpQXIBxM0ShSzw+ISQnJCAw6UStJZNzd0dxGTEwx\nI5LVhiYoKwKBgDq/onDE7YoZz7Ml5oVuEzzkArJqOpe0pjTWwTo6PloQIOTEGcF2\nMAL7WT5ddegdYEGIB3Jhlyuog0GImXTZ4YPg3MGuk6MbJhjy6GwWRSDrVFNUOBkW\nWKP24GO4iPsT4gaVfwWg09QeFRYm5Cmk7JQ8d0sqy2CzmrAyxjdpXNyBAoGBAKkh\nBe3CY2UREziHNu9YYVCELcOqGDcKfRkN1YDnYNbqW/XulU8lDRbI72DcSgfx4col\nKi2iG+bQ4V+TTMJgQCBzU9pQrSEONGfNchn6s7TvvEbz0DtTRtlk65aHjEKsgpK2\nyZu5JmE6pqq2HCbv4qWHHyZ53ImJqeqUmsztMHt3AoGAR3BMss2WufzZ8AaTWQDi\n2Ym5lGE4/E+Szqi/XbUKhkm1ng/KsnIk5ojzcfl4oz8fGx1Ztldbevijz3Rxu2eq\nTtjQOj7alErjGyR5aKcRxgQbtK/6fzDqrqtPU9Z53Mf9OEZ0W96aeCLyX7pufeme\nfW5T0wAnel/ta+5q9kkJ4HE=\n-----END PRIVATE KEY-----",
      clientEmail: "firebase-adminsdk-5gzwk@lms-watcher.iam.gserviceaccount.com"
    }),
    databaseURL: "https://lms-watcher-default-rtdb.asia-southeast1.firebasedatabase.app"
  });
  console.log(`bootstrap loaded: SDK v${admin.SDK_VERSION}`);
  await bootstrap();
})();
