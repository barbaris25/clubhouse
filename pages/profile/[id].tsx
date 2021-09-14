import React from "react";
import { useRouter } from "next/router";
import { Header } from "../../clubhouse-source/components/Header";
import { Profile } from "../../components/Profile";

const ProfilePage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <Header />

      <div className="container mt-40">
        <Profile
          avatarUrl="https://storage.live.com/mydata/myprofile/expressionprofile/profilephoto:UserTileStatic,UserTileSmall/MeControlMediumUserTile?ck=1&ex=24&fofoff=1&sc=1631047318751"
          username="babariska2502"
          fullname="Dmytro Tsyhanenko"
          about="Hello Kitty, I am React / NextJS frontend developer"
        />
      </div>
    </>
  );
};

export default ProfilePage;
