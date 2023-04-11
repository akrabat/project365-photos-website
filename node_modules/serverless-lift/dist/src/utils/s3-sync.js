"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var s3_sync_exports = {};
__export(s3_sync_exports, {
  computeS3ETag: () => computeS3ETag,
  s3Put: () => s3Put,
  s3Sync: () => s3Sync
});
module.exports = __toCommonJS(s3_sync_exports);
var fs = __toESM(require("fs"));
var util = __toESM(require("util"));
var path = __toESM(require("path"));
var crypto = __toESM(require("crypto"));
var import_mime_types = require("mime-types");
var import_lodash = require("lodash");
var import_error = __toESM(require("./error"));
var import_logger = require("./logger");
const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);
async function s3Sync({
  aws,
  localPath,
  targetPathPrefix,
  bucketName
}) {
  let hasChanges = false;
  let fileChangeCount = 0;
  const filesToUpload = await listFilesRecursively(localPath);
  const existingS3Objects = await s3ListAll(aws, bucketName, targetPathPrefix);
  let skippedFiles = 0;
  for (const batch of (0, import_lodash.chunk)(filesToUpload, 2)) {
    await Promise.all(
      batch.map(async (file) => {
        const targetKey = targetPathPrefix !== void 0 ? path.posix.join(targetPathPrefix, file) : file;
        const fileContent = fs.readFileSync(path.posix.join(localPath, file));
        if (targetKey in existingS3Objects) {
          const existingObject = existingS3Objects[targetKey];
          const etag = computeS3ETag(fileContent);
          if (etag === existingObject.ETag) {
            skippedFiles++;
            return;
          }
        }
        (0, import_logger.getUtils)().log.verbose(`Uploading ${file}`);
        await s3Put(aws, bucketName, targetKey, fileContent);
        hasChanges = true;
        fileChangeCount++;
      })
    );
  }
  if (skippedFiles > 0) {
    (0, import_logger.getUtils)().log.verbose(`Skipped uploading ${skippedFiles} unchanged files`);
  }
  const targetKeys = filesToUpload.map(
    (file) => targetPathPrefix !== void 0 ? path.posix.join(targetPathPrefix, file) : file
  );
  const keysToDelete = findKeysToDelete(Object.keys(existingS3Objects), targetKeys);
  if (keysToDelete.length > 0) {
    keysToDelete.map((key) => {
      (0, import_logger.getUtils)().log.verbose(`Deleting ${key}`);
      fileChangeCount++;
    });
    await s3Delete(aws, bucketName, keysToDelete);
    hasChanges = true;
  }
  return { hasChanges, fileChangeCount };
}
async function listFilesRecursively(directory) {
  const items = await readdir(directory);
  const files = await Promise.all(
    items.map(async (fileName) => {
      const fullPath = path.posix.join(directory, fileName);
      const fileStat = await stat(fullPath);
      if (fileStat.isFile()) {
        return [fileName];
      } else if (fileStat.isDirectory()) {
        const subFiles = await listFilesRecursively(fullPath);
        return subFiles.map((subFileName) => path.posix.join(fileName, subFileName));
      }
      return [];
    })
  );
  return (0, import_lodash.flatten)(files);
}
async function s3ListAll(aws, bucketName, pathPrefix) {
  var _a;
  let result;
  let continuationToken = void 0;
  const objects = {};
  do {
    result = await aws.request("S3", "listObjectsV2", {
      Bucket: bucketName,
      Prefix: pathPrefix,
      MaxKeys: 1e3,
      ContinuationToken: continuationToken
    });
    ((_a = result.Contents) != null ? _a : []).forEach((object) => {
      if (object.Key === void 0) {
        return;
      }
      objects[object.Key] = object;
    });
    continuationToken = result.NextContinuationToken;
  } while (result.IsTruncated === true);
  return objects;
}
function findKeysToDelete(existing, target) {
  return existing.filter((key) => target.indexOf(key) === -1);
}
async function s3Put(aws, bucket, key, fileContent) {
  let contentType = (0, import_mime_types.lookup)(key);
  if (contentType === false) {
    contentType = "application/octet-stream";
  }
  await aws.request("S3", "putObject", {
    Bucket: bucket,
    Key: key,
    Body: fileContent,
    ContentType: contentType
  });
}
async function s3Delete(aws, bucket, keys) {
  const response = await aws.request("S3", "deleteObjects", {
    Bucket: bucket,
    Delete: {
      Objects: keys.map((key) => {
        return {
          Key: key
        };
      })
    }
  });
  if (response.Errors !== void 0 && response.Errors.length !== 0) {
    response.Errors.forEach((error) => console.log(error));
    throw new import_error.default(
      `Unable to delete some files in S3. The "static-website" and "server-side-website" construct require the s3:DeleteObject IAM permissions to synchronize files to S3, is it missing from your deployment policy?`,
      "LIFT_S3_DELETE_OBJECTS_FAILURE"
    );
  }
}
function computeS3ETag(fileContent) {
  return `"${crypto.createHash("md5").update(fileContent).digest("hex")}"`;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  computeS3ETag,
  s3Put,
  s3Sync
});
//# sourceMappingURL=s3-sync.js.map
