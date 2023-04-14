import type { Stack } from "aws-cdk-lib";
import type { RestApi } from "aws-cdk-lib/aws-apigateway";
import { BasePathMapping, DomainName } from "aws-cdk-lib/aws-apigateway";
import { Certificate, CertificateValidation } from "aws-cdk-lib/aws-certificatemanager";
import { CnameRecord, HostedZone } from "aws-cdk-lib/aws-route53";
import dotenv from "dotenv";
dotenv.config();

const { domainName, hostedZoneDomain } = process.env;
if (!domainName || !hostedZoneDomain) throw new Error("Missing environment variables");

export const createNetwork = (stack: Stack, api: RestApi) => {
	// Import hosted zone
	const zone = HostedZone.fromLookup(stack, "hostedzone", { domainName: hostedZoneDomain });

	const domain = new DomainName(stack, "domain", {
		domainName,
		certificate: new Certificate(stack, "certificate", {
			domainName,
			validation: CertificateValidation.fromDns(zone),
		}),
	});

	new BasePathMapping(stack, "ApiBasePath", {
		restApi: api,
		domainName: domain,
		basePath: "api",
	});

	new CnameRecord(stack, "ApiCname", {
		zone,
		recordName: domainName,
		domainName: domain.domainNameAliasDomainName,
	});

	return {
		zone,
		domain,
	} as const;
};
