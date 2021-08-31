import { IMemoSession } from '../interfaces';

export class MemoSession {
  private _session: IMemoSession = { firstVisit: false };

  public get firstVisit() {
    return this._session.firstVisit;
  }

  public get eventInstall() {
    return this._session.eventInstall;
  }

  public setSession(data: Partial<IMemoSession>) {
    this._session = { ...this._session, ...data };
  }

}
