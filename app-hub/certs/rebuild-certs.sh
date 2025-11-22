#!/usr/bin/env bash
# ------------------------------------------------------------------
#  Regenerate full dev certificate chain for Wordpond
#  Creates a new root CA + server cert signed by it.
# ------------------------------------------------------------------
set -euo pipefail

CERT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../certs" && pwd)"
ROOT_KEY="$CERT_DIR/wordpond-root.key"
ROOT_PEM="$CERT_DIR/wordpond-root.pem"
LEAF_KEY="$CERT_DIR/multi-ip-key.pem"
LEAF_PEM="$CERT_DIR/multi-ip.pem"
SAN_CFG="$CERT_DIR/san.cnf"
CA_CFG="$CERT_DIR/ca.cnf"

mkdir -p "$CERT_DIR"
cd "$CERT_DIR"

echo "=== Cleaning old certs ==="
rm -f wordpond-root.{key,pem,srl} multi-ip.{key,pem,csr,srl} "$SAN_CFG" "$CA_CFG"

# --- Detect current IPs -------------------------------------------------------
WIFI_IP=$(ipconfig getifaddr en0 2>/dev/null || true)
USB_IP=$(ifconfig | awk '/inet 169\.254/{print $2; exit}' || true)
[ -z "$WIFI_IP" ] && WIFI_IP="172.25.91.180"

echo "Detected Wi-Fi IP : ${WIFI_IP:-none}"
echo "Detected USB  IP : ${USB_IP:-none}"

# --- Root CA config -----------------------------------------------------------
cat >"$CA_CFG" <<'EOF'
[ req ]
distinguished_name = dn
x509_extensions = v3_ca
prompt = no
[ dn ]
CN = Wordpond Root CA
[ v3_ca ]
basicConstraints = critical,CA:true,pathlen:0
keyUsage = critical,keyCertSign,cRLSign
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always
EOF

# --- SAN config for leaf cert -------------------------------------------------
cat >"$SAN_CFG" <<EOF
[ req ]
distinguished_name = dn
prompt = no
[ dn ]
CN = wordpond.local
[ req_ext ]
basicConstraints = critical,CA:false
keyUsage = critical,digitalSignature,keyEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alts
[ alts ]
DNS.1 = localhost
IP.1  = ${WIFI_IP}
EOF

I=2
for IP in $USB_IP 172.20.10.3 192.168.7.195; do
  [ -n "$IP" ] && echo "IP.${I}  = ${IP}" >>"$SAN_CFG" && I=$((I+1))
done

# --- 1. Create Root CA -------------------------------------------------------
echo "=== Creating new root CA ==="
openssl genrsa -out "$ROOT_KEY" 4096
openssl req -x509 -new -key "$ROOT_KEY" -sha256 -days 3650 \
  -out "$ROOT_PEM" -config "$CA_CFG" -extensions v3_ca
echo "Root CA generated: $ROOT_PEM"

# --- 2. Create server key + CSR ----------------------------------------------
echo "=== Creating new server key and CSR ==="
openssl genrsa -out "$LEAF_KEY" 2048
openssl req -new -key "$LEAF_KEY" -out multi-ip.csr -subj "/CN=wordpond.local"

# --- 3. Sign CSR with root ---------------------------------------------------
echo "=== Signing server cert with root CA ==="
openssl x509 -req -in multi-ip.csr \
  -CA "$ROOT_PEM" -CAkey "$ROOT_KEY" -CAcreateserial \
  -out "$LEAF_PEM" -sha256 -days 825 \
  -extfile "$SAN_CFG" -extensions req_ext

# --- 4. Verify ---------------------------------------------------------------
echo "=== Verifying chain ==="
openssl verify -CAfile "$ROOT_PEM" "$LEAF_PEM"

echo
echo "Done!"
echo "Root CA : $ROOT_PEM"
echo "Root Key: $ROOT_KEY"
echo "Server  : $LEAF_PEM"
echo "Key     : $LEAF_KEY"
echo
echo "Import $ROOT_PEM into Keychain / iOS and mark as Always Trust."
echo "Point Vite + relay to multi-ip.pem and multi-ip-key.pem."
