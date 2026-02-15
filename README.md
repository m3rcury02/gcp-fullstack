* **Live URLs**

  * Web: `https://cg-web-159916856720.asia-south1.run.app`
  * API: `https://cg-api-159916856720.asia-south1.run.app`
* **Architecture**

  * Next.js (TS) → Cloud Run API (Node/Express TS) → Firestore
  * CI/CD: GitHub Actions (OIDC/WIF) → Artifact Registry → Cloud Run
* **How to run locally**

  * `gcloud auth application-default login`
  * `npm run dev` steps
* **Endpoints**

  * `GET /health`, `GET /tasks`, `POST /tasks`
* **Security note**

  * Cloud Run service account for Firestore
  * WIF instead of JSON keys for CI/CD
