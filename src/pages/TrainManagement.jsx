import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import TrainRegistrationModal from "./TrainRegistrationModal";
import TrainEditModal from "./TrainEditModal";

import { getTrain, deleteTrains } from "../Controllers/train";
import { getSchedule } from "../Controllers/schedule";

const TrainManagement = () => {
  const [trainList, setTrainList] = useState([]);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [shedule, setSchedule] = useState([]);

  const handleShowRegistrationModal = () => setShowRegistrationModal(true);
  const handleCloseRegistrationModal = () => setShowRegistrationModal(false);
  const handleShowEditModal = (train) => {
    setSelectedTrain(train);
    setShowEditModal(true);
  };
  const handleCloseEditModal = () => setShowEditModal(false);

  useEffect(() => {
    getSchedule().then((result) => {
      const { data } = result;
      const trainIds = data.map((schedule) => schedule.trainId);
      setSchedule(trainIds);
    });
  }, [shedule]);

  useEffect(() => {
    getTrain().then((result) => {
      const { data } = result;
      setTrainList(data);
    });
  }, []);

  const deleteTrain = (trainId) => {
    if (shedule.includes(trainId)) {
      console.log("true");
      Swal.fire({
        title: "Whohooo!!!!",
        text: "You are not allowed to delete the train, It is already scheduled",
        icon: "Error",
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
    } else {
      Swal.fire({
        title: "Delete Train?",
        text: "Are you sure you want to delete this train?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          deleteTrains(trainId)
            .then((response) => {
              if (response.status === 200) {
                const updatedTrainList = trainList.filter(
                  (train) => train.id !== trainId
                );
                setTrainList(updatedTrainList);
                Swal.fire("Deleted!", "The train has been deleted.", "success");
                setTimeout(() => {
                  window.location.href = "/train";
                }, 2500);
              } else {
                Swal.fire("Deleted!", "The train has been deleted.", "success");
                setTimeout(() => {
                  window.location.href = "/train";
                }, 2500);
              }
            })
            .catch((error) => {
              Swal.fire("Error", "Failed to delete the train.", error);
            });
        }
      });
    }
  };

  return (
    <div className="wrapper">
      <div className="main">
        <main className="content">
          <div className="container-fluid">
            <div className="header">
              <h1 className="header-title">Train Management</h1>
              <Link
                className="btn btn-primary ml-auto mb-2"
                onClick={handleShowRegistrationModal}
              >
                Add Train
              </Link>
            </div>

            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <table id="example" className="table table-striped my">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Classes</th>
                        <th>Seats</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trainList.map((train, index) => (
                        <tr key={index}>
                          <td>{train.id}</td>
                          <td>{train.name}</td>
                          <td>{train.classes.join(", ")}</td>
                          <td>{train.seats}</td>
                          <td className="table-action">
                            <div
                              className="mx-auto"
                              style={{
                                display: "flex",
                                gap: "1px",
                                paddingRight: "100px",
                              }}
                            >
                              <button
                                className="btn btn-pill btn-primary btn-sm"
                                onClick={() => handleShowEditModal(train)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-pill btn-danger btn-sm "
                                onClick={() => deleteTrain(train.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <TrainRegistrationModal
        show={showRegistrationModal}
        handleClose={handleCloseRegistrationModal}
      />
      <TrainEditModal
        show={showEditModal}
        handleClose={handleCloseEditModal}
        train={selectedTrain}
      />
    </div>
  );
};

export default TrainManagement;
