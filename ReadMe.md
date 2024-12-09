Getting Started
------------

To run the project, follow these steps:

### Step 1: Start the Development Server

In your terminal, navigate to the project directory and run the following command to start the development server:
```
npm run dev
```
This will start the server in development mode.

### Step 2: Set up Ngrok

To expose your local server to the internet, you'll need to use Ngrok. Run the following command to start Ngrok and tunnel requests from the specified URL to your local server on port 3000:
```
ngrok http --url=united-fully-gar.ngrok-free.app 3000
```
This will provide you with a public URL that you can use to access your application from outside your local network.