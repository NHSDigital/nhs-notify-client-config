##
# Basic Required Variables for tfscaffold Components
##

variable "project" {
  type        = string
  description = "The name of the tfscaffold project"
}

variable "environment" {
  type        = string
  description = "The name of the tfscaffold environment"
}

variable "aws_account_id" {
  type        = string
  description = "The AWS Account ID (numeric)"
}

variable "aws_principal_org_id" {
  type        = string
  description = "The AWS Org ID (numeric)"
}

variable "region" {
  type        = string
  description = "The AWS Region"
}

variable "group" {
  type        = string
  description = "The group variables are being inherited from (often synonmous with account short-name)"
}

##
# tfscaffold variables specific to this component
##

variable "default_tags" {
  type        = map(string)
  description = "A map of default tags to apply to all taggable resources within the component"
  default     = {}
}

##
# Variables specific to the "app" component
##

variable "log_retention_in_days" {
  type        = number
  description = "The retention period in days for the Cloudwatch Logs events to be retained, default of 0 is indefinite"
  default     = 0
}

variable "kms_deletion_window" {
  type        = string
  description = "When a kms key is deleted, how long should it wait in the pending deletion state?"
  default     = "30"
}

variable "parent_acct_environment" {
  type        = string
  description = "Name of the environment responsible for the acct resources used, affects things like DNS zone. Useful for named dev environments"
  default     = "main"
}

variable "enable_amplify_branch_auto_build" {
  type        = bool
  description = "Enable automatic building of branches"
  default     = false
}

variable "AMPLIFY_BASIC_AUTH_SECRET" {
  # Github only does uppercase env vars
  type        = string
  description = "Secret key/password to use for Amplify Basic Auth - This is entended to be read from CI variables and not commited to any codebase"
  default     = "unset"
}

variable "CSRF_SECRET" {
  # Github only does uppercase env vars
  type        = string
  description = "Secure cryptographic key to be used for generating CSRF tokens - This is entended to be read from CI variables and not commited to any codebase"
  default     = "unset"
}

variable "branch_name" {
  type        = string
  description = "The branch name to deploy"
  default     = "main"
}

variable "url_prefix" {
  type        = string
  description = "The url prefix to use for the deployed branch"
  default     = "main"
}

variable "commit_id" {
  type        = string
  description = "The commit to deploy. Must be in the tree for branch_name"
  default     = "HEAD"
}

variable "force_lambda_code_deploy" {
  type        = bool
  description = "If the lambda package in s3 has the same commit id tag as the terraform build branch, the lambda will not update automatically. Set to True if making changes to Lambda code from on the same commit for example during development"
  default     = false
}

variable "log_level" {
  type        = string
  description = "The log level to be used in lambda functions within the component. Any log with a lower severity than the configured value will not be logged: https://docs.python.org/3/library/logging.html#levels"
  default     = "INFO"
}
