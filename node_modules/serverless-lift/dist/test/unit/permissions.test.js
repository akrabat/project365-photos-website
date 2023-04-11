"use strict";
var import_lodash = require("lodash");
var import_runServerless = require("../utils/runServerless");
function expectLiftStorageStatementIsAdded(cfTemplate) {
  expect((0, import_lodash.get)(cfTemplate.Resources.IamRoleLambdaExecution, "Properties.Policies[0].PolicyDocument.Statement")).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        Effect: "Allow",
        Action: ["s3:PutObject", "s3:GetObject", "s3:DeleteObject", "s3:ListBucket"]
      })
    ])
  );
}
function expectUserDynamoStatementIsAdded(cfTemplate) {
  expect(
    (0, import_lodash.get)(cfTemplate.Resources.IamRoleLambdaExecution, "Properties.Policies[0].PolicyDocument.Statement")
  ).toContainEqual({
    Effect: "Allow",
    Action: ["dynamodb:PutItem"],
    Resource: "arn:aws:dynamodb:us-east-1:123456789012:table/myDynamoDBTable"
  });
}
describe("permissions", () => {
  it("should not override user-defined role", async () => {
    const { cfTemplate } = await (0, import_runServerless.runServerless)({
      fixture: "permissions",
      configExt: (0, import_lodash.merge)({}, import_runServerless.pluginConfigExt, {
        provider: {
          iam: {
            role: "arn:aws:iam::123456789012:role/role"
          }
        }
      }),
      command: "package"
    });
    expect(cfTemplate.Resources.FooLambdaFunction).toMatchObject({
      Properties: {
        Role: "arn:aws:iam::123456789012:role/role"
      }
    });
  });
  it("should append permissions when using iam.role.statements", async () => {
    const { cfTemplate } = await (0, import_runServerless.runServerless)({
      fixture: "permissions",
      configExt: (0, import_lodash.merge)({}, import_runServerless.pluginConfigExt, {
        provider: {
          iam: {
            role: {
              statements: [
                {
                  Effect: "Allow",
                  Action: ["dynamodb:PutItem"],
                  Resource: "arn:aws:dynamodb:us-east-1:123456789012:table/myDynamoDBTable"
                }
              ]
            }
          }
        }
      }),
      command: "package"
    });
    expectUserDynamoStatementIsAdded(cfTemplate);
    expectLiftStorageStatementIsAdded(cfTemplate);
  });
  it("should append permissions when using the deprecated iamRoleStatements", async () => {
    const { cfTemplate } = await (0, import_runServerless.runServerless)({
      fixture: "permissions",
      configExt: (0, import_lodash.merge)({}, import_runServerless.pluginConfigExt, {
        provider: {
          iamRoleStatements: [
            {
              Effect: "Allow",
              Action: ["dynamodb:PutItem"],
              Resource: "arn:aws:dynamodb:us-east-1:123456789012:table/myDynamoDBTable"
            }
          ]
        }
      }),
      command: "package"
    });
    expectUserDynamoStatementIsAdded(cfTemplate);
    expectLiftStorageStatementIsAdded(cfTemplate);
  });
  it("should add permissions when no custom statements are provided", async () => {
    const { cfTemplate } = await (0, import_runServerless.runServerless)({
      fixture: "permissions",
      configExt: import_runServerless.pluginConfigExt,
      command: "package"
    });
    expectLiftStorageStatementIsAdded(cfTemplate);
  });
  it("should be possible to disable automatic permissions", async () => {
    const { cfTemplate } = await (0, import_runServerless.runServerless)({
      fixture: "permissions",
      configExt: (0, import_lodash.merge)({}, import_runServerless.pluginConfigExt, {
        // We disable automatic permissions
        lift: {
          automaticPermissions: false
        }
      }),
      command: "package"
    });
    const statements = (0, import_lodash.get)(
      cfTemplate.Resources.IamRoleLambdaExecution,
      "Properties.Policies[0].PolicyDocument.Statement"
    );
    statements.forEach(({ Action }) => {
      expect(Action).not.toEqual(expect.arrayContaining([expect.stringMatching(/^s3:.*$/)]));
    });
  });
});
//# sourceMappingURL=permissions.test.js.map
