# Google OAuth 2.0 Node.js Example

This is a simple Node.js application demonstrating the OAuth 2.0 Authorization Code Flow to authenticate users with Google and retrieve their profile information. The app uses Express.js for routing, Axios for HTTP requests, and Node's `crypto` module for generating secure random values. It does not rely on Passport.js or other heavy frameworks.

## Prerequisites
- **Node.js** (v14 or higher recommended)
- **Google Cloud Console** account with OAuth 2.0 credentials set up
- A registered redirect URI (e.g., `http://localhost:3000/callback`)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/waleed21121/OAuth-implementation.git
cd OAuth-implementation
```

### 2. Install Dependencies
Install the required Node.js packages:
```bash
npm install
```
Dependencies:
- `express`: Web server framework
- `axios`: HTTP client for API requests
- `dotenv`: Environment variable management
- `crypto`: Built-in Node.js module for secure random values

### 3. Configure Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com).
2. Create a new project or select an existing one.
3. Navigate to **APIs & Services** > **Library**, and enable the **Google People API** (or other APIs you need).
4. Go to **APIs & Services** > **Credentials** > **Create Credentials** > **OAuth 2.0 Client IDs**.
   - Choose **Web application** as the application type.
   - Set **Authorized redirect URIs** to `http://localhost:3000/callback` (or your production URI).
   - Save and note the `Client ID` and `Client Secret`.
5. Configure the OAuth consent screen under **APIs & Services** > **OAuth consent screen**:
   - Select **External** user type.
   - Add required scopes (e.g., `email`, `profile`, `openid`).
   - Complete the setup steps.

### 4. Set Up Environment Variables
Create a `.env` file in the project root with the following:
```env
CLIENT_ID=your-google-client-id
CLIENT_SECRET=your-google-client-secret
REDIRECT_URI=http://localhost:3000/callback
AUTHORIZATION_ENDPOINT=https://accounts.google.com/o/oauth2/v2/auth
TOKEN_ENDPOINT=https://oauth2.googleapis.com/token
RESOURCE_ENDPOINT=https://www.googleapis.com/oauth2/v3/userinfo
```
Replace `your-google-client-id` and `your-google-client-secret` with the values from Google Cloud Console.

### 5. Run the Application
Start the server:
```bash
node app.js
```
The app will be available at `http://localhost:3000`.

## Usage
1. Open `http://localhost:3000/auth` in your browser.
2. Click **Login with Google** to start the OAuth flow.
3. Sign in with your Google account and grant permissions.
4. You’ll be redirected to `/callback`, where the app exchanges the authorization code for an access token and fetches user profile data.
5. The user’s profile information (e.g., name, email) will be displayed.

## Code Overview
- **`/auth` Route**:
  - Generates a random `state` for CSRF protection.
  - Constructs the Google authorization URL with `client_id`, `redirect_uri`, `scope`, and `state`.
  - Renders a link to initiate the OAuth flow.
- **`/callback` Route**:
  - Handles the redirect from Google with the authorization `code` and `state`.
  - Exchanges the `code` for an access token using the token endpoint.
  - Uses the access token to fetch user data from the resource endpoint.
  - Displays the user data or an error if the flow fails.
- **Environment Variables**:
  - Loaded via `dotenv` to securely manage sensitive credentials.
- **Error Handling**:
  - Checks for errors in the callback (e.g., `access_denied`).
  - Catches