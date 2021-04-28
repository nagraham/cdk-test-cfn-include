import * as cdk from "@aws-cdk/core"
import * as cfninc from "@aws-cdk/cloudformation-include"
import * as s3 from "@aws-cdk/aws-s3";
import {BucketEncryption} from "@aws-cdk/aws-s3";
import * as kms from "@aws-cdk/aws-kms";
import * as ddb from "@aws-cdk/aws-dynamodb";

export class TestCfnStack extends cdk.NestedStack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.NestedStackProps) {
        super(scope, id, props);

        const testCfnStack = new cfninc.CfnInclude(this, "test-cfn-include", {
            templateFile: "templates/test-cfn-stack.yaml",
            loadNestedStacks: {
                "SomeChildStack": {
                    templateFile: "templates/child/test-cfn-child-stack.yaml"
                }
            },
            parameters: {
                "BucketName": "748350247862-cfn-test-bucket-name",
                "TableName": "748350247862-test-dynamo-table"
            }
        })

        // update the s3 bucket
        const cfnBucket = testCfnStack.getResource("Bucket") as s3.CfnBucket

        const s3Kms = kms.Alias.fromAliasName(this, "s3-kms-alias", "alias/aws/s3")
        cfnBucket.bucketEncryption = {
            serverSideEncryptionConfiguration: [
                {
                    bucketKeyEnabled: true,
                    serverSideEncryptionByDefault: {
                        kmsMasterKeyId: s3Kms.keyId,
                        sseAlgorithm: "aws:kms"
                    },
                }
            ]
        }

        // include child stack, and make changes:
        const includedSomeChildStack = testCfnStack.getNestedStack("SomeChildStack");
        const someChildStack: cdk.NestedStack = includedSomeChildStack.stack
        const childTemplate: cfninc.CfnInclude = includedSomeChildStack.includedTemplate

        // update the dynamo table
        const dynamoTable = childTemplate.getResource("SomeDynamoTable") as ddb.CfnTable;
        const dynamoKms = kms.Alias.fromAliasName(this, "ddb-kms-alias", "alias/aws/dynamodb")
        dynamoTable.sseSpecification = {
            kmsMasterKeyId: dynamoKms.keyId,
            sseEnabled: true,
            sseType: "KMS",
        }

        // add a bucket to the child stack
        new s3.Bucket(someChildStack, "a-random-bucket-for-fun", {
            bucketName: "748350247862-cfn-include-another-test-bucket",
            encryption: BucketEncryption.S3_MANAGED,
        })
    }
}