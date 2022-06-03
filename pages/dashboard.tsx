import axios from "axios";
import Cookies from "js-cookie";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import React from "react";
import { Root, MediaStream } from "../types";
import { useRouter } from "next/router";
import { url } from "inspector";

export default function DashboardPage({
  pageComponentProps,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [data, setData] = React.useState<Root[] | null>();
  const router = useRouter();

  React.useEffect(() => {
    const apiKey = Cookies.get("API_KEY");
    const url = Cookies.get("URL");

    if (!apiKey) {
      router.push("/");
    }
    if (!url) {
      router.push("/");
    }

    // call a function evry 5 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 5000);
  }, [router]);

  function fetchData() {
    const url = Cookies.get("URL");
    const apiKey = Cookies.get("API_KEY");

    const urlToFetch = `${url}/Sessions`;
    axios
      .get(urlToFetch, {
        params: {
          api_key: apiKey,
        },
      })
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="bg-gray-900 h-screen text-white">
      <div className="flex items-center justify-end p-4 h-20 bg-purple-900">
        <button
          onClick={() => {
            Cookies.remove("API_KEY");
            Cookies.remove("URL");
            router.push("/");
          }}
          className="bg-blue-500 p-4 font-semibold rounded"
        >
          Logout
        </button>
      </div>
      <div className="grid gap-4 grid-cols-3 grid-rows-3 p-4">
        {data?.map((element, index) => {
          // Programming logic
          if (!element.NowPlayingItem) {
            return null;
          }
          const userId = element.UserId;
          const url = Cookies.get("URL")
          const itemId= element.NowPlayingItem.Type === "Movie" ? element.NowPlayingItem.Id : element.NowPlayingItem.SeriesId;
          const avatar = element.UserPrimaryImageTag ? `${url}/Users/${userId}/Images/Primary/?tag=${element.UserPrimaryImageTag}&quality=90` : "/user-icon-192x192.png";
          const stream = element.TranscodingInfo ? "Transcode" : "Direct Play"
          const audio = element.TranscodingInfo ? `${stream} (${element.NowPlayingItem.MediaStreams[1].Codec} -> ${element.TranscodingInfo.AudioCodec})` : `${stream} (${element.NowPlayingItem.MediaStreams[1].Codec})`
          const video = element.TranscodingInfo ? `${stream} (${element.NowPlayingItem.MediaStreams[0].Codec} -> ${element.TranscodingInfo.VideoCodec})` : `${stream} (${element.NowPlayingItem.MediaStreams[0].Codec})`
          const progress = element.PlayState.PositionTicks ? element.PlayState.PositionTicks / element.NowPlayingItem.RunTimeTicks * 100 : 0
          const playState = element.PlayState.IsPaused ? "Paused" : "Playing"

          // UI logic
          const moviePosterClass = "h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
          const movieBackdropStyle = {
            backgroundImage: `url(${url}/Items/${itemId}/Images/Backdrop/0?tag=${itemId})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backdropFilter: "blur(10px)",
          }
          const moviePosterStyle = {
            backgroundImage: `url(${url}/Items/${itemId}/Images/Primary?tag=${itemId})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }
          const moviePosterTitle = element.NowPlayingItem.Name
          const test = {
            width: `${progress}%`,
          }

          // HTML + parsing data
          return (
            <button
              key={index}
              onClick={() => {
                router.push(`user/${element.UserId}`);
              }}
            >
              <div className="relative max-w-sm w-full lg:max-w-full lg:flex backdrop-blur-xl bg-white">
                <div className={moviePosterClass} style={moviePosterStyle} title={moviePosterTitle}></div>
                <div className="border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
                  <div className="mb-8">
                    <ul className="list-none text-black text-right">
                      <li>PRODUCT {element.Client}</li>
                      <li>PLAYER {element.DeviceName}</li>
                      <li>CLIENT {element.ApplicationVersion}</li>
                      <li>QUALITY {element.NowPlayingItem.Width}x{element.NowPlayingItem.Height}</li>
                      <br />
                      <li>STREAM {stream}</li>
                      <li>AUDIO {audio}</li>
                      <li>VIDEO {video}</li>
                      <br />
                      <li>LOCATION {element.RemoteEndPoint}</li>

                    </ul>
                  </div>
                  <div className="flex items-center">
                    <img className="w-10 h-10 rounded-full mr-4" src={avatar}/>
                    <div className="text-sm">
                      <p className="text-gray-900 leading-none">{element.UserName}</p>
                    </div>
                  </div>
                </div>
                {/* Display div on bottom on parent div */}
                <div className="absolute bottom-0 left-0 min-w-full">
                  <div className="flex justify-between mb-1">
                    <span className="text-base font-medium text-blue-700 dark:text-white">{playState}</span>
                    <span className="text-sm font-medium text-blue-700 text-black">{Math.floor(progress)} %</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2.5 dark:bg-gray-700">
                    <div className="bg-blue-600 h-2.5" style={test}></div>
                  </div>
                </div>
              </div>

              {/*<div className="bg-gray-600 text-gray-200 p-4">
                <div>
                  <img src={`${url}/Users/${userId}/Images/Primary`}></img>
                  <p>User: {element.UserName}</p>
                  <p>Client: {element.Client}</p>
                  <p>Version: {element.ApplicationVersion}</p>
                  <p>Stream: {element.PlayState.PlayMethod}</p>
                  <p>Container: {element.NowPlayingItem.Container}</p>
                  <p>Location: {element.RemoteEndPoint}</p>
                  <img src={`${url}/Items/${itemId}/Images/Backdrop/0?tag=${itemId}`}></img>
                 </div>
              </div>*/}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const pageComponentProps = {};
  return {
    props: {
      pageComponentProps,
    },
  };
}
