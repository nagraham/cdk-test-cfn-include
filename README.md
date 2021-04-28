# CDK Test: CFN Include

The purpose of this repository is to prototype a use case for the cloudformation-include module. My use case is this:

I currently have a CDK stack that uses a `core.CfnStack` construct to create a `NestedStack` based on some CloudFormation templates in an s3 bucket. Those templates have a deeply nested structure, with lots of parameters. I don't want to change those cloudformation templates directly, and I can't modify those resources with CDK. Right now, I'm limited to extending those templates by creating new resources. 

Unfortunately, new security requirements force me to update some resources within those templates (e.g. add SSE). I would prefer to do that within my CDK stack. The `cloudformation-include.CfnInclude` library allows you to pull in Cloudformation template files (locally, instead of in s3). CDK parses the templates, and allows you to get/set attributes of those resources. This is pretty neat! 

This [AWS blog post covers it](https://aws.amazon.com/blogs/developer/migrating-cloudformation-templates-to-the-aws-cloud-development-kit/), but from the perspective of someone with a stack built from Cloudformation templates that they would like to convert to CDK. Again, my use case is a little different, since I'm already using CDK, and I need to convert from a `core.CfnStack`

The sequence of commits in this prototype confirms you can convert the nested stack managed by your CDK stack from a `core.CfnStack` to using `CfnInclude` **without destroying / re-creating the stack and its resources**. Getting it to work is very similar to what the blog post describes, expect one extra step: you have to override the logical id of the nested stack.

```
const nestedStack = new TestCfnStack(this, "testcfnstack")
this.renameLogicalId(this.getLogicalId(nestedStack.nestedStackResource as cdk.CfnResource), "testcfnstack")
```

## Resources

- [AWS blog post on including CloudFormation Templates](https://aws.amazon.com/blogs/developer/migrating-cloudformation-templates-to-the-aws-cloud-development-kit/)
- [CFN Include CDK Docs](https://docs.aws.amazon.com/cdk/api/latest/docs/cloudformation-include-readme.html)

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
