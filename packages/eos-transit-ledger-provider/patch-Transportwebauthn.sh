#!/bin/bash -x
cd "$(dirname "$0")";
echo "Patching TransportWebAuthn.js ..."
patch node_modules/@ledgerhq/hw-transport-webauthn/lib/TransportWebAuthn.js Transportwebauthn.js.patch 
