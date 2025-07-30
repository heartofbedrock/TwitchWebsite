# Twitch Bits Bottle Caps Overlay

This project provides a simple web overlay that listens for Twitch Bits events and animates bottle caps dropping to celebrate donations.

## Setup

1. **Create a Twitch Application**
   - Go to <https://dev.twitch.tv/console/apps> and create an app.
   - Note the **Client ID** and **Client Secret**.
   - Add `http://localhost` as a valid redirect URI.

2. **Generate an OAuth Token**
   - Request a user token with the `bits:read` scope. You can use the [Twitch Token Generator](https://twitchtokengenerator.com/) or your own OAuth flow.
   - The final token should be in the form `oauth:xxxxxxxxxxxx`.
   - Obtain your numeric channel ID from <https://api.twitch.tv/helix/users?login=YOUR_USERNAME> using your Client ID.

3. **Configure `main.js`**
   - Open `main.js` and replace the placeholders `YOUR_CLIENT_ID`, `YOUR_OAUTH_TOKEN`, and `YOUR_CHANNEL_ID` with the values from above.

4. **Run Locally**
   - Serve the files with any static server. For example:
     ```bash
     npx http-server .
     ```
   - Open the served `index.html` in your browser or use the URL as an OBS Browser Source.

5. **Resetting**
   - Click the **Reset** button after reaching the goal to clear the overlay and begin counting again.

## Dependencies

- [canvas-confetti](https://www.npmjs.com/package/canvas-confetti) (loaded from CDN) for the celebration effect.
- No build step is required; all files are plain HTML/CSS/JS.

## Notes

- This overlay connects directly to Twitch PubSub from the browser. Ensure your OAuth token is kept secret.
- The overlay is responsive and should work in OBS Browser Source or any modern browser.
