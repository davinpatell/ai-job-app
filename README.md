AI Job App — Deliverable ZIP

This archive contains a ready-to-review project scaffold for an AI-enabled iOS job posting app and Node backend.

What’s included:
- ios/: SwiftUI app scaffold (App entry + placeholder views)
- backend/: Node/Express server with LLM endpoints, Dockerfile, migrations, and package.json
- fastlane/: Fastlane config to build and upload to TestFlight (requires secrets)
- .github/: CI workflows for iOS (fastlane) and backend (migrations)

Important limitations:
- I cannot sign or publish iOS apps on your behalf. To produce an installable IPA or submit to the App Store you must provide Apple credentials / certificates and run the fastlane lanes or configure CI with secrets.
- I cannot run the backend in production for you. You must deploy the backend (Docker/Render/Vercel) and set environment variables (OPENAI_API_KEY, DATABASE_URL, etc).
- For production use, follow privacy, security, and licensing guidance in the project notes.

Next steps (recommended):
1. Add GitHub secrets (GSI_PLIST_BASE64, DATABASE_URL, OPENAI_API_KEY, SUPABASE_SERVICE_ROLE, MATCH_PASSWORD, ASC_KEY_ID/ISSUER/CONTENT).
2. Push this repo to GitHub and open a Pull Request from feat/fastlane-ci branch.
3. Run migrations on a staging DB and test endpoints locally.
4. Use fastlane to upload a TestFlight build.

If you want I can now:
- Create a zip (done) and provide a download link.
- Walk you through any step (deployment, CI, App Store submission).
