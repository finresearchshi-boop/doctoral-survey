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
  const hiddenFrame = document.getElementById("hidden_iframe");
  const steps = Array.from(document.querySelectorAll("[data-step]"));
  const progressSteps = Array.from(document.querySelectorAll("[data-progress-step]"));
  let currentStep = 1;
  let hasSubmitted = false;

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

  function clearHiddenFields() {
    form.querySelectorAll("[data-google-field='true']").forEach((node) => node.remove());
  }

  function appendHiddenField(name, value) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    input.setAttribute("data-google-field", "true");
    form.appendChild(input);
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
    currentStep = stepNumber;

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
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  if (backButton) {
    backButton.addEventListener("click", function () {
      clearError();
      setStep(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  form.addEventListener("submit", function (event) {
    clearError();

    if (!isConfigured) {
      event.preventDefault();
      showError("Update survey-config.js with your Google Form ID and entry IDs before publishing.");
      return;
    }

    if (!form.reportValidity()) {
      event.preventDefault();
      showError("Please complete the required questions before submitting.");
      return;
    }

    clearHiddenFields();

    const data = new FormData(form);
    appendHiddenField(fields.consent, data.get("consent") ? "I consent" : "");
    appendHiddenField(fields.phdStage, data.get("phdStage") || "");
    appendHiddenField(fields.gender, data.get("gender") || "");
    appendHiddenField(fields.studyMode, data.get("studyMode") || "");
    appendHiddenField(fields.fundingStatus, data.get("fundingStatus") || "");
    appendHiddenField(fields.fundingIssues, data.get("fundingIssues") || "");
    appendHiddenField(fields.abroadPlans, data.get("abroadPlans") || "");
    appendHiddenField(fields.conferenceSupport, data.get("conferenceSupport") || "");
    appendHiddenField(fields.careerPlans, data.get("careerPlans") || "");
    appendHiddenField(fields.supportImportant, data.get("supportImportant") || "");
    appendHiddenField(fields.supervisorRelationship, data.get("supervisorRelationship") || "");
    appendHiddenField(fields.supportChanged, data.get("supportChanged") || "");
    appendHiddenField(fields.institutionalSupport, data.get("institutionalSupport") || "");
    appendHiddenField(fields.researchCulture, data.get("researchCulture") || "");
    appendHiddenField(fields.biggestChallenges, data.get("biggestChallenges") || "");
    appendHiddenField(fields.wellbeingBalance, data.get("wellbeingBalance") || "");
    appendHiddenField(fields.successFactors, data.get("successFactors") || "");
    appendHiddenField(fields.aiImpact, data.get("aiImpact") || "");
    appendHiddenField(fields.adviceNewStudent, data.get("adviceNewStudent") || "");
    hasSubmitted = true;
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
  });

  hiddenFrame.addEventListener("load", function () {
    if (!isConfigured || !hasSubmitted) {
      return;
    }

    form.reset();
    window.location.href = thankYouUrl;
  });

  setStep(1);
})();
