import passport from "koa-passport";
import { BasicStrategy } from "passport-http";
import { RouterContext } from "koa-router";
import bcrypt from "bcrypt";
import * as users from '../models/users';

// Compare password using bcrypt (passwords are stored as hashes)
/**
 * Compare a plaintext password with a stored bcrypt hash.
 */
const verifyPassword = async (user: any, password: string) => {
  return await bcrypt.compare(password, user.password);
}

// Define the Basic Auth strategy using passport
passport.use(new BasicStrategy(async (username, password, done) => {
  let result: any[] = [];
  try {
    result = await users.getByUsernameWithPassword(username) as any[];
  } catch (error) {
    console.error(`Error during authentication for user ${username}: ${error}`);
    done(null, false);
    return;
  }
  if (result.length) {
    const user = result[0];
    if (await verifyPassword(user, password)) {
      done(null, { user: user }); // ✅ credentials valid
    } else {
      console.log(`Password incorrect for ${username}`);
      done(null, false);          // ❌ wrong password
    }
  } else {
    done(null, false);            // ❌ user not found
  }
}));

// Export middleware that protects a route using Basic Auth
/**
 * Authenticate the current request using HTTP Basic credentials.
 */
export const basicAuth = async (ctx: RouterContext, next: any) => {
  await passport.authenticate("basic", { session: false })(ctx, next);
  if (ctx.status == 401) {
    ctx.body = { message: 'you are not authorized' };
  } else {
    ctx.body = { message: 'you are passed' };
  }
}
