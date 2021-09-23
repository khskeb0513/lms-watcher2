import { Injectable } from "@nestjs/common";
import * as admin from "firebase-admin";

@Injectable()
export class DatabaseService {
  public async setContent(
    kjKey: string,
    item: string,
    cid: string,
    contentId: string
  ) {
    const db = admin.database();
    const request = await db.ref(`content/${kjKey}/${item}`);
    request.child("/cid").set(cid);
    request.child("/contentId").set(contentId);
  }

  public async getHisByUsernameItem(username: string, item: string) {
    const db = admin.database();
    const response = await db.ref(`/hisCode/${username}/${item}`).get();
    return response.val();
  }

  public async setHis(hisCode: number, username: string, item: string) {
    if (hisCode && username && item) {
      const timestamp = new Date().valueOf();
      const db = admin.database();
      const request = await db.ref(`/hisCode/${username}/${item}`);
      request.child("/hisCode").set(hisCode);
      request.child("/timestamp").set(timestamp);
      return {
        hisCode,
        timestamp
      };
    }
  }
}
