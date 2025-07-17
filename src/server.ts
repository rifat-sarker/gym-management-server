import app from "./app";
import config from "./app/config";


const main = async () => {
  try {
    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    console.log("Error connecting to the server", error);
  }
};

main();
