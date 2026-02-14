import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { submitDoshaThunk } from "../../feature/User/user.thunk";



const questions = [
  {
    question: "How is your body frame?",
    options: [
      { label: "Thin / Lean", value: "vata" },
      { label: "Medium / Athletic", value: "pitta" },
      { label: "Heavy / Broad", value: "kapha" },
    ],
  },
  {
    question: "Your skin type is mostly:",
    options: [
      { label: "Dry / Rough", value: "vata" },
      { label: "Oily / Sensitive", value: "pitta" },
      { label: "Smooth / Moist", value: "kapha" },
    ],
  },
  {
    question: "How is your appetite?",
    options: [
      { label: "Irregular", value: "vata" },
      { label: "Strong / Frequent", value: "pitta" },
      { label: "Slow / Low", value: "kapha" },
    ],
  },
  {
    question: "Your sleep pattern is:",
    options: [
      { label: "Light / Disturbed", value: "vata" },
      { label: "Moderate", value: "pitta" },
      { label: "Deep / Long", value: "kapha" },
    ],
  },
];

export default function PrakritiVikritiForm() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [prakritiAnswers, setPrakritiAnswers] = useState({});
  const [vikritiAnswers, setVikritiAnswers] = useState({});

  const [prakritiResult, setPrakritiResult] = useState(null);
  const [vikritiResult, setVikritiResult] = useState(null);

  const handleChange = (type, qIndex, value) => {
    if (type === "prakriti") {
      setPrakritiAnswers({
        ...prakritiAnswers,
        [qIndex]: value,
      });
    } else {
      setVikritiAnswers({
        ...vikritiAnswers,
        [qIndex]: value,
      });
    }
  };

  const calculateDosha = (answers) => {
    const score = { vata: 0, pitta: 0, kapha: 0 };

    Object.values(answers).forEach((d) => {
      score[d]++;
    });

    const total =
      score.vata + score.pitta + score.kapha;

    return {
      vata: Number(((score.vata / total) * 100).toFixed(1)),
      pitta: Number(((score.pitta / total) * 100).toFixed(1)),
      kapha: Number(((score.kapha / total) * 100).toFixed(1)),
    };
  };

  const getDominant = (result) => {
    const max = Math.max(
      result.vata,
      result.pitta,
      result.kapha
    );

    if (max === result.vata) return "vata";
    if (max === result.pitta) return "pitta";
    return "kapha";
  };
  const handleSubmit = async () => {

    // Validation
    if (
      Object.keys(prakritiAnswers).length !== questions.length ||
      Object.keys(vikritiAnswers).length !== questions.length
    ) {
      alert("Please answer all questions");
      return;
    }
    const prakriti = calculateDosha(prakritiAnswers);
    const vikriti = calculateDosha(vikritiAnswers);

    setPrakritiResult(prakriti);
    setVikritiResult(vikriti);

    // Payload to backend
    const payload = {
      prakriti,
      vikriti,
      dominantPrakriti: getDominant(prakriti),
      dominantVikriti: getDominant(vikriti),
    };

    try {
      await dispatch(
        submitDoshaThunk(payload)
      ).unwrap();
      setTimeout(() => {
        navigate("/patient-dashboard");
      }, 1500);

    } catch (error) {
      console.error("Submit failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 p-6 flex justify-center">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl p-8 border border-green-200">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-green-700">
            Prakriti & Vikriti Assessment
          </h1>
          <p className="text-gray-500 mt-2">
            Fill both sections to compare natural constitution and imbalance
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">

          <div>
            <h2 className="text-xl font-bold text-green-700 mb-4">
              Prakriti (Natural)
            </h2>

            {questions.map((q, i) => (
              <div key={i} className="mb-5 p-4 bg-green-50 rounded-xl border border-green-100">
                <h3 className="font-semibold text-green-800 mb-2">
                  {q.question}
                </h3>

                {q.options.map((opt, j) => (
                  <label key={j} className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-green-200 mb-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`prakriti-${i}`}
                      onChange={() =>
                        handleChange("prakriti", i, opt.value)
                      }
                      className="accent-green-600"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-xl font-bold text-green-700 mb-4">
              Vikriti (Current)
            </h2>

            {questions.map((q, i) => (
              <div key={i} className="mb-5 p-4 bg-green-50 rounded-xl border border-green-100">
                <h3 className="font-semibold text-green-800 mb-2">
                  {q.question}
                </h3>

                {q.options.map((opt, j) => (
                  <label key={j} className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-green-200 mb-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`vikriti-${i}`}
                      onChange={() =>
                        handleChange("vikriti", i, opt.value)
                      }
                      className="accent-green-600"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white px-10 py-3 rounded-xl font-semibold shadow-lg"
          >
            Submit Assessment
          </button>
        </div>

        {(prakritiResult || vikritiResult) && (
          <div className="grid md:grid-cols-2 gap-6 mt-10">

            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <h3 className="font-bold text-green-700 mb-3">
                Prakriti %
              </h3>
              <p>Vata: {prakritiResult.vata}%</p>
              <p>Pitta: {prakritiResult.pitta}%</p>
              <p>Kapha: {prakritiResult.kapha}%</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <h3 className="font-bold text-green-700 mb-3">
                Vikriti %
              </h3>
              <p>Vata: {vikritiResult.vata}%</p>
              <p>Pitta: {vikritiResult.pitta}%</p>
              <p>Kapha: {vikritiResult.kapha}%</p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
