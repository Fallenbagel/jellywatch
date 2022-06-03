import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import axios from "axios";
import { Root } from "../../types";
import React from "react";

export default function IDPage({
  pageComponentProps,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = React.useState<Root | null>();

  React.useEffect(() => {
    function fetchData() {
      const url = Cookies.get("URL");
      const apiKey = Cookies.get("API_KEY");

      // https://bagelmedia.cyou/Session?id=9941d26db9294d6892e6f62c32ab8d78
      // To fetch the user based on session ID
      const urlToFetch = `${url}/Sessions`;
      axios
        .get(urlToFetch, {
          params: {
            api_key: apiKey,
          },
        })
        .then((res) => {
          res.data.map((item: Root) => {
            if (item.UserId === id) {
              setData(item);
              console.log("HEllo");
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }

    fetchData();
  }, [id]);

  return (
    <div className="flex flex-col text-white">
      <h1>{data?.UserName}</h1>
      <h1>{data?.DeviceName}</h1>
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
