import * as cdk from 'aws-cdk-lib';
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from 'constructs';

export class AwsCdkTestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda関数
    const nameHelloWorldFunc = "helloWorldFunc"
    const func = new NodejsFunction(this, nameHelloWorldFunc, {
      entry: "lib/hello-world.ts",
      runtime: Runtime.NODEJS_18_X,
      functionName: nameHelloWorldFunc,
    });

    // API Gateway (REST API)
    const restApi = new cdk.aws_apigateway.RestApi(this, "nameRestApi", {
      deployOptions: {
        stageName: 'v1',
      },
      restApiName: `Rest_API_with_Lambda`,
    });

    // API Gatewayにリクエスト先のリソースを追加
    const restApiHelloWorld = restApi.root.addResource('hello_world');

    // API GatewayのリソースにLambda関数を紐付け
    restApiHelloWorld.addMethod("GET", new cdk.aws_apigateway.LambdaIntegration(func));
  }
}
