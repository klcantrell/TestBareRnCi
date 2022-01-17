#!/bin/bash

set -euo pipefail

echo "$PLAY_CREDENTIALS" | base64 --decode > play-store-credentials.json
