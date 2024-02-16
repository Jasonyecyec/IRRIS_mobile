import React, { useState } from "react";
import ratingValues from "./ratingConfig";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { rateJobOrder } from "@/src/services/api/manpowerService";
import Loading from "@/src/components/Loading";
import { CheckCircle } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { Checkbox, Label } from "flowbite-react";
import ConfirmationModal from "@/src/components/ConfirmationModal";
import "../../index.css";

const ManpowerRatingPage = () => {
  const { jobOrderId } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmModal, setIsConfirmModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    checkbox1: null,
    checkbox2: null,
    checkbox3: null,
  });

  const notify = (message) =>
    toast.error(message, {
      style: {
        fontSize: "1.2rem",
        fontWeight: "bold",
        marginTop: "2rem",
      },
      id: "error",
      duration: 2000,
    });

  const handleCheckboxChange = (e) => {
    setError(false);
    console.log(e.target.value);
    const checkboxId = e.target.id;
    const checkBoxValue = e.target.checked;
    setFormData({
      ...formData,
      [checkboxId]: checkBoxValue,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleConfirmButton = async () => {
    setIsLoading(true);
    setIsConfirmModal(false);
    try {
      if (jobOrderId) {
        formData.job_order_id = jobOrderId;
      }
      const response = await rateJobOrder(formData);
      console.log("rate response", response);
      setShowModal(true);
    } catch (error) {
      notify("Can't find Job Order");
    } finally {
      setIsLoading(false);
    }

    console.log("formData", formData);
  };

  const handleSubmit = async () => {
    setIsConfirmModal(true);
    console.log("form", formData);

    // if (!formData.rating) {
    //   setError(true);
    //   return;
    // }
  };

  const handleDone = () => {
    navigate("/manpower/tasks");
  };

  console.log("params", jobOrderId);
  return (
    <div className="h-screen w-screen background ">
      <Toaster />
      {isConfirmModal && (
        <ConfirmationModal
          isLoading={isLoading}
          onCloseModal={() => setIsConfirmModal(false)}
          content="Are you sure you want to submit?"
          handleConfirmButton={handleConfirmButton}
        />
      )}
      {isLoading && <Loading />}

      {showModal && (
        <div
          className="fixed z-20 inset-0 bg-gray-800 bg-opacity-50 p-5 overflow-y-auto h-full w-full flex justify-center items-center"
          id="my-modal"
        >
          <div className="p-5 pt-8 border w-full space-y-5 shadow-lg rounded-md bg-white relative">
            <div className="flex flex-col items-center justify-center ">
              <CheckCircle size={100} color="#2ead3d" weight="fill" />

              <p className="text-2xl text-center bg-green-100 p-3 rounded-lg mt-5">
                Feedback is submitted!
              </p>

              <button
                className="text-white bg-mainColor font-bold text-xl px-8 py-2 mt-12 rounded-lg"
                onClick={handleDone}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
      <main className="p-8 h-full flex flex-col">
        <h1 className="text-3xl font-bold border-b-2 pb-5">Give Feedback</h1>

        <div className="flex-1 flex flex-col space-y-10">
          <div className=" space-y-5">
            <p className="font-bold">Check the appropriate experience</p>

            <div className="space-y-10">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="checkbox1"
                  className="h-6 w-6"
                  onChange={handleCheckboxChange}
                />
                <Label htmlFor="checkbox1" className="text-lg">
                  I want to get promotional offers8
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="checkbox2"
                  className="h-6 w-6"
                  onChange={handleCheckboxChange}
                />
                <Label htmlFor="checkbox2" className="text-lg">
                  I want to get promotional offers
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="checkbox3"
                  className="h-6 w-6"
                  onChange={handleCheckboxChange}
                />
                <Label htmlFor="checkbox3" className="text-lg">
                  I want to get promotional offers
                </Label>
              </div>
              {/* {ratingValues.map((rating) => (
                <button
                  key={rating.value}
                  onClick={() => handleRatingChange(rating.value)}
                  className="flex flex-col items-center"
                >
                  <img
                    src={rating.imgSrc}
                    alt={rating.alt}
                    className={
                      formData.rating === rating.value
                        ? "w-12 h-12"
                        : "w-10 h-10"
                    }
                  />
                  <p
                    className={
                      formData.rating === rating.value
                        ? "font-bold text-mainColor"
                        : ""
                    }
                  >
                    {rating.label}
                  </p>
                </button>
              ))} */}
            </div>
            {error && (
              <span className="text-red-500 font-bold italic ">
                *Ch experience first
              </span>
            )}
          </div>

          {/* <div>
            <p className="font-bold text-xl mb-3">Comment</p>
            <textarea
              name="comment"
              className="form-textarea mt-1 block w-full border rounded-lg border-gray-300 shadow-md focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              rows="8"
              placeholder="Write comments about your task"
              value={formData?.comment || ""}
              onChange={handleChange}
            ></textarea>
          </div> */}

          <button
            className="bg-mainColor text-white font-bold rounded-md py-2 text-2xl"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </main>
    </div>
  );
};

export default ManpowerRatingPage;
