# GitHub Pages Survey With Google Forms

This folder contains a static survey site you can publish on GitHub Pages. The page itself is pure HTML, CSS, and JavaScript, and submissions are posted into a Google Form.

## Files

- `index.html`: the survey page
- `styles.css`: page styling
- `script.js`: submission logic
- `survey-config.js`: where you add your Google Form ID and field IDs

## How it works

GitHub Pages hosts the survey page. When a participant clicks **Submit feedback**, the form posts to your Google Form endpoint:

`https://docs.google.com/forms/d/e/FORM_ID/formResponse`

Responses are then stored in Google Forms and can also be viewed in a linked Google Sheet.

## Step 1: Create the Google Form

Create a Google Form with questions that match the page:

1. Consent checkbox
2. PhD stage or completion stage
3. Gender
4. Full-time or part-time PhD
5. What kinds of support were most important during the PhD
6. Relationship with supervisor(s)
7. Whether support needs changed across PhD stages
8. Institutional or departmental support
9. Research culture or sense of community
10. Biggest challenges and how they were managed
11. Wellbeing and work-life balance
12. Key factors contributing to a successful PhD experience
13. Whether AI tools are changing doctoral learning, independence, or supervision
14. One piece of advice for a new PhD student

You can change the wording in `index.html` if you want the page to match a different survey.

## Step 2: Get your Google Form ID

Open the live form and look at the URL. It will look similar to:

`https://docs.google.com/forms/d/e/1FAIpQLSdExample1234567890/viewform`

Copy the long ID between `/d/e/` and `/viewform`, then paste it into `survey-config.js` as `formId`.

## Step 3: Get each `entry.*` field ID

The easiest method is to use a pre-filled link:

1. Open your Google Form.
2. Click the three-dot menu.
3. Choose **Get pre-filled link**.
4. Enter any sample values and click **Get link**.
5. Copy the generated URL.

The generated URL will contain parameters like:

`entry.123456789=Yes&entry.987654321=Student`

Each `entry.#########` value is the field ID you need. Put those IDs into `survey-config.js`.

## Step 4: Update `survey-config.js`

Replace the placeholder values:

```js
window.SURVEY_CONFIG = {
  survey: {
    title: "Participant Feedback Survey",
    description: "Thank you for taking part."
  },
  googleForm: {
    formId: "YOUR_REAL_FORM_ID",
    fields: {
      consent: "entry.1234567890",
      phdStage: "entry.2345678901",
      gender: "entry.3456789012",
      studyMode: "entry.4567890123",
      supportImportant: "entry.5678901234",
      supervisorRelationship: "entry.6789012345",
      supportChanged: "entry.7890123456",
      institutionalSupport: "entry.8901234567",
      researchCulture: "entry.9012345678",
      biggestChallenges: "entry.1122334455",
      wellbeingBalance: "entry.2233445566",
      successFactors: "entry.3344556677",
      aiImpact: "entry.4455667788",
      adviceNewStudent: "entry.5566778899"
    }
  }
};
```

## Step 5: Publish on GitHub Pages

1. Create a GitHub repository.
2. Upload these files to the repository root.
3. In GitHub, open **Settings** > **Pages**.
4. Under **Build and deployment**, choose your branch and set the folder to `/ (root)`.
5. Save.

GitHub will give you a public URL like:

`https://your-username.github.io/your-repository-name/`

## Step 6: Collect responses

In Google Forms:

1. Open the **Responses** tab.
2. Click the green Sheets icon if you want responses in Google Sheets.

## Notes

- This is a static site, so GitHub Pages does not store anything itself.
- Google Forms may change its internal field structure in the future. If submissions stop working, refresh the `entry.*` IDs from a new pre-filled link.
- If you want a more robust setup later, moving to Google Apps Script, Airtable, Supabase, or Firebase gives you more control.
