"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var aws_exports = {};
__export(aws_exports, {
  DatabaseDynamoDBSingleTable: () => import_DatabaseDynamoDBSingleTable.DatabaseDynamoDBSingleTable,
  Queue: () => import_Queue.Queue,
  ServerSideWebsite: () => import_ServerSideWebsite.ServerSideWebsite,
  SinglePageApp: () => import_SinglePageApp.SinglePageApp,
  StaticWebsite: () => import_StaticWebsite.StaticWebsite,
  Storage: () => import_Storage.Storage,
  Vpc: () => import_Vpc.Vpc,
  Webhook: () => import_Webhook.Webhook
});
module.exports = __toCommonJS(aws_exports);
var import_DatabaseDynamoDBSingleTable = require("./DatabaseDynamoDBSingleTable");
var import_Queue = require("./Queue");
var import_SinglePageApp = require("./SinglePageApp");
var import_StaticWebsite = require("./StaticWebsite");
var import_Storage = require("./Storage");
var import_Vpc = require("./Vpc");
var import_Webhook = require("./Webhook");
var import_ServerSideWebsite = require("./ServerSideWebsite");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DatabaseDynamoDBSingleTable,
  Queue,
  ServerSideWebsite,
  SinglePageApp,
  StaticWebsite,
  Storage,
  Vpc,
  Webhook
});
//# sourceMappingURL=index.js.map
