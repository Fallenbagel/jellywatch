import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { Root } from "../types";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Cookies from "js-cookie";

type FormData = {
  url: string;
  apiKey: string;
};

export default function IndexPage({
  pageComponentProps,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [array, setArray] = React.useState<Root[] | null>();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();
  const router = useRouter();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data);

    if (!data.apiKey) {
      return;
    }
    if (!data.url) {
      return;
    }

    Cookies.set("URL", data.url);
    Cookies.set("API_KEY", data.apiKey);

    // Move onto the dashboard
    router.push("/dashboard");
  };

  return (
    <div className="bg-gray-900 h-screen text-white p-4 flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-3/12 space-y-5"
      >
        <div className="flex items-center justify-center w-full pb-8">
          <h1 className="font-bold text-5xl">JellyWatch</h1>
        </div>
        <div className="flex flex-col space-y-1">
          <label>Jellyfin URL</label>
          <input
            placeholder="URL"
            {...register("url")}
            className="p-2 rounded text-black"
          />
        </div>
        <div className="flex flex-col space-y-1">
          <label>API Key</label>
          <input
            placeholder="API key"
            {...register("apiKey")}
            className="p-2 rounded text-black"
          />
        </div>
        <button className="bg-blue-500 py-3 rounded" type="submit">
          Login
        </button>
      </form>
      {/* <div className="grid gap-4 grid-cols-3 grid-rows-3">
        {array?.map((element, index) => {
          // Programming logic
          if (!element.NowPlayingItem) {
            return null;
          }

          // HTML + parsing data
          return (
            <div key={index} className="">
              <div>
                <p>{element.UserName}</p>
              </div>
            </div>
          );
        })}
      </div> */}
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
