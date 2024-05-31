import "./App.css";
import {
  BrowserRouter,
  createBrowserRouter,
  Route,
  Router,
  RouterProvider,
  Routes,
} from "react-router-dom";
import SignIn from "./pages/signin/SignIn";
import SignUp from "./pages/signup/SignUp";
import ProtectedRouter from "./utils/ProtectedRoute";
import Home from "./pages/Home";
import React, { useState } from "react";
import { Formik, Form, Field, FieldArray } from "formik";

const CampaignConfigurator = () => {
  const config = {
    triggers: [
      {
        id: "scheduled_trigger",
        description: "Trigger an action at a specific time",
        parameters: [
          { name: "date", type: "date", label: "Date" },
          { name: "time", type: "time", label: "Time" },
          {
            name: "repeat",
            type: "select",
            label: "Repeat",
            options: ["None", "Daily", "Weekly", "Monthly", "Yearly"],
          },
        ],
      },
      {
        id: "appointment_status_change",
        description: "Trigger on appointment status change",
        parameters: [
          {
            name: "from_status",
            type: "select",
            label: "From Status",
            options: ["Booked", "Checked In", "Completed", "Cancelled"],
          },
          {
            name: "to_status",
            type: "select",
            label: "To Status",
            options: ["Booked", "Checked In", "Completed", "Cancelled"],
          },
        ],
      },
    ],
    actions: [
      {
        id: "send_sms",
        description: "Send an SMS",
        parameters: [{ name: "message", type: "text", label: "Message" }],
      },
    ],
    conditions: [
      {
        id: "spend_threshold",
        description: "Customer has spent over a certain amount",
        parameters: [{ name: "amount", type: "number", label: "Amount" }],
      },
    ],
  };

  const [step, setStep] = useState(0);
  const steps = ["triggers", "actions", "conditions"];

  const renderField = ({ name, type, label, options }) => {
    if (type === "select") {
      return (
        <Field as="select" name={name} className="block p-2 border rounded">
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Field>
      );
    }
    return (
      <Field type={type} name={name} className="block p-2 border rounded" />
    );
  };

  const handleNextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    }
  };

  return (
    <div className="p-4">
      <Formik
        initialValues={{
          trigger: "",
          action: "",
          conditions: [],
        }}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {(formik) => (
          <Form>
            {step === 0 && (
              <div>
                <h2 className="text-lg font-bold mb-2">Select Trigger</h2>
                {config.triggers.map((trigger, index) => (
                  <div key={trigger.id}>
                    <label className="block cursor-pointer p-2 border rounded hover:bg-gray-100">
                      <Field
                        type="radio"
                        name="trigger"
                        value={trigger.id}
                        onClick={() => handleNextStep()}
                      />
                      <span className="ml-2">{trigger.description}</span>
                    </label>
                  </div>
                ))}
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="text-lg font-bold mb-2">Define Action</h2>
                {config.actions.map((action, index) => (
                  <div key={action.id}>
                    <label className="block cursor-pointer p-2 border rounded hover:bg-gray-100">
                      <Field
                        type="radio"
                        name="action"
                        value={action.id}
                        onClick={() => handleNextStep()}
                      />
                      <span className="ml-2">{action.description}</span>
                    </label>
                  </div>
                ))}
              </div>
            )}

            {step === 2 && (
              <FieldArray
                name="conditions"
                render={(arrayHelpers) => (
                  <div>
                    <h2 className="text-lg font-bold mb-2">Add Conditions</h2>
                    {config.conditions.map((condition, index) => (
                      <div key={condition.id}>
                        <h3 className="text-md font-bold mb-2">
                          {condition.description}
                        </h3>
                        {condition.parameters.map((param) => (
                          <div key={param.name}>
                            <label className="block text-sm font-medium mb-1">
                              {param.label}
                            </label>
                            {renderField(param)}
                          </div>
                        ))}
                      </div>
                    ))}
                    <button
                      type="button"
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
                      onClick={() => arrayHelpers.push({})}
                    >
                      Add Condition
                    </button>
                  </div>
                )}
              />
            )}

            {step === 2 && (
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
              >
                Submit Campaign
              </button>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<ProtectedRouter />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
