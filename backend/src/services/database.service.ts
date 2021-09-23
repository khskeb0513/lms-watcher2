import { Injectable } from "@nestjs/common";
import * as admin from "firebase-admin";
import { database } from "firebase-admin";
import Database = database.Database;

@Injectable()
export class DatabaseService {
  constructor() {
    this.db = admin.database();
  }
  private db: Database;
  public async setContent(
    kjKey: string,
    item: string,
    cid: string,
    contentId: string
  ) {
    const request = await this.db.ref(`content/${kjKey}/${item}`);
    request.child("/cid").set(cid);
    request.child("/contentId").set(contentId);
  }

  public async getHisByUsernameItem(username: string, item: string) {
    const response = await this.db.ref(`/hisCode/${username}/${item}`).get();
    return response.val();
  }

  public async setHis(hisCode: number, username: string, item: string) {
    if (hisCode && username && item) {
      const timestamp = new Date().valueOf();
      const request = await this.db.ref(`/hisCode/${username}/${item}`);
      request.child("/hisCode").set(hisCode);
      request.child("/timestamp").set(timestamp);
      return {
        hisCode,
        timestamp
      };
    }
  }
}
