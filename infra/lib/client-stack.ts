import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';

export class ClientStack extends cdk.Stack {
    public readonly distribution: cloudfront.Distribution;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const websiteBucket = new s3.Bucket(this, "CryptoWebsiteBucket", {
            websiteIndexDocument: "index.html",
            websiteErrorDocument: "404.html",
            publicReadAccess: true,
            blockPublicAccess: new s3.BlockPublicAccess({
                blockPublicPolicy: false
            })
        })

        const distribution = new cloudfront.Distribution(this, 'CryptoDistribution', {
            defaultBehavior: {
                origin: new origins.S3Origin(websiteBucket, {
                    originPath: '/'
                }),
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS
            },
            defaultRootObject: 'index.html'
        })

        new BucketDeployment(this, "CryptoBucketDeployment", {
            sources: [Source.asset("../client/dist")],
            destinationBucket: websiteBucket,
            distribution,
            distributionPaths: ["/*"]
        })

    }
}
