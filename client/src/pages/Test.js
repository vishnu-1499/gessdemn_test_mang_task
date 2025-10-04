import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Test = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showAnswer, setShowAnswer] = useState({});
  const testData = location.state?.data || {};

  const testItem = Array.isArray(testData.data)
    ? testData.data[0]
    : Array.isArray(testData)
    ? testData[0]
    : {};

  const title = testItem?.title || "Untitled Test";
  const description = testItem?.description || "No description available";
  const quesAns = testItem?.questions?.[0]?.quesAns || [];

  const toggleAnswer = (quesId) => {
    setShowAnswer((prev) => ({ ...prev, [quesId]: !prev[quesId] }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-4xl">
        <div className="card shadow-lg">
          <div
            className="card-header d-flex justify-content-between align-items-center"
            style={{ backgroundColor: "mediumseagreen" }}
          >
            <div className="d-flex flex-column">
              <h2 className="text-white mb-1">{title}</h2>
              <h5 className="text-light fst-italic mb-0">{description}</h5>
            </div>

            <button
              className="btn btn-light btn-sm"
              onClick={() => navigate("/dashboard/list")}
            >
              Back
            </button>
          </div>

          <div className="card-body p-6">
            {quesAns.length > 0 ? (
              quesAns.map((data, index) => (
                <div
                  key={data._id}
                  className="bg-white shadow-md hover:shadow-lg transition-all rounded-2xl p-6 mb-6 border border-gray-200"
                >
                  <h5 className="font-semibold text-lg mb-3 text-gray-800">
                    {index + 1}. {data.question}
                  </h5>

                  <div className="flex flex-col gap-3 mb-3">
                    {data.options.map((opt, index) => {
                      const option = String.fromCharCode(65 + index);
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg border border-gray-300 bg-gray-50"
                        >
                          <span className="font-bold text-blue-600">
                            {option}.
                          </span>
                          <span className="text-gray-700">{opt}</span>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => toggleAnswer(data._id)}
                    className="px-4 py-2 rounded-md mb-3 hover:bg-blue-700"
                    style={{ backgroundColor: "#2563EB", color: "white" }}
                  >
                    {showAnswer[data._id] ? "Hide Answer" : "Show Answer"}
                  </button>

                  {showAnswer[data._id] && (
                    <div className="mt-2 p-4 border border-blue-200 rounded-lg bg-blue-50">
                      <p className="font-semibold text-gray-800">
                        The correct answer is: {data.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">
                No questions available.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;
