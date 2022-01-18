#!/bin/bash

set -euo pipefail

echo "$KEYSTORE_DATA" | base64 --decode > android/app/testbarernci.keystore
