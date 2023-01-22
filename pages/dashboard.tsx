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
    const [url, apiKey] = [Cookies.get("URL"), Cookies.get("API_KEY")];

    if (!apiKey || !url) {
      router.push("/");
    }

    // call a function evry 5 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 5000);
  }, [router]);

  function fetchData() {
    const [url, apiKey] = [Cookies.get("URL"), Cookies.get("API_KEY")];

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
    <div className="bg-neutral-900 h-screen text-white">
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
      <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3 p-4">
        { data?.map((element, index) => {
        // Programming logic
        if (!element.NowPlayingItem) {
            return null;
        }
        const userId = element.UserId;
        const url = Cookies.get("URL")
        const itemId = element.NowPlayingItem.Type === "Episode" ? element.NowPlayingItem.SeriesId : element.NowPlayingItem.Id;
        const isTvChannel = element.NowPlayingItem.Type === "TvChannel" ? true : false;
        const avatar = element.UserPrimaryImageTag ? `${url}/Users/${userId}/Images/Primary/?tag=${element.UserPrimaryImageTag}&quality=90` : "/avatar.png";
        const stream = element.TranscodingInfo ? "Transcode" : "Direct Play"
        const audio = element.TranscodingInfo ? `${stream} (${(element.NowPlayingItem.MediaStreams.find(s => s.Type === "Audio"))?.Codec} -> ${element.TranscodingInfo.AudioCodec})` : `${stream} (${(element.NowPlayingItem.MediaStreams.find(s => s.Type === "Audio"))?.Codec})`
        const video = element.TranscodingInfo ? `${stream} (${(element.NowPlayingItem.MediaStreams.find(s => s.Type === "Video"))?.Codec} -> ${element.TranscodingInfo.VideoCodec})` : `${stream} (${(element.NowPlayingItem.MediaStreams.find(s => s.Type === "Video"))?.Codec})`
        const playbackProgress = element.PlayState.PositionTicks && !isTvChannel ? element.PlayState.PositionTicks / element.NowPlayingItem.RunTimeTicks * 100 : 0
        const transcodingProgress = element.TranscodingInfo ? Math.floor(element.TranscodingInfo.CompletionPercentage) : -1
        const playState = element.PlayState.IsPaused ? "Paused" : "Playing"
        const bitrate_full = element.TranscodingInfo ? element.TranscodingInfo.Bitrate : (element.NowPlayingItem.MediaStreams.find(s => s.Type === "Video"))?.BitRate

        let deviceImage = null
        let deviceColour = null

        // Jellyfin Web
        if (element.Client == "Jellyfin Web") {
            // Chrome
            if (element.DeviceName?.includes("Chrome")) {
                deviceImage = `/devices/chrome.svg`
                deviceColour = "bg-gradient-to-br from-[#DD5144] to-[#991e13]"
            }
            // Edge
            else if (element.DeviceName?.includes("Edge")) {
                deviceImage = `/devices/edgechromium.svg`
                deviceColour = "bg-gradient-to-br from-[#36c752] to-[#0882D8]"
            }
            // Firefox
            else if (element.DeviceName?.includes("Firefox")) {
                deviceImage = `/devices/firefox.svg`
                deviceColour = "bg-gradient-to-br from-[#FF7F0C] to-[#D90B57]"
            }
            // Internet Explorer
            else if (element.DeviceName?.includes("Internet Explorer")) {
                deviceImage = `/devices/opera.svg`
                deviceColour = "bg-gradient-to-br from-[#D0E0E3] to-[#2C68DC]"
            }
            // Opera
            else if (element.DeviceName?.includes("Opera")) {
                deviceImage = `/devices/opera.svg`
                deviceColour = "bg-gradient-to-br from-[#FF1B2D] to-[#A70014]"
            }
            // Safari
            else if (element.DeviceName?.includes("Safari")) {
                deviceImage = `/devices/safari.svg`
                deviceColour = "bg-gradient-to-br from-[#19D1FF] to-[#1853B2]"
            }
            // Fallback
            else {
                deviceImage = "/devices/html5.svg"
                deviceColour = "bg-gradient-to-br from-[#C22620] to-[#E6A8A5]"
            }
        }
        // Android
        else if (element.Client.includes("Android")) {
            deviceImage = `/devices/android.svg`
            deviceColour = "bg-gradient-to-br from-[#B3E52A] to-[#4c7f11]"
        }
        // Apple iOS & Swiftfin
        else if ((element.Client == "Jellyfin Mobile (iOS)") || (element.Client == "Jellyfin tvOS") || (element.Client == "Jellyfin iOS")) {
            element.Client = "Jellyfin iOS"
            deviceImage = `/devices/apple.svg`
            deviceColour = "bg-gradient-to-br from-[#A7A7A7] to-[#4F4F4F]"
        }
        // FinAmp
        else if (element.Client == "Finamp") {
            deviceImage = `/devices/finamp.svg`
            deviceColour = "bg-gradient-to-br from-[#052249] to-[#AA5CC3]"
        }
        // Infuse
        else if (element.Client == "Infuse") {
            deviceImage = `/devices/infuse.srv`
            deviceColour = "bg-gradient-to-br from-[#444444] to-[#000000]"
        }
        // Infuse
        else if (element.Client == "Jellyfin Media Player") {
            deviceImage = `/devices/jellyfin.srv`
            deviceColour = "bg-gradient-to-br from-[#444444] to-[#000000]"
        }
        // Kodi
        else if (element.DeviceName?.includes("Kodi")) {
            deviceImage = `/devices/kodi.srv`
            deviceColour = "bg-gradient-to-br from-[#99CC99] to-[#008000]"
        }
        // Playstation
        else if (element.DeviceName?.includes("Sony PS")) {
            deviceImage = `/devices/playstation.svg`
            deviceColour = "bg-gradient-to-br from-[#1C6FB5] to-[#052249]"
        }
        // Roku
        else if (element.Client == "Jellyfin Roku") {
            deviceImage = `/devices/roku.svg`
            deviceColour = "bg-gradient-to-br from-[#2D1E39] to-[#732EA9]"
        }
        // Xbox
        else if (element.DeviceName?.includes("Xbox")) {
            deviceImage = `/devices/xbox.svg`
            deviceColour = "bg-gradient-to-br from-[#107C10] to-[#033303]"
        }
        // Fallback
        else {
            deviceImage = "/devices/other.svg"
            deviceColour = "bg-gradient-to-br from-[#AA5CC3] to-[#00A4DC]"
        }

        // check if bitrate is Kbps or Mbps if it is Kbps set it to Kbps if its Mbps set it to Mbps
        let bitrate = ""
        if (bitrate_full && bitrate_full > 1000000) bitrate = `${(bitrate_full / 1000000).toFixed(2)} Mbps`
        if (bitrate_full && bitrate_full < 1000000) bitrate = `${(bitrate_full / 1000).toFixed(2)} Kbps`

        // UI logic
        const movieBackdropStyle = {
            backgroundImage: `url(${url}/Items/${itemId}/Images/Backdrop/0?tag=${itemId})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
        }

        const moviePosterClass = `hidden sm:block overflow-hidden m-1.5 ${isTvChannel ? 'h-32 my-auto' : 'sm:w-52'}`
        const moviePosterImage = `${url}/Items/${itemId}/Images/Primary?tag=${itemId}`
        const moviePosterTitle = element.NowPlayingItem.Name

        // Label, Value, Display State
        const playbackProperties = [
            ["Playing", element.NowPlayingItem.Name, true],
            ["", "", true],
            ["Client", element.Client, true],
            ["Player", element.DeviceName, true],
            ["Client", element.ApplicationVersion, true],
            ["Quality", (element.NowPlayingItem.MediaStreams.find(s => s.Type === "Video"))?.DisplayTitle, true],
            ["Stream", stream, true],
            ["Audio", audio, true],
            ["Video", video, true],
            ["Bandwidth", bitrate, true],
            ["Location", element.RemoteEndPoint, true],
          ];

          // set the playback progress bar to the correct value
          const playbackProgressStyle = {
            width: `${playbackProgress}%`,
          }

          // set the transcoding progress bar to the correct value
          const transcodingProgressStyle = {
            width: `${transcodingProgress}%`,
          }

          // HTML + parsing data
          return (
            <button
              key={index}
              onClick={() => {
                router.push(`user/${element.UserId}`);
              }}
            >
              <div style={movieBackdropStyle}>
                <div className="relative w-full max-w-full flex flex-col sm:flex-row backdrop-blur-sm bg-black/50 pb-5 min-h-[340px]">
                  <img className={moviePosterClass} src={moviePosterImage} alt={moviePosterTitle}/>

                  <div className="absolute left-90 right-0 m-1.5">
                      <div className={`flex items-center justify-center w-16 h-16 rounded ${deviceColour}`}>
                        <img className="w-12 h-12" src={deviceImage}/>
                      </div>
                  </div>

                  <div className="p-2 flex flex-col gap-0.5 ml-4 sm:ml-8">
                    {playbackProperties?.map((element) => {
                      if (element[2]) { // if display state is true
                        return (
                          <div className="flex gap-4">
                            <span className="text-xs text-white/50 uppercase text-right my-auto w-20">{element[0]}</span> {/* Label */}
                            <span className="w-max">{element[1]}</span> {/* Value */}
                          </div>
                        );
                      }
                    })}

                    <div className="flex items-center gap-4 mt-3">
                      <img className="w-10 h-10 rounded-full" src={avatar}/>

                      <div className="text-sm">
                        <span>{element.UserName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Display div on bottom on parent div */}
                  <div className="absolute bottom-0 left-0 min-w-full">
                    <div className={`w-full h-5 relative ${isTvChannel ? 'bg-red-700' : 'bg-gray-700'}`}>
                      <div className="flex justify-between mx-1.5 text-sm font-medium text-white">
                        <span className="z-20">{isTvChannel ? 'Live' : playState}</span>
                        {!isTvChannel &&
                          <span className="z-20">{Math.floor(playbackProgress)}%</span>
                        }
                      </div>

                      {/* Display progress bar */}
                        <div className="bg-blue-600 h-5 bottom-0 left-0 z-10 absolute" style={playbackProgressStyle}></div>

                        {/* Display transcoding progress bar */}
                        {transcodingProgress > 0 &&
                          <div className="bg-orange-600 h-5 absolute bottom-0 left-0 z-0" style={transcodingProgressStyle}></div>
                        }
                    </div>
                  </div>
                </div>
              </div>
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
