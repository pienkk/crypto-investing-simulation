import { JwtAuthGuard } from './auth.guard';

// JWT 토큰이 필수가 아닐 때
export class OptionalJwtAuthGuard extends JwtAuthGuard {
  handleRequest(err, user, info, context) {
    return user;
  }
}
