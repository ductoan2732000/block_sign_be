import { FirebaseConfig } from '@/model/interface/base.interface';
import { Injectable } from '@nestjs/common';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Database, getDatabase } from 'firebase/database';
@Injectable()
export class BaseService {
  firebaseConfig: FirebaseConfig;
  app: FirebaseApp;
  db: Database;
  constructor() {
    this.initiateConnection();
  }
  async initiateConnection() {
    this.firebaseConfig = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.DATABASE_URL,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID,
    };
    this.initiateDatabase();
  }
  async initiateDatabase() {
    this.app = await initializeApp(this.firebaseConfig);
    this.db = await getDatabase();
  }
}
