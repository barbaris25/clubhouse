import passport from 'passport';
import { Strategy as GithubStrategy, StrategyOption } from 'passport-github';
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from 'passport-jwt';
import { createJwtToken } from '../utils/createJWTtoken';
import { users } from '../../models';
import { UserData } from '../../pages';

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  'jwt',
  new JwtStrategy(opts, (jwt_payload, done) => {
    console.log(jwt_payload);
    done(null, jwt_payload);
  })
);

passport.use(
  'github',
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:3001/auth/github/callback',
    },
    async (_: unknown, __: unknown, profile, done) => {
      try {
        let userData: UserData;

        const obj: Omit<UserData, 'id'> = {
          fullName: profile.displayName,
          avatarUrl: profile.photos?.[0].value,
          isActive: false,
          userName: profile.username,
          phone: '',
        };

        const findUser = await users.findOne({
          where: {
            userName: obj.userName,
          },
        });

        if (!findUser) {
          const user = await users.create(obj);
          userData = user.toJSON();
        } else {
          userData = await findUser.toJSON();
        }

        done(null, {
          ...userData,
          token: createJwtToken(userData),
        });
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  users.findById(id, (err, user) => {
    err ? done(err) : done(null, user);
  });
});

export { passport };
