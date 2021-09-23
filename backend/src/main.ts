import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import * as session from "express-session";
import { AppModule } from "./app.module";
import * as admin from "firebase-admin";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as path from "path";

const makeSessionSecret = () => {
  const getRandomInt = () => {
    const min = Math.ceil(32);
    const max = Math.floor(127);
    return Math.floor(Math.random() * (max - min)) + min;
  };
  let str = String();
  for (let i = 0; i < 31; i++) {
    str += String.fromCharCode(getRandomInt());
  }
  return str;
};

async function bootstrap() {
  const firebaseSdkName = admin.initializeApp({
    credential: admin.credential.cert(
      path.join(__dirname, "..", "serviceAccountKey.json")
    ),
    databaseURL:
      "https://lms-watcher-default-rtdb.asia-southeast1.firebasedatabase.app"
  }).name;
  console.log(`Firebase sdk: ${firebaseSdkName}`);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, "..", "public"));
  app.setBaseViewsDir(join(__dirname, "..", "views"));
  app.setViewEngine("hbs");
  app.use(
    session({
      secret: makeSessionSecret(),
      resave: false,
      saveUninitialized: true
    })
  );
  const options = new DocumentBuilder()
    .setTitle("LMS-WATCHER")
    .setDescription("NOTICE: Use with session ready.")
    .setVersion("1.0.0")
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api-docs", app, document);
  const port = process.env["PORT"] || 3000;
  await app.listen(port);
}

bootstrap();
