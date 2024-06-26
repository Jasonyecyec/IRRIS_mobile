import React, { useEffect, useState } from "react";
import Echo from "laravel-echo";
import UserSample from "../../assets/images/user_sample.jpg";
import NotificationIcon from "../../assets/images/bell_icon.png";
import useUserStore from "@/src/services/state/userStore";
import useJobOrderStore from "@/src/services/state/jobOrderStore";
import beamsClient from "@/src/pushNotificationConfig";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import ReportIcon from "../../assets/images/report_icon.png";
import RequestIcon from "../../assets/images/request_icon.png";
import DailyTaskIcon from "../../assets/images/dailyTask_icon.png";
import { Clock, MapPin, Circle, Power } from "@phosphor-icons/react";
import { Spinner } from "flowbite-react";
import { formatDate } from "@/src/utils/utils";
import { useNavigate } from "react-router-dom";
import { getJobOrder } from "@/src/services/api/manpowerService";
import "../../index.css";
import UpKeepLogo from "/qcu_logo.png";
import { Toaster, toast } from "sonner";

import {
  Bell,
  WarningCircle,
  NotePencil,
  Notepad,
} from "@phosphor-icons/react";
import StatusBadgeReport from "@/src/components/StatusBadgeReport";
import {
  getManpowerStatus,
  setManpowerOffline,
  setManpowerOnline,
} from "@/src/services/api/manpowerService";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ConfirmationModal from "@/src/components/ConfirmationModal";

const ManpowerHomePage = () => {
  const { user, setUser } = useUserStore((state) => ({
    user: state.user,
    setUser: state.setUser,
  }));
  const navigate = useNavigate();
  const [recentJobOrder, setRecentJobOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [manpowerStatus, setManpowerStatus] = useState(null);
  const [isFetchingStatus, setIsFetchingStatus] = useState(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [openConfirmStatus, setOpenConfirmStatus] = useState(false);

  const {
    isJobOrderNotif,
    isJobOrderRequestNotif,
    jobOrderDetails,
    jobOrderRequestDetails,
    setjobOrderNotif,
    setjobOrderRequestNotif,
    setJobOrderDetails,
    setJobOrderRequestDetails,
  } = useJobOrderStore((state) => ({
    isJobOrderNotif: state.isJobOrderNotif,
    isJobOrderRequestNotif: state.isJobOrderRequestNotif,
    jobOrderDetails: state.jobOrderDetails,
    jobOrderRequestDetails: state.jobOrderRequestDetails,
    setjobOrderNotif: state.setjobOrderNotif,
    setjobOrderRequestNotif: state.setjobOrderRequestNotif,
    setJobOrderDetails: state.setJobOrderDetails,
    setJobOrderRequestDetails: state.setJobOrderRequestDetails,
  }));

  const fetchRecentJobOrder = async () => {
    setIsLoading(true);
    try {
      const { job_order } = await getJobOrder(user?.id);
      setRecentJobOrder(job_order);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchManpowerStatus = async () => {
    setIsFetchingStatus(true);
    try {
      const { manpower_status } = await getManpowerStatus(user?.id);
      console.log("manpower_status", manpower_status);
      setManpowerStatus(manpower_status);
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsFetchingStatus(false);
    }
  };

  const handleConfirmOffline = async () => {
    setIsLoadingStatus(true);
    try {
      const response = await setManpowerOffline(user?.id);
      setManpowerStatus("not-available");
      toast.info("Status set as 'not available'.");
    } catch (error) {
      console.log("Error", error);
    } finally {
      setIsLoadingStatus(false);
      setOpenConfirmStatus(false);
    }
  };

  const handleOnlineButton = async () => {
    setIsLoadingStatus(true);
    try {
      const response = await setManpowerOnline(user?.id);
      setManpowerStatus("available");
      toast.success("You are now available for job orders.");
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoadingStatus(false);
    }
  };

  const initializePusherBeams = async () => {
    try {
      const client = await beamsClient.start();
      const userIdCookie = Cookies.get("user_id");

      console.log("Pusher Beams initialized successfully", client);

      // Set user ID if needed
      // await client.setUserId("USER_ID");

      // Subscribe to push notifications
      await client.setDeviceInterests([`job-order-${userIdCookie}`]);
      console.log("Device interests have been set");

      // Get and log device interests
      const interests = await client.getDeviceInterests();
      console.log("Device interests:", interests);
    } catch (error) {
      console.error("Error initializing Pusher Beams:", error);
    }
  };

  const listenToJobOrder = () => {
    console.log("listening");
    const userIdCookie = Cookies.get("user_id");

    const jobOrderChannel = window.Echo.channel(
      `job-order-channel-${userIdCookie}`
    );

    const jobOrderRequestChannel = window.Echo.channel(
      `job-order-request-channel-${userIdCookie}`
    );

    //   // LISTEN TO REPORT
    jobOrderChannel.listen("JobOrderNotification", (notification) => {
      console.log(
        "Successfully subscribed to job-order-channel:",
        notification
      );
      if (
        notification &&
        notification.jobOrder &&
        Array.isArray(notification.jobOrder)
      ) {
        console.log("job order recieved");

        notification.jobOrder.forEach((job) => {
          if (job.assigned_manpower === parseInt(userIdCookie, 10)) {
            console.log("setting job order");
            setjobOrderNotif(true);

            setJobOrderDetails((prev) => {
              const updatedJobOrderDetails = { ...prev, job };
              console.log("updatedJobOrderDetails", updatedJobOrderDetails);

              // set the job order to local storage
              localStorage.setItem(
                "job_order",
                JSON.stringify(updatedJobOrderDetails)
              );
              return updatedJobOrderDetails;
            });
          }
        });
      }
    });

    // LISTEN TO REQUEST
    jobOrderRequestChannel.listen(
      "JobOrderRequestNotification",
      (notification) => {
        console.log(
          "Successfully subscribed to job-order-request-channel:",
          notification
        );
        setjobOrderRequestNotif(true);

        if (
          notification &&
          notification.jobOrderRequest &&
          Array.isArray(notification.jobOrderRequest)
        ) {
          notification.jobOrderRequest.forEach((job) => {
            setjobOrderRequestNotif(true);

            setJobOrderRequestDetails((prev) => {
              const updatedJobOrderDetails = { ...prev, job };
              console.log("updatedJobOrderDetails", updatedJobOrderDetails);
              // set the job order to local storage
              localStorage.setItem(
                "job_order_request",
                JSON.stringify(updatedJobOrderDetails)
              );
              return updatedJobOrderDetails;
            });
          });
        }
      }
    );
  };

  useEffect(() => {
    // Check if there's an existing job order in localStorage
    const jobOrderLocalStorage = localStorage.getItem("job_order");

    if (jobOrderLocalStorage) {
      setjobOrderNotif(true);
      setJobOrderDetails(JSON.parse(jobOrderLocalStorage));
    }

    //if user is null
    if (user === null) {
      console.log("user data is null");
      const userIdCookie = Cookies.get("user_id");
      const first_nameCookie = Cookies.get("first_name");
      const last_nameCookie = Cookies.get("last_name");
      const user_roleCookie = Cookies.get("user_role");
      const emailCookie = Cookies.get("email");

      setUser({
        id: userIdCookie,
        first_name: first_nameCookie,
        last_name: last_nameCookie,
        email: emailCookie,
        user_role: user_roleCookie,
      });
    }

    fetchManpowerStatus();
    // initializePusherBeams();

    // listenToJobOrder();

    fetchRecentJobOrder();
  }, []);

  const handleReportButton = () => {
    // Clear the value in localStorage for the key "job_order"
    localStorage.removeItem("job_order");
    setjobOrderNotif(false);
    setJobOrderDetails(null);

    //redirect to task page
    navigate("/manpower/tasks");
  };

  const handleRequestButton = () => {
    // Clear the value in localStorage for the key "job_order"
    localStorage.removeItem("job_order_request");
    setjobOrderRequestNotif(false);
    setJobOrderRequestDetails(null);

    //redirect to task page
    navigate("/manpower/tasks");
  };

  const handleProfileButton = () => {
    navigate("/manpower/profile");
  };

  return (
    <div className="h-full flex flex-col bg-secondaryColor">
      <Toaster richColors position="top-center" />
      {openConfirmStatus && (
        <ConfirmationModal
          isLoading={isLoadingStatus}
          onCloseModal={() => setOpenConfirmStatus(false)}
          handleConfirmButton={handleConfirmOffline}
          content={"Are you sure you want to go offline?"}
        />
      )}

      <div className="flex p-3 justify-between">
        <div className="flex items-center font-semibold text-mainColor space-x-2">
          <img src={UpKeepLogo} className="w-9 h-7" />
          <div className="flex flex-col">
            <p className="text-xl">
              Hello,{" "}
              <span>
                {" "}
                {user?.first_name} {user?.last_name}!
              </span>
            </p>
            <p className="text-xs uppercase font-semibold ">
              {user?.user_role === "manpower"
                ? "Service Provider"
                : user?.user_role}
            </p>
          </div>
        </div>

        <Link to={`/manpower/notification/${user?.id}`}>
          <button>
            <Bell size={"2.3rem"} color="#1656ea" weight="fill" />
          </button>
        </Link>
      </div>

      {isFetchingStatus ? (
        <div className="px-5 w-32 h-[2.5rem] rounded-full">
          <Skeleton width={"100%"} height={"100%"} className="rounded-full" />
        </div>
      ) : (
        manpowerStatus && (
          <div className=" px-5 flex">
            {manpowerStatus === "not-available" ? (
              <button
                onClick={handleOnlineButton}
                className=" rounded-full bg-gray-600 text-gray-50 font-semibold  flex items-center p-2 px-3 space-x-2"
                disabled={isLoadingStatus}
              >
                <div className="rounded-full">
                  <Power
                    size={24}
                    weight="bold"
                    className=" text-white rounded-full "
                  />
                </div>

                <span>GO ONLINE</span>
              </button>
            ) : (
              <button
                onClick={() => setOpenConfirmStatus(true)}
                className=" rounded-full  bg-gray-100 font-semibold  flex items-center  space-x-3"
              >
                <div className="rounded-full bg-green-500 p-2 w-10 h-10">
                  <Power
                    size={24}
                    weight="bold"
                    className=" text-white rounded-full "
                  />
                </div>
              </button>
            )}
          </div>
        )
      )}

      <div className="p-5 flex-1 flex flex-col space-y-7">
        <div className="p-2 rounded-lg">
          <p className="font-bold text-xl mb-5 text-center text-mainColor2">
            Categories
          </p>
          <div className="flex justify-between">
            <button
              className="bg-white shadow flex flex-col space-y-1 mr-3 items-center justify-center w-28 h-28 rounded-md relative"
              onClick={handleReportButton}
            >
              <WarningCircle className="text-[#0f59cb] w-10 h-10" />
              <span className="text-[#0f59cb] font-semibold"> Report</span>

              {isJobOrderNotif && (
                <span className="absolute top-[-5px] right-[-5px] flex h-6 w-6 ">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-6 w-6 bg-red-500 text-xs justify-center items-center text-white">
                    !
                  </span>
                </span>
                // <span className="absolute top-[-3px] right-[-3px] bg-red-600  animate-pulse rounded-full w-4 h-4"></span>
              )}
            </button>

            <button
              className="bg-white shadow space-y-1 mr-3 flex flex-col items-center justify-center w-28 h-28 rounded-md relative"
              onClick={handleRequestButton}
            >
              <NotePencil className="text-[#0f59cb] w-10 h-10" />

              <span className="text-[#0f59cb] font-semibold"> Request</span>
              {isJobOrderRequestNotif && (
                <span className="absolute top-[-5px] right-[-5px] flex h-6 w-6 ">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-6 w-6 bg-red-500 text-xs justify-center items-center text-white">
                    !
                  </span>
                </span>
                // <span className="absolute top-[-3px] right-[-3px] bg-red-600  animate-pulse rounded-full w-4 h-4"></span>
              )}
              {console.log("job order requesst", isJobOrderRequestNotif)}
            </button>

            <button
              onClick={() => navigate("/manpower/report-form")}
              className="bg-white shadow space-y-1  flex flex-col items-center justify-center w-28 h-28 rounded-md"
            >
              <Notepad className="text-[#0f59cb] w-10 h-10" />
              <span className="text-sm font-semibold text-[#0f59cb]">
                {" "}
                Report Form
              </span>
            </button>
          </div>
        </div>

        <div className="bg-white  rounded-lg  shadow h-[25rem]  flex  flex-col p-5 relative">
          <div className="flex justify-between w-full pb-3 border-b-[1px]">
            <p className="font-semibold text-[#0f59cb]">Job order details</p>

            <p className="font-semibold text-[#0f59cb]">Status</p>
          </div>
          {isLoading ? (
            <div className="flex justify-center pt-10">
              <Spinner aria-label="Large spinner example" size="lg" />
            </div>
          ) : (
            <div className="h-[16.5rem]  overflow-y-scroll">
              {recentJobOrder && recentJobOrder.length > 0 ? (
                recentJobOrder?.map((item, index) => (
                  <div
                    key={index}
                    className="space-y-1 bg-white shadow-md rounded-md p-2 flex justify-between"
                  >
                    <div>
                      {" "}
                      <p className="font-semibold">{item.description}</p>
                      <p className="text-sm flex items-center space-x-2 ">
                        <Clock size={24} color="#121212" />
                        <span className="text-gray-500">
                          {" "}
                          {formatDate(item.created_at)}{" "}
                        </span>
                      </p>
                      <p className="flex text-sm items-center space-x-2">
                        <MapPin size={24} color="#121212" />
                        <span className="text-gray-500">
                          {" "}
                          {item.report?.facility?.facilities_name}
                        </span>
                      </p>
                      <p className="flex text-sm items-center space-x-2">
                        <WarningCircle size={24} color="#121212" />
                        <span className="text-gray-500">
                          {" "}
                          {item.report?.issues}
                        </span>
                      </p>
                    </div>
                    <div className="flex  items-center justify-center">
                      <p>
                        {" "}
                        <StatusBadgeReport status={item.status} />
                      </p>

                      {/* <p className="text-sm flex items-center space-x-2">
                        <Circle size={24} color="#3cd008" weight="fill" />
                        <span>
                          {item.status === "assigned" ? "Pending" : "Ongoing"}
                        </span>
                      </p> */}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center font-semibold text-gray-500 mt-10">
                  No data available
                </p>
              )}
            </div>
          )}

          <Link
            to="/manpower/tasks"
            className="text-gray-500 font-bold absolute bottom-0 left-0 bg-bottomNav w-full p-2 text-center rounded-b-lg"
          >
            <button> See more</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ManpowerHomePage;
