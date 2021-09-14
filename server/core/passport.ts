import passport from 'passport';
import { Strategy as GithubStrategy } from 'passport-github';
import { users } from '../../models';

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
        const userData = {
          fullName: profile.displayName,
          avatarUrl: profile.photos?.[0].value,
          isActive: 0,
          userName: profile.username,
          phone: '',
        };

        const findUser = await users.findOne({
          where: {
            userName: userData.userName,
          },
        });

        if (!findUser) {
          const user = await users.create(userData);
          return done(null, user.toJSON());
        }

        return done(null, findUser);
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
