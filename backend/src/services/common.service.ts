import { Injectable } from "@nestjs/common";
import * as moment from "moment";
import { Moment } from "moment";

@Injectable()
export class CommonService {
  public dateParser(str: string | number): Moment {
    return moment(str, "YYYYMMDDHHmmss");
  }
}
