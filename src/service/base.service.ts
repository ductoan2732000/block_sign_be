import { FirebaseConfig } from '@/model/interface/base.interface';
import { Injectable } from '@nestjs/common';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Database, getDatabase } from 'firebase/database';
import { FirebaseStorage, getStorage } from 'firebase/storage';
@Injectable()
export class BaseService {
  firebaseConfig: FirebaseConfig;
  app: FirebaseApp;
  db: Database;
  store: FirebaseStorage;
  constructor() {
    this.initiateConnection();
  }
  initiateConnection() {
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
  initiateDatabase() {
    this.app = initializeApp(this.firebaseConfig);
    this.db = getDatabase();
    this.store = getStorage();
  }
}
