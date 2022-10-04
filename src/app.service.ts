import { Injectable } from '@nestjs/common';
import { LoginParams, User, UserPublicData } from 'src/types/user.type';
import { v4 as uuid } from 'uuid';

const USERS: User[] = [
  {
    username: 'operator',
    fullname: '',
    rights: 'operator',
    password: '1a1dc91c907325c69271ddf0c944bc72',
  },
  {
    username: 'root',
    fullname: '',
    rights: 'root',
    password: '1a1dc91c907325c69271ddf0c944bc72',
  },
];

@Injectable()
export class AppService {
  sessions: Record<string, NodeJS.Timeout> = {};

  login({ username, password }: LoginParams): UserPublicData {
    const user = USERS.find(
      (u) => u.username === username && u.password === password,
    );

    if (!user) {
      throw new Error();
    }

    return {
      username: user.username,
      fullname: user.fullname,
      rights: user.rights,
      sessionId: this.startOrRenewSession(),
    };
  }

  getState(currentSession: string): string {
    if (this.checkSession(currentSession)) {
      return 'honestly i am state';
    }
    throw 'Unauthorized';
  }

  logout(sessionId: string) {
    if (this.sessions[sessionId]) {
      clearTimeout(this.sessions[sessionId]);
    }
  }

  private checkSession(sessionId: string): boolean {
    if (this.sessions[sessionId]) {
      clearTimeout(this.sessions.sessionId);
      this.startOrRenewSession(sessionId);
      return true;
    } else {
      return false;
    }
  }

  private startOrRenewSession(sessionId: string = uuid()): string {
    this.sessions[sessionId] = setTimeout(() => {
      clearTimeout(this.sessions[sessionId]);
    }, 15_000);
    return sessionId;
  }
}
