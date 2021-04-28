import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import {TestCfnStack} from "./test-cfn-stack";

export class CdkTestCfnIncludeStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const testBkt = new s3.Bucket(this, "cfn-include-748350247862-test-bucket", {
      bucketName: "cfn-include-test-bucket"
    })

    // Because we are converting from CdkStack to CfnInclude, this is a more
    // complicated situation than the standard use case of taking a CloudFormation
    // stack and using CfnInclude from the get-go.
    //
    // The reason for this is because the CF nested stack *already exists* with
    // our CDK stack, so we have to be very careful to make sure the new NestedStack
    // we just created has the EXACT SAME CF resource name (logical id). However, CDK
    // likes to generate it's own unique logical ids, so we have to force it to use
    // the old one.
    const nestedStack = new TestCfnStack(this, "testcfnstack")
    this.renameLogicalId(this.getLogicalId(nestedStack.nestedStackResource as cdk.CfnResource), "testcfnstack")

    // The old CfnStack (keep around as reference)
    //
    // const testCfnStack = new cdk.CfnStack(this, "test-cfn-stack", {
    //   templateUrl: "https://cfn-include-test-bucket.s3-us-west-2.amazonaws.com/templates/test-cfn-stack.yaml",
    //   parameters: {
    //     "BucketName": "748350247862-cfn-test-bucket-name",
    //     "TableName": "748350247862-test-dynamo-table"
    //   }
    // })
  }
}
