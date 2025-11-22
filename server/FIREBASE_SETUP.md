Secure Firebase service account setup

This project supports reading Firebase admin credentials from environment variables to avoid checking service account files into source control.

Recommended approaches

1) Use `FIREBASE_SERVICE_ACCOUNT_JSON` (preferred)
   - Base64-encode the JSON or put the raw JSON string into the environment variable.
   - Example (PowerShell) for a one-time session (unsafe to save to profile):

```powershell
# If you have the JSON file locally (not committed), load it and set env var for current session
$svcJson = Get-Content .\path\to\service-account.json -Raw
[Environment]::SetEnvironmentVariable('FIREBASE_SERVICE_ACCOUNT_JSON', $svcJson, 'Process')
# Run your server in the same session
npm run dev --prefix .\server
```

   - Example to set for the current user (persist across sessions):

```powershell
$svcJson = Get-Content C:\full\path\to\service-account.json -Raw
[Environment]::SetEnvironmentVariable('FIREBASE_SERVICE_ACCOUNT_JSON', $svcJson, 'User')
```

2) Use `FIREBASE_SERVICE_ACCOUNT_PATH`
   - Point to a file path outside the repository (ensure it's in `.gitignore`).
   - Example (PowerShell):

```powershell
[Environment]::SetEnvironmentVariable('FIREBASE_SERVICE_ACCOUNT_PATH', 'C:\secure\keys\service-account.json', 'User')
```

3) Alternative: Base64-encode the JSON and store in env var to avoid quoting issues

```powershell
# Encode and set for process
$bytes = [System.Text.Encoding]::UTF8.GetBytes((Get-Content .\service-account.json -Raw))
$encoded = [Convert]::ToBase64String($bytes)
[Environment]::SetEnvironmentVariable('FIREBASE_SERVICE_ACCOUNT_JSON_B64', $encoded, 'Process')
# Your app would need to decode this variable before initializing Firebase.
```

Security recommendations

- Rotate the service account key in the GCP console immediately if this key was ever committed or shared publicly.
- Do NOT commit service account JSON files to Git. Add them to `.gitignore` (this repo already ignores common patterns).
- Use a secret manager (GitHub Secrets, Azure Key Vault, AWS Secrets Manager, or GCP Secret Manager) for production deployments.

If you want, I can:
- Remove the checked-in service account file from the repository (using `git rm --cached`) and add a safe helper script to set the env var from a local file.
- Add decoding logic to support a `FIREBASE_SERVICE_ACCOUNT_JSON_B64` env var and update `server/src/config/firebase.js` to read it.
- Provide step-by-step commands to rotate the key in the GCP console.

Tell me which next step you'd like me to do and I'll proceed.
