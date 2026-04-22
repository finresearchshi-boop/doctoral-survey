(function () {
  const config = window.SURVEY_CONFIG || {};
  const form = document.getElementById("survey-form");
  const setupNotice = document.getElementById("setup-notice");
  const errorBox = document.getElementById("form-error");
  const nextButton = document.getElementById("next-step");
  const backButton = document.getElementById("back-step");
  const submitButton = document.getElementById("submit-button");
  const title = document.getElementById("survey-title");
  const description = document.getElementById("survey-description");
  const mainHeading = document.getElementById("main-heading");
  const backgroundHeading = document.getElementById("background-heading");
  const steps = Array.from(document.querySelectorAll("[data-step]"));
  const progressSteps = Array.from(document.querySelectorAll("[data-progress-step]"));

  const requiredMappings = [
    "consent",
    "phdStage",
    "gender",
    "studyMode",
    "fundingStatus",
    "fundingIssues",
    "abroadPlans",
    "conferenceSupport",
    "careerPlans",
    "supportImportant",
    "supervisorRelationship",
    "supportChanged",
    "institutionalSupport",
    "researchCulture",
    "biggestChallenges",
    "wellbeingBalance",
    "successFactors",
    "aiImpact",
    "adviceNewStudent"
  ];

  const googleForm = config.googleForm || {};
  const fields = googleForm.fields || {};
  const survey = config.survey || {};
  const thankYouUrl = survey.thankYouUrl || "thank-you.html";
  const isConfigured =
    googleForm.formId &&
    googleForm.formId !== "YOUR_FORM_ID" &&
    requiredMappings.every((key) => typeof fields[key] === "string" && fields[key].startsWith("entry."));

  if (survey.title) {
    title.textContent = survey.title;
    document.title = survey.title;
  }

  if (survey.description) {
    description.textContent = survey.description;
  }

  if (!isConfigured) {
    setupNotice.classList.remove("hidden");
    if (nextButton) {
      nextButton.disabled = true;
    }
    if (submitButton) {
      submitButton.disabled = true;
    }
  } else {
    form.action = `https://docs.google.com/forms/d/e/${googleForm.formId}/formResponse`;
  }

  function showError(message) {
    errorBox.textContent = message;
    errorBox.classList.remove("hidden");
  }

  function clearError() {
    errorBox.textContent = "";
    errorBox.classList.add("hidden");
  }

  function setStep(stepNumber) {
    steps.forEach(function (step) {
      const isActive = Number(step.dataset.step) === stepNumber;
      step.hidden = !isActive;
      step.classList.toggle("is-active", isActive);
    });

    progressSteps.forEach(function (step) {
      step.classList.toggle("is-active", Number(step.dataset.progressStep) === stepNumber);
    });
  }

  function validateStep(stepNumber) {
    const step = steps.find(function (candidate) {
      return Number(candidate.dataset.step) === stepNumber;
    });

    if (!step) {
      return true;
    }

    const requiredFields = Array.from(step.querySelectorAll("[required]"));

    for (const field of requiredFields) {
      if (!field.checkValidity()) {
        field.reportValidity();
        return false;
      }
    }

    return true;
  }

  if (nextButton) {
    nextButton.addEventListener("click", function () {
      clearError();

      if (!validateStep(1)) {
        showError("Please complete the required background questions before continuing.");
        return;
      }

      setStep(2);
      if (mainHeading) {
        mainHeading.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  if (backButton) {
    backButton.addEventListener("click", function () {
      clearError();
      setStep(1);
      if (backgroundHeading) {
        backgroundHeading.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  form.addEventListener("submit", function (event) {
    async function submitSurvey() {
      clearError();

      if (!isConfigured) {
        showError("Update survey-config.js with your Google Form ID and entry IDs before publishing.");
        return;
      }

      if (!form.reportValidity()) {
        showError("Please complete the required questions before submitting.");
        return;
      }

      submitButton.disabled = true;
      submitButton.textContent = "Sending...";

      const data = new FormData(form);
      const payload = new URLSearchParams();

      payload.append(fields.consent, data.get("consent") ? "I consent" : "");
      payload.append(fields.phdStage, data.get("phdStage") || "");
      payload.append(fields.gender, data.get("gender") || "");
      payload.append(fields.studyMode, data.get("studyMode") || "");
      payload.append(fields.fundingStatus, data.get("fundingStatus") || "");
      payload.append(fields.fundingIssues, data.get("fundingIssues") || "");
      payload.append(fields.abroadPlans, data.get("abroadPlans") || "");
      payload.append(fields.conferenceSupport, data.get("conferenceSupport") || "");
      payload.append(fields.careerPlans, data.get("careerPlans") || "");
      payload.append(fields.supportImportant, data.get("supportImportant") || "");
      payload.append(fields.supervisorRelationship, data.get("supervisorRelationship") || "");
      payload.append(fields.supportChanged, data.get("supportChanged") || "");
      payload.append(fields.institutionalSupport, data.get("institutionalSupport") || "");
      payload.append(fields.researchCulture, data.get("researchCulture") || "");
      payload.append(fields.biggestChallenges, data.get("biggestChallenges") || "");
      payload.append(fields.wellbeingBalance, data.get("wellbeingBalance") || "");
      payload.append(fields.successFactors, data.get("successFactors") || "");
      payload.append(fields.aiImpact, data.get("aiImpact") || "");
      payload.append(fields.adviceNewStudent, data.get("adviceNewStudent") || "");

      try {
        await fetch(form.action, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
          },
          body: payload.toString()
        });

        form.reset();
        window.location.href = thankYouUrl;
      } catch (error) {
        submitButton.disabled = false;
        submitButton.textContent = "Submit survey";
        showError("The survey could not be submitted. Please try again.");
      }
    }

    clearError();
    event.preventDefault();
    submitSurvey();
  });

  setStep(1);
})();
