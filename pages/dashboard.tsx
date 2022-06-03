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

    fetchData();
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
          const itemId= element.NowPlayingItem.ParentBackdropItemId

          // HTML + parsing data
          return (
            <button
              key={index}
              onClick={() => {
                router.push(`user/${element.UserId}`);
              }}
            >
              <div className="bg-gray-600 text-gray-200 p-4">
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
