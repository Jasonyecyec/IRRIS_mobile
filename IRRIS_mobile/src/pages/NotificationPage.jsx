import React, { useEffect, useState } from "react";
import { ArrowLeft } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import { getNotification } from "../services/api/sharedService";
import Cookies from "js-cookie";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { formatDate, formatDateTime } from "../utils/utils";
import "react-loading-skeleton/dist/skeleton.css";
import PageTitle from "../components/PageTitle";

const SkeletonNotification = ({ count }) => {
  return (
    <div className="w-full ">
      <SkeletonTheme baseColor="#ebebeb" highlightColor="#f5f5f5">
        {[...Array(count)].map((_, index) => (
          <Skeleton
            width={"w-full"}
            height={"6rem"}
            className="rounded-lg mb-5"
          />
        ))}
      </SkeletonTheme>
    </div>
  );
};

const NotificationPage = () => {
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotification = async (id) => {
    setIsLoading(true);
    try {
      const { notification } = await getNotification(id);
      setNotification(notification);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const userIdCookie = Cookies.get("user_id");
    fetchNotification(userIdCookie);
  }, []);
  return (
    <div className="h-full flex flex-col">
      <PageTitle title="Notifications" />

      <div className=" flex-1 p-3 space-y-3">
        <div className=" h-[40rem] overflow-auto space-y-5">
          {isLoading ? (
            <SkeletonNotification count={5} />
          ) : notification && notification.length !== 0 ? (
            notification.map((item) => (
              <div className="shadow-md bg-white rounded-lg p-5" key={item.id}>
                <div className="flex justify-between border-b-2 pb-3">
                  <p className="mt-1">Notif No: {item.id} </p>
                  <p>{formatDateTime(item.created_at)}</p>
                </div>
                <p className="font-bold mt-2">{item.message}</p>
              </div>
            ))
          ) : (
            notification && (
              <p className="font-semibold text-center mt-10 text-lg">
                No notifications
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
