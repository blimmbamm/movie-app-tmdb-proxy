import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

let port = 3001;

if(process.env.PORT) {
  port = process.env.PORT;
}

const app = express();

// app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

app.post("/", async (req, res, next) => {
  
  const { url: basisUrl, method, searchParams, body } = req.body;

  let url;
  let response;

  // Check if URL is valid:
  try {
    url = new URL(basisUrl);
  } catch (error) {
    console.log(error);
    error.code = 400;
    error.message = "invalid url";
    return next(error);
  }

  // check if searchParams have correct structure (= js object)
  try {
    for (const key in searchParams) {
      url.searchParams.append(key, searchParams[key]);
    }
  } catch (error) {
    error.code = 400;
    error.message = "invalid search params";
    return next(error);
  }

  
  url.searchParams.append("api_key", process.env.API_KEY);

  // Try to fetch:
  try {
    response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });   
  } catch (error) {
    // if not successful (e.g. if tmdb is down), forward error 500 to default error handling middleware:    
    console.log(error);
    // error.status = 500;
    return next(error);
  }

  // if request is successful but response is not ok, forward to default error handling middleware with error code provided by tmdb:
  if (!response.ok) {
    const error = new Error();
    error.status = response.status;
    return next(error);
  }

  const responseData = await response.json();

  return res.json(responseData);
});

app.use((error, req, res, next) => {
  res.status(error.status).json({ message: error.message, status: error.code });
});

// not supported endpoints:
app.use((req, res) => {
  res.status(404).json(null);
});

app.listen(port);
