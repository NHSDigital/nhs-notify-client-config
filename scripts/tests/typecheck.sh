#!/bin/bash

set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

# run typecheck
npm ci
npm run typecheck
