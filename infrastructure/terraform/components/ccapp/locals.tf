locals {
  log_destination_arn = "arn:aws:logs:${var.region}:${var.shared_infra_account_id}:destination:nhs-main-obs-firehose-logs"

  root_domain_name         = "${var.environment}.${local.acct.route53_zone_names["client-config"]}" # e.g. [main|dev|abxy0].web-gateway.[dev|nonprod|prod].nhsnotify.national.nhs.uk
  root_domain_id           = local.acct.route53_zone_ids["client-config"]
  root_domain_nameservers  = local.acct.route53_zone_nameservers["client-config"]
}
