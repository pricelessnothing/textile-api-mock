import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { JrpcRequestDto } from 'src/types/jrpc.type';
import { LoginParams } from 'src/types/user.type';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('jrpc')
  async jrpc(
    @Body() { method, params }: JrpcRequestDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<any> {
    const cookie: string = req.cookies['session_id'];
    switch (method) {
      case 'login':
        try {
          const userData = this.appService.login(params as LoginParams);
          res
            .status(200)
            .header('set-cookie', this.setSessionCookie(userData.sessionId))
            .send(this.wrapJrpc(userData));
        } catch {
          res
            .header('set-cookie', this.setSessionCookie('123', true))
            .sendStatus(401);
        }
        return;

      case 'get_state':
        try {
          const state = this.appService.getState(cookie);
          res
            .status(200)
            .header('set-cookie', this.setSessionCookie(cookie))
            .send(this.wrapJrpc(state));
        } catch {
          res.status(401).send({
            error: 'Unauthorized',
          });
        }
        return;

      case 'logout':
        this.appService.logout(cookie);
        res
          .status(200)
          .header('set-cookie', this.setSessionCookie(cookie, true))
          .send();
        return;
      default:
        res.status(404).send({
          error: 'Method not found',
        });
    }
  }

  private setSessionCookie(id: string, finish = false): string {
    return `session_id=${id};Max-Age=${
      finish ? 0 : 900
    };Path=/;HttpOnly;Version=1`;
  }

  private wrapJrpc(data: any) {
    return {
      id: 0,
      jsonrpc: '2.0',
      result: data,
    };
  }
}
