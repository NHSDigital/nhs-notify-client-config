locals {
  ccapp = data.terraform_remote_state.ccapp.outputs
}

data "terraform_remote_state" "ccapp" {
  backend = "s3"

  config = {
    bucket = local.terraform_state_bucket

    key = format(
      "%s/%s/%s/%s/ccapp.tfstate",
      var.project,
      var.aws_account_id,
      "eu-west-2",
      var.parent_amplify_environment,
    )

    region = "eu-west-2"
  }
}
