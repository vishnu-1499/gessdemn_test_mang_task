import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast, ToastContainer } from "react-toastify";
import { Api } from "../config/Api";

function SignIn() {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
          const res = await Api({
            method: "POST",
            url: "/login",
            data: {
              email: values.email,
              password: values.password,
            },
          });
          
          if (res.status == true) {
            localStorage.setItem("token", res.token)
            toast(res.message);
            navigate("/dashboard/list")
          } else {
            toast(res.message);
            navigate("/")
          }
      } catch (err) {
        console.error(err);
        toast("Something went wrong.");
      }
    },
  });

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <ToastContainer />
      <div
        className="card shadow p-4"
        style={{ width: "100%", maxWidth: "420px" }}
      >
        <div className="text-center mb-4">
          <h2 className="fw-bold">{ "Login"}</h2>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="form-group mb-3">
            <label>Email address</label>
            <input
              name="email"
              type="email"
              className={`form-control ${
                formik.touched.email && formik.errors.email ? "is-invalid" : ""
              }`}
              placeholder="example@gmail.com"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="invalid-feedback">{formik.errors.email}</div>
            )}
          </div>

          <div className="form-group mb-3">
            <label>Password</label>
            <input
              name="password"
              type="password"
              className={`form-control ${
                formik.touched.password && formik.errors.password
                  ? "is-invalid"
                  : ""
              }`}
              placeholder="••••••••"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="invalid-feedback">{formik.errors.password}</div>
            )}
          </div>

          <div className="d-grid">
            <button
              className="btn btn-success"
              type="submit"
            >
              {"Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
