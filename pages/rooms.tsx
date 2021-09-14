import Link from "next/link";
import React from "react";
import { Button } from "../clubhouse-source/components/Button";
import { ConversationCard } from "../clubhouse-source/components/ConversationCard";
import { Header } from "../components/Header";
import Axios from "../core/axios";

const Rooms = ({ rooms = [] }) => {
  return (
    <>
      <Header />

      <div className="container ">
        <div className="mt-40 d-flex justify-content-between align-items-center">
          <h1>All conversations</h1>
          <Button color="green">+ Start room</Button>
        </div>

        <div className="grid mt-30">
          {rooms.map((obj) => (
            <Link href={`/room/${obj.id}`} key={obj.id}>
              <a className="d-flex">
                <ConversationCard
                  title={obj.title}
                  avatars={obj.avatars}
                  guests={obj.guests}
                  guestsCount={obj.guestsCount}
                  speakersCount={obj.speakersCount}
                />
              </a>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Rooms;

export const getServerSideProps = async () => {
  try {
    const { data } = await Axios.get("/rooms.json");
    return {
      props: {
        rooms: data,
      },
    };
  } catch (e) {
    console.log("Error fetch rooms data");
    return {
      props: {
        rooms: [],
      },
    };
  }
};
