import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import { Api } from "../config/Api";

function List() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add");
  const [getList, setgetList] = useState([]);
  const [selectedModel, setselectedModel] = useState(null);

  const handleOpen = (title) => {
    setModalTitle(title);
    setShowModal(true);
  };

  const getListData = async () => {
    try {
      const resp = await Api({
        method: "GET",
        url: `/total-list`,
      });

      if (resp.status) {
        setgetList(resp.data);
      } else {
        setgetList([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getListData();
  }, []);

  const columns = [
    {
      name: "Si.No",
      selector: (row, index) => index + 1,
      width: "100px",
      center: true,
    },
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
      width: "180px",
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
      width: "180px",
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex justify-content-center gap-2">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => handleAdd(row)}
          >
            Add Question
          </button>
          <button
            className="btn btn-info btn-sm"
            onClick={() => handleView(row)}
          >
            View Question
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => handleDelete(row)}
          >
            Delete
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      minWidth: "500px",
      center: true,
    },
  ];

  const handleAdd = async (data) => {
    setselectedModel(data);
    setModalTitle("Questions");
    setShowModal(true);
  };

  const handleView = async (data) => {
    try {
      const resp = await Api({
        method: "POST",
        url: `/get-answerData/${data._id}`,
      });

      if (resp.status) {
        navigate("/dashboard/test", { state: { data: resp } });
      } else {
        toast.warn(resp.message);
      }
    } catch (error) {
      toast("Internal Error");
    }
  };

  const handleDelete = async (data) => {
    try {
      const resp = await Api({
        method: "POST",
        url: `/delete-questionlist/${data._id}`,
      });

      if (resp.status) {
        toast.success(resp.message);
        getListData();
      } else {
        toast.warn(resp.message);
      }
    } catch (error) {
      toast("Internal Error");
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const resp = await Api({
        method: "POST",
        url: `/csv-file-upload`,
        data: formData,
        header: "file",
      });

      if (resp.status) {
        toast.success(resp.message);
        getListData();
      } else {
        toast.warn(resp.message);
      }
    } catch (error) {
      toast("Internal Error");
    }
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      question: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      answer: "",
    },
    validationSchema: Yup.object({
      title: !selectedModel
        ? Yup.string().required("Enter the Title Name..")
        : Yup.string(),
      description: !selectedModel
        ? Yup.string().required("Enter the Description Details..")
        : Yup.string(),
      question: selectedModel
        ? Yup.string().required("Enter the Question")
        : Yup.string(),
      option1: selectedModel
        ? Yup.string().required("Enter the Option1")
        : Yup.string(),
      option2: selectedModel
        ? Yup.string().required("Enter the Option2")
        : Yup.string(),
      option3: selectedModel
        ? Yup.string().required("Enter the Option3")
        : Yup.string(),
      option4: selectedModel
        ? Yup.string().required("Enter the Option4")
        : Yup.string(),
      answer: selectedModel
        ? Yup.string().required("Enter the Answers")
        : Yup.string(),
    }),

    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("question", values.question);
        formData.append("option1", values.option1);
        formData.append("option2", values.option2);
        formData.append("option3", values.option3);
        formData.append("option4", values.option4);
        formData.append("answer", values.answer);

        const url = selectedModel
          ? `/add-questions/${selectedModel._id}`
          : "/create-test";

        const resp = await Api({
          method: "POST",
          url: url,
          data: formData,
        });

        if (resp.status == true) {
          setShowModal(false);
          getListData();
        } else {
          toast.warn(resp.message);
        }
      } catch (error) {
        toast("Internal Error");
      }
    },
  });

  const handleClose = () => {
    setselectedModel(null);
    setShowModal(false);
    formik.resetForm();
  };

  return (
    <div className="container my-5">
      <ToastContainer />
      <div className="card shadow-lg">
        <div
          className="card-header text-white d-flex justify-content-between align-items-center flex-wrap gap-2"
          style={{ backgroundColor: "mediumseagreen" }}
        >
          <h5 className="mb-0">Title List</h5>
          <div className="d-flex gap-2 align-items-center">
            <button
              className="btn btn-light btn-sm"
              onClick={() => handleOpen("Add")}
            >
              Add Title
            </button>

            <label className="btn btn-light btn-sm mb-0">
              Upload CSV
              <input
                type="file"
                name="file"
                accept=".csv"
                hidden
                onChange={(e) => handleUpload(e)}
              />
            </label>

            <button
              className="btn btn-light btn-sm"
              onClick={() => {
                localStorage.clear();
                navigate("/");
              }}
            >
              Log Out
            </button>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-10">
            <DataTable
              columns={columns}
              data={getList}
              highlightOnHover
              dense
              pagination
              paginationServer
              paginationRowsPerPageOptions={[5, 10, 15]}
            />
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow">
              <div
                className="modal-header"
                style={{ backgroundColor: "#e8f5e9" }}
              >
                <h5 className="modal-title">{modalTitle}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleClose}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={formik.handleSubmit}>
                  {!selectedModel && (
                    <>
                      {/* Title */}
                      <div className="mb-3">
                        <label className="form-label">Title</label>
                        <input
                          type="text"
                          name="title"
                          id="title"
                          className={`form-control ${
                            formik.touched.title && formik.errors.title
                              ? "is-invalid"
                              : ""
                          }`}
                          placeholder="Enter Title name"
                          value={formik.values.title}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.title && formik.errors.title && (
                          <div className="invalid-feedback">
                            {formik.errors.title}
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <input
                          type="text"
                          name="description"
                          id="description"
                          className={`form-control ${
                            formik.touched.description &&
                            formik.errors.description
                              ? "is-invalid"
                              : ""
                          }`}
                          placeholder="Enter Description"
                          value={formik.values.description}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.description &&
                          formik.errors.description && (
                            <div className="invalid-feedback">
                              {formik.errors.description}
                            </div>
                          )}
                      </div>
                    </>
                  )}

                  {selectedModel && (
                    <>
                      {/* Questions */}
                      <div className="mb-3">
                        <label className="form-label">Questions</label>
                        <input
                          type="text"
                          name="question"
                          id="question"
                          className={`form-control ${
                            formik.touched.question && formik.errors.question
                              ? "is-invalid"
                              : ""
                          }`}
                          placeholder="Enter Questions"
                          value={formik.values.question}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.question && formik.errors.question && (
                          <div className="invalid-feedback">
                            {formik.errors.question}
                          </div>
                        )}
                      </div>

                      {/* Options */}
                      <div className="mb-3">
                        <label className="form-label">Option 1</label>
                        <input
                          type="text"
                          name="option1"
                          className={`form-control ${
                            formik.touched.option1 && formik.errors.option1
                              ? "is-invalid"
                              : ""
                          }`}
                          value={formik.values.option1}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Enter Option 1"
                        />
                        {formik.touched.option1 && formik.errors.option1 && (
                          <div className="invalid-feedback">
                            {formik.errors.option1}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Option 2</label>
                        <input
                          type="text"
                          name="option2"
                          className={`form-control ${
                            formik.touched.option2 && formik.errors.option2
                              ? "is-invalid"
                              : ""
                          }`}
                          value={formik.values.option2}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Enter Option 2"
                        />
                        {formik.touched.option2 && formik.errors.option2 && (
                          <div className="invalid-feedback">
                            {formik.errors.option2}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Option 3</label>
                        <input
                          type="text"
                          name="option3"
                          className={`form-control ${
                            formik.touched.option3 && formik.errors.option3
                              ? "is-invalid"
                              : ""
                          }`}
                          value={formik.values.option3}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Enter Option 3"
                        />
                        {formik.touched.option3 && formik.errors.option3 && (
                          <div className="invalid-feedback">
                            {formik.errors.option3}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Option 4</label>
                        <input
                          type="text"
                          name="option4"
                          className={`form-control ${
                            formik.touched.option4 && formik.errors.option4
                              ? "is-invalid"
                              : ""
                          }`}
                          value={formik.values.option4}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Enter Option 4"
                        />
                        {formik.touched.option4 && formik.errors.option4 && (
                          <div className="invalid-feedback">
                            {formik.errors.option4}
                          </div>
                        )}
                      </div>

                      {/* Answers */}
                      <div className="mb-3">
                        <label className="form-label">Answers</label>
                        <input
                          type="text"
                          name="answer"
                          id="answer"
                          className={`form-control ${
                            formik.touched.answer && formik.errors.answer
                              ? "is-invalid"
                              : ""
                          }`}
                          placeholder="Enter Answers"
                          value={formik.values.answer}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.answer && formik.errors.answer && (
                          <div className="invalid-feedback">
                            {formik.errors.answer}
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleClose}
                    >
                      Close
                    </button>
                    <button type="submit" className="btn btn-success">
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default List;
