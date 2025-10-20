<!-- BEGIN_TF_DOCS -->
<!-- markdownlint-disable -->
<!-- vale off -->

## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.10.1 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | ~> 5.50 |
| <a name="requirement_github"></a> [github](#requirement\_github) | ~> 6.0 |
## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_AMPLIFY_BASIC_AUTH_SECRET"></a> [AMPLIFY\_BASIC\_AUTH\_SECRET](#input\_AMPLIFY\_BASIC\_AUTH\_SECRET) | Secret key/password to use for Amplify Basic Auth - This is entended to be read from CI variables and not commited to any codebase | `string` | `"unset"` | no |
| <a name="input_CSRF_SECRET"></a> [CSRF\_SECRET](#input\_CSRF\_SECRET) | Secure cryptographic key to be used for generating CSRF tokens - This is entended to be read from CI variables and not commited to any codebase | `string` | `"unset"` | no |
| <a name="input_aws_account_id"></a> [aws\_account\_id](#input\_aws\_account\_id) | The AWS Account ID (numeric) | `string` | n/a | yes |
| <a name="input_aws_principal_org_id"></a> [aws\_principal\_org\_id](#input\_aws\_principal\_org\_id) | The AWS Org ID (numeric) | `string` | n/a | yes |
| <a name="input_branch_name"></a> [branch\_name](#input\_branch\_name) | The branch name to deploy | `string` | `"main"` | no |
| <a name="input_commit_id"></a> [commit\_id](#input\_commit\_id) | The commit to deploy. Must be in the tree for branch\_name | `string` | `"HEAD"` | no |
| <a name="input_default_tags"></a> [default\_tags](#input\_default\_tags) | A map of default tags to apply to all taggable resources within the component | `map(string)` | `{}` | no |
| <a name="input_enable_amplify_basic_auth"></a> [enable\_amplify\_basic\_auth](#input\_enable\_amplify\_basic\_auth) | Enable a basic set of credentials in the form of a dynamically generated username and password for the amplify app branches. Not intended for production use | `bool` | `true` | no |
| <a name="input_enable_amplify_branch_auto_build"></a> [enable\_amplify\_branch\_auto\_build](#input\_enable\_amplify\_branch\_auto\_build) | Enable automatic building of branches | `bool` | `false` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | The name of the tfscaffold environment | `string` | n/a | yes |
| <a name="input_force_lambda_code_deploy"></a> [force\_lambda\_code\_deploy](#input\_force\_lambda\_code\_deploy) | If the lambda package in s3 has the same commit id tag as the terraform build branch, the lambda will not update automatically. Set to True if making changes to Lambda code from on the same commit for example during development | `bool` | `false` | no |
| <a name="input_group"></a> [group](#input\_group) | The group variables are being inherited from (often synonmous with account short-name) | `string` | n/a | yes |
| <a name="input_kms_deletion_window"></a> [kms\_deletion\_window](#input\_kms\_deletion\_window) | When a kms key is deleted, how long should it wait in the pending deletion state? | `string` | `"30"` | no |
| <a name="input_log_level"></a> [log\_level](#input\_log\_level) | The log level to be used in lambda functions within the component. Any log with a lower severity than the configured value will not be logged: https://docs.python.org/3/library/logging.html#levels | `string` | `"INFO"` | no |
| <a name="input_log_retention_in_days"></a> [log\_retention\_in\_days](#input\_log\_retention\_in\_days) | The retention period in days for the Cloudwatch Logs events to be retained, default of 0 is indefinite | `number` | `0` | no |
| <a name="input_parent_acct_environment"></a> [parent\_acct\_environment](#input\_parent\_acct\_environment) | Name of the environment responsible for the acct resources used, affects things like DNS zone. Useful for named dev environments | `string` | `"main"` | no |
| <a name="input_project"></a> [project](#input\_project) | The name of the tfscaffold project | `string` | n/a | yes |
| <a name="input_region"></a> [region](#input\_region) | The AWS Region | `string` | n/a | yes |
| <a name="input_shared_infra_account_id"></a> [shared\_infra\_account\_id](#input\_shared\_infra\_account\_id) | The AWS Account ID of the shared infrastructure account | `string` | `"000000000000"` | no |
| <a name="input_url_prefix"></a> [url\_prefix](#input\_url\_prefix) | The url prefix to use for the deployed branch | `string` | `"main"` | no |
## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_amplify_branch"></a> [amplify\_branch](#module\_amplify\_branch) | git::https://github.com/NHSDigital/nhs-notify-shared-modules.git//infrastructure/modules/amp_branch | v1.0.8 |
## Outputs

| Name | Description |
|------|-------------|
| <a name="output_amplify"></a> [amplify](#output\_amplify) | n/a |
| <a name="output_deployment"></a> [deployment](#output\_deployment) | Deployment details used for post-deployment scripts |
<!-- vale on -->
<!-- markdownlint-enable -->
<!-- END_TF_DOCS -->
