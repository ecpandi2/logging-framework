"use strict";
let log = require("./lib/logger");
const AWS = require("aws-sdk");
const cloudconfig = {
  apiVersion: "2014-03-28",
  region: "us-east-1", // replace with your region
};

const cloudwatchlogs = new AWS.CloudWatchLogs(cloudconfig);

const response = (statusCode, message) => {
  return {
    statusCode,
    body: JSON.stringify(message)
  };
};

module.exports.createNotes = async event => {
  let data = JSON.parse(event.body);
  try {
    // create note database call
    //throw new Error("Too many connections to database");
    log({
      type: "INFO",
//      message: e.message,
//      callstack: e.stack,
      payload: data
    });
    return response(201, data);
   } catch (e) {
    log({
      type: "CRITICAL",
      message: e.message,
      callstack: e.stack,
      payload: data
    });
    return response(500, e);
  }
};

module.exports.getNotesById = async event => {
  const noteId = event.pathParameters.id;

  // get notes database call
  const queryTime = 500;
  if (queryTime > 100) {
    log({
      type: "WARNING",
      message: `Query time ${queryTime} is longer than accepted 100ms`,
      payload: `Note Id: ${noteId}`
    });
  }
  return response(200, ["note1", "note2", "note3"]);
};


module.exports.exportLogs = async (event, context) => {
//  const params = {
//    destination: "dev-function-mysupply-backup1", // replace with your bucket name
//    from: new Date().getTime() - 8640000,
//    logGroupName: "/aws/lambda/notes-dev-createNotes",
//    to: new Date().getTime(),
//    destinationPrefix: "notes-dev-createNotes", // replace with random string used to give permisson on S3 bucket
//  };
//  await cloudwatchlogs
//    .createExportTask(params)
//    .promise()
//    .then((data) => {
//      console.log(data);
//      return response({
//        statusCode: 200,
//        body: data,
//      });
//  })
//    .catch((err) => {
//      console.error(err);
//      return response({
//        statusCode: 501,
//        body: err,
//      });
//    });
//};

const logs = ['notes-dev-createNotes', 'notes-dev-getNoteById'];
try {
  await Promise.all(
    logs.map(async (log) => {
      const params = {
        destination: 'dev-function-mysupply-backup1', // replace with your bucket name
        from: new Date().getTime() - 8640000,
        logGroupName: `/aws/lambda/${log}`,
        to: new Date().getTime(),
        destinationPrefix: `${log}`, // replace with random string used to give permisson on S3 bucket
      };
      await cloudwatchlogs
        .createExportTask(params)
        .promise()
        .then((data) => {
          console.log(`data copied for ${log}`);
          console.log(data);
        })
        .catch((err) => {
          console.log(`error in the copying data for ${log}`);
          console.log(err);
        });
    }),
  );
  return DataResponse({
    message: 'Success',
    data: {},
  });
} catch (e) {
  console.log('in catch block');
  console.log(e);
}
}