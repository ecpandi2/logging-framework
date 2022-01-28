/* eslint-disable quotes */
const AWS = require("aws-sdk");
const cloudconfig = {
 apiVersion: "2014-03-28",
 region: "us-east-1", // replace with your region
};
const cloudwatchlogs = new AWS.CloudWatchLogs(cloudconfig);
function waitTime(milisec) {
 return new Promise((resolve) => {
 setTimeout(() => {
 resolve("");
 }, milisec);
 });
}

const describeExport = (taskId) => {
 const params = {
 taskId,
 };
 cloudwatchlogs.describeExportTasks(params, (err, data) => {
 if (err) {
 console.log("error for ");
 console.log(err);
 return "Fail";
 }
 if (data.code === "PENDING") {
 setTimeout(() => describeExport(taskId), 50000);
 }
 return "Success";
 });
};

const getLogs = (log) => new Promise((resolve, reject) => {
 console.log(log)
 console.log(log);
 const params = {
 destination: "dev-function-mysupply-backup1", // replace with your bucket name
 from: new Date().getTime() - 8640000,
 logGroupName: `/aws/lambda/notes-dev-${log}`,
 to: new Date().getTime(),
 destinationPrefix: `${log}`, // replace with random string used to give permisson on S3 bucket
 };
 cloudwatchlogs
 const tasksId = cloudwatchlogs
 .createExportTask(params)
 .promise()
 .then(async() => {
 .then(async () => {
 console.log(`data copied for ${log}`);
 await waitTime(30000)
 resolve();
 await waitTime(30000);
 resolve(tasksId);
 })
 .catch(async(e) => {
 .catch(async (e) => {
 console.log(e);
 console.log(`error in the copying data for ${log}`);
 await waitTime(30000)
 reject();
 await waitTime(30000);
 reject(tasksId);
 });
});
const exportLogs = async () => {

async function* generatorFunction() {
 const logs = [
 "createNotes",
 "createNotes1",
 "createNotes2",
 "createNotes3",
 "createNotes4",
  ];
 let count = 0;
 let flag = true;
 while (flag) {
 if (!logs[count]) {
 flag = false;
 break;
 }
 // eslint-disable-next-line no-await-in-loop
 const taskDetails = await getLogs(logs[count]);
 const getStatus = describeExport(taskDetails.taskId);
 console.log('getStatus ',getStatus);
 yield count++;
 }
}

const exportLogs = async () => {
 try {
// await Promise.all(logs.map(async (log) => limit(() => getLogs(log))));
 for await (const data of generatorFunction()) {
 console.log(data, 'getStatus');
 }
 console.log("all done");
 // return DataResponse({
 // message: "Success",
 // data: {},
 // });
 } catch (e) {
 console.log("in catch block");
 console.log(e);
 // return DataResponse({
 // message: "Error",
 // data: {},
 // });
 }
};

module.exports = {
 exportLogs
};