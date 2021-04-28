import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';

export class CdkTestCfnIncludeStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const testBkt = new s3.Bucket(this, "cfn-include-748350247862-test-bucket", {
      bucketName: "cfn-include-test-bucket"
    })

    const testCfnStack = new cdk.CfnStack(this, "test-cfn-stack", {
      templateUrl: "https://cfn-include-test-bucket.s3-us-west-2.amazonaws.com/templates/test-cfn-stack.yaml",
      parameters: {
        "BucketName": "748350247862-cfn-test-bucket-name",
        "TableName": "748350247862-test-dynamo-table"
      }
    })
  }
}
