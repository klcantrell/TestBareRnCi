#!/bin/bash

set -euo pipefail

echo "$PLAY_CREDENTIALS" | base64 --decode > android/play-store-credentials.json
