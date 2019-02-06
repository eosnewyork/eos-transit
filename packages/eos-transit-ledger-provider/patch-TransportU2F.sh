#!/bin/bash -x
cd "$(dirname "$0")";
echo "Patching TransportU2F.js ..."
patch node_modules/@ledgerhq/hw-transport-u2f/lib/TransportU2F.js TransportU2F.js.patch
