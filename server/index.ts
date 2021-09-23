import express from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import cors from 'cors';
import sharp from 'sharp';
import fs from 'fs';
import { nanoid } from 'nanoid';
import { code } from '../models';

declare global {
  namespace Express {
    interface User extends UserData {
      email: string;
    }
  }
}

dotenv.config({
  path: 'server/.env',
});

import './core/db';
import { passport } from './core/passport';
import { UserData } from '../pages';
import { Axios } from '../core/axios';

const app = express();

const uploader = multer({
  storage: multer.diskStorage({
    destination: function (_, __, cb) {
      cb(null, 'public/avatars/');
    },
    filename: function (_, file, cb) {
      cb(
        null,
        file.fieldname + '-' + nanoid(6) + '.' + file.mimetype.split('/').pop()
      );
    },
  }),
});

const randomCode = (max: number = 9999, min: number = 1000) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

app.use(express.json());
app.use(cors());
app.use(passport.initialize());

app.post('/upload', uploader.single('photo'), (req, res) => {
  const filePath = req.file.path;
  sharp(filePath)
    .resize(150, 150)
    .toFormat('jpeg')
    .toFile(filePath.replace('.png', '.jpeg'), (err) => {
      if (err) {
        throw err;
      }

      fs.unlinkSync(filePath);

      res.json({
        url: `/avatars/${req.file.filename}`,
      });
    });
});

app.post(
  '/auth/sms',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const phone = req.body.phone;
    const userID = req.user.id;
    const smsCode = randomCode();

    if (!phone) {
      return res.status(400).send();
    }

    try {
      // await Axios.get(
      //   `https://sms.ru/sms/send?api_id=${process.env.SMS_API_KEY}&to=${phone}&msg=${smsCode}`
      // );

      await code.create({
        code: smsCode,
        user_id: userID,
      });
    } catch (e) {
      res.status(500).json({
        message: 'Ошибка при отправке SMS кода',
      });
    }
  }
);

app.get('/auth/github', passport.authenticate('github'));

app.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    res.send(
      `<script>window.opener.postMessage('${JSON.stringify(
        req.user
      )}', '*');window.close();</script>`
    );
  }
);

app.listen(3001, () => {
  console.log('SERVER RUNNED!');
});
