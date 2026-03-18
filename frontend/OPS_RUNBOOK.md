
# Operations Runbook

## Deployment

The application is static and can be deployed to any static site host (Vercel, Netlify, AWS S3+CloudFront).

**Steps:**
1.  Run `npm run build`.
2.  Upload the contents of the `dist/` folder to the web root.
3.  Ensure the environment variable `API_KEY` (Gemini) is set in the build pipeline.

## Performance Monitoring

*   **Key Metric**: First Contentful Paint (FCP) should be < 1.5s.
*   **Optimization**: 
    *   Large assets (images) in `mockData` are currently external URLs. Ensure production assets are served via CDN.
    *   Code splitting is enabled by Vite default configuration.

## Incident Management

### Scenario 1: AI Analysis Failure
*   **Symptom**: Users see "AI Analysis unavailable" when uploading documents.
*   **Cause**: Google Gemini API key quota exceeded or invalid.
*   **Resolution**: 
    1.  Check Google Cloud Console quotas.
    2.  Rotate API Key in environment variables if compromised.
    3.  The app gracefully degrades (uploads still work without AI verification).

### Scenario 2: Clearance Status Sync Issues
*   **Symptom**: Students report status not changing after officer approval.
*   **Cause**: Backend API latency or caching issues.
*   **Resolution**:
    1.  Clear browser cache / Service Worker.
    2.  Check API logs for 5xx errors.

## Backup & Recovery
*   **Database**: Daily snapshots of the SQL database (Postgres recommended) at 02:00 WAT.
*   **Documents**: S3 Bucket with Versioning enabled. Deleted files are retained for 30 days.

## Emergency Contacts
*   **Lead Developer**: dev@lasustech.edu.ng
*   **Server Admin**: ops@lasustech.edu.ng
