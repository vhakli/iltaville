import { App, Stack } from "aws-cdk-lib";
import { DomainName } from "aws-cdk-lib/aws-apigateway";
import { Certificate, CertificateValidation } from "aws-cdk-lib/aws-certificatemanager";
import { CnameRecord, HostedZone } from "aws-cdk-lib/aws-route53";
import dotenv from "dotenv";
dotenv.config({ path: `${__dirname}/../../../.env` });

const { AWS_ACCOUNT, DOMAIN_NAME, HOSTED_ZONE } = process.env;
if (!AWS_ACCOUNT || !DOMAIN_NAME || !HOSTED_ZONE) throw new Error("Missing AWS_ACCOUNT environment variable");

const stack = new Stack(new App(), "IltavilleInfraStack", { env: { account: AWS_ACCOUNT, region: "eu-north-1" } });

const zone = HostedZone.fromLookup(stack, "hostedzone", { domainName: HOSTED_ZONE });

const certificate = new Certificate(stack, `${DOMAIN_NAME} certificate`, {
	domainName: DOMAIN_NAME,
	validation: CertificateValidation.fromDns(zone),
});

const domain = new DomainName(stack, "domain", {
	domainName: DOMAIN_NAME,
	certificate,
});

new CnameRecord(stack, "ApiCname", {
	zone,
	recordName: DOMAIN_NAME,
	domainName: domain.domainNameAliasDomainName,
});
