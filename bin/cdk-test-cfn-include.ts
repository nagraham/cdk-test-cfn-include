#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkTestCfnIncludeStack } from '../lib/cdk-test-cfn-include-stack';

const app = new cdk.App();
new CdkTestCfnIncludeStack(app, 'CdkTestCfnIncludeStack');
