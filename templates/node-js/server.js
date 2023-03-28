const mongoose = require('mongoose');
const dotenv = require('dotenv');

//below code will show error when we console.log any varible that is not declared
process.on('uncaughtException', (err) => {
  console.log('unhandle exception process shutting down');
  console.log(err.name, err.message);

  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

// for hosted database
// const DB = process.env.DATABASE_HOST.replace(
//   '<password>',
//   process.env.DATABASE_PASSWORD
// );

// mongoose
//   .connect(DB, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//   })
//   .then((con) => {
//     console.log('DB connenction successful');
//   });

// for local mongoose setup
mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    console.log('DB connenction successful');
  });

const port = process.env.PORT || 4000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on('unhandleRejection', (err) => {
  console.log('unhandle rejection process shutting down');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
