import express from "express";
import bodyParser from "body-parser";
import processIP from "./ip-data.js";

const PORT = 6774;

const BYTE_LIMIT = 2048;
const PERMITTED_FIELDS = new Set([
  "local_time",
  "timezone_offset",
  "user_token",

  "ip_hash",
  "ip_salt_hash",
  "ip_country",
  "server_time",

  "device_os",
  "device_os_version",
  "app_version",

  "action",
  "surface",
  "course",
  "metadata_version",
  "lesson",
  "position",
  "setting_value",
]);

const app = express();
app.use(bodyParser.json({ limit: BYTE_LIMIT }));
app.enable("trust proxy");

app.post("/log", async (req, res) => {
  const ipData = await processIP(req.ip);
  const allData = {
    ...req.body,
    ...ipData,
    server_time: +new Date(),
  };

  if (!Object.keys(allData).every((field) => PERMITTED_FIELDS.has(field))) {
    res.status(400).send();
    return;
  }

  res.status(200).send();
});

app.listen(PORT);