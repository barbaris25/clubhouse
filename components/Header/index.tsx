import clsx from "clsx";
import Link from "next/link";
import React from "react";
import { Avatar } from "../Avatar";

import styles from "./Header.module.scss";

export const Header: React.FC = () => {
  return (
    <div className={styles.header}>
      <div className="container d-flex align-items-center justify-content-between">
        <Link href="/rooms">
          <div
            className={clsx(styles.headerLogo, "d-flex align-items-center cup")}
          >
            <img src="/static/hand-wave.png" alt="Logo" className="mr-5" />
            <h4>Clubhouse</h4>
          </div>
        </Link>
        <Link href="/profile/1">
          <div className="d-flex align-items-center cup">
            <Avatar
              src="https://storage.live.com/mydata/myprofile/expressionprofile/profilephoto:UserTileStatic,UserTileSmall/MeControlMediumUserTile?ck=1&ex=24&fofoff=1&sc=1631047318751"
              width="50px"
              height="50px"
            />
            <b className="mr-5 ml-10">Tsyhanenko Dmytro</b>
          </div>
        </Link>
      </div>
    </div>
  );
};
