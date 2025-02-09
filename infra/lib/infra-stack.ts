import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {ClientStack} from "./client-stack";
import {ServerStack} from "./server-stack";

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Deploy the front-end stack
    const frontEndStack = new ClientStack(this, 'FrontEndStack');

    // Deploy the back-end stack
    const backEndStack = new ServerStack(this, 'BackEndStack');

  }
}
