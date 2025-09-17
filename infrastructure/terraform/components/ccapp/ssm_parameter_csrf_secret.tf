resource "aws_ssm_parameter" "csrf_secret" {
  name        = "/${local.csi}/csrf_secret"
  description = "Cryptographic secret used for CSRF token generation"

  type  = "SecureString"
  value = var.CSRF_SECRET != "unset" && length(var.CSRF_SECRET) > 0 ? var.CSRF_SECRET : random_password.csrf_secret[0].result
}

resource "random_password" "csrf_secret" {
  count = var.enable_amplify_basic_auth && var.AMPLIFY_BASIC_AUTH_SECRET == "unset" ? 1 : 0

  length  = 16
  special = true
}
