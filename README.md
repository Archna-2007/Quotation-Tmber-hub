# Timber Hub Quotation Tool

A web-based quotation generation system with a local dashboard that saves data to Google Sheets.

## Project Structure

```
quotation/
├── backend/
│   └── script.gs          (Google Apps Script backend)
├── frontend/
│   └── index.html         (Web tool frontend)
└── README.md              (This file)
```

## Setup Instructions

### 1. Backend Setup (Google Apps Script)

1. Open your `2026 Template 2.xlsx` file in Google Drive and save it as a **Google Sheet**
2. In the Google Sheet, go to **Extensions > Apps Script**
3. Delete any existing code in the editor and paste the contents from `backend/script.gs`
4. Click **Deploy > New deployment**
5. Set the type to **Web app**
6. In the "Execute as" dropdown, select **Me**
7. Set "Who has access" to **Anyone**
8. Click **Deploy**. Copy the **Web app URL** provided. You'll need this for the frontend.
9. **Important**: If you ever make changes to `script.gs`, you must re-deploy by going to **Deploy > Manage deployments**, editing your deployment, and creating a **New version**.

### 2. Frontend Setup

1. Open `frontend/index.html`
2. Find the line containing `fetch('https://script.google.com/macros/s/...'`
3. Replace the existing Google Script URL with the **Web app URL** you copied from the backend setup.
4. Open the HTML file in a browser to use the quotation tool

## Features

- Add multiple items with size, length, pieces, and price
- Automatic calculation of total length and total price
- Save quotations directly to Google Sheets
- Live preview of the quotation document
- Edit and delete items after they are added
- Export quotation as a JPG image
- Clean, responsive UI for data entry and preview

## Next Steps

- Test the connection between frontend and backend
- Enhance styling and add a company logo (optional)