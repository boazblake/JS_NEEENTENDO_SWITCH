#!/usr/bin/env bash
# ------------------------------------------------------------------
# Regenerate dev certificate chain for Wordpond – macOS & Linux compatible
# Only includes localhost, wordpond.local, and the current machine's real IPs
# ------------------------------------------------------------------
set -euo pipefail

CERT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
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

# --- Detect current IPs (macOS + Linux compatible) ---------------------------
# macOS Wi-Fi (en0) – most common on Macs
WIFI_IP=$(ipconfig getifaddr en0 2>/dev/null || true)

# macOS fallback: look for any non-loopback IPv4 address (en*, utun*, etc.)
if [ -z "$WIFI_IP" ]; then
  WIFI_IP=$(ifconfig | awk '/inet [0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/ && !/127\.0\.0\.1/ && !/169\.254/ {print $2; exit}')
fi

# Linux fallback (if running on Linux)
if [ -z "$WIFI_IP" ] && command -v ip >/dev/null; then
  WIFI_IP=$(ip -4 addr show | awk '/inet .* (en|wlan|eth)/ {print $2; exit}' | cut -d/ -f1)
fi

# Collect all non-loopback, non-link-local IPv4 addresses
OTHER_IPS=""
while IFS= read -r ip; do
  [[ "$ip" == "127.0.0.1" || "$ip" == "169.254"* ]] && continue
  OTHER_IPS="$OTHER_IPS $ip"
done < <(ifconfig | awk '/inet [0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/ {print $2}' || true)

# Remove duplicates and the already-detected WIFI_IP
OTHER_IPS=$(echo "$OTHER_IPS" | tr ' ' '\n' | grep -v '^$' | grep -v "$WIFI_IP" | sort -u)

echo "Detected IPs on this machine:"
echo "  - 127.0.0.1"
[ -n "$WIFI_IP" ] && echo "  - $WIFI_IP"
echo "$OTHER_IPS" | sed 's/^/  - /'

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
DNS.2 = wordpond.local
IP.1 = 127.0.0.1
EOF

# Add detected IPs
I=2
if [ -n "$WIFI_IP" ]; then
  echo "IP.${I} = ${WIFI_IP}" >>"$SAN_CFG"
  I=$((I+1))
fi
for IP in $OTHER_IPS; do
  echo "IP.${I} = ${IP}" >>"$SAN_CFG"
  I=$((I+1))
done

# --- Create Root CA -----------------------------------------------------------
echo "=== Creating new root CA ==="
openssl genrsa -out "$ROOT_KEY" 4096
openssl req -x509 -new -key "$ROOT_KEY" -sha256 -days 3650 \
  -out "$ROOT_PEM" -config "$CA_CFG" -extensions v3_ca

# --- Create server key + CSR -------------------------------------------------
echo "=== Creating new server key and CSR ==="
openssl genrsa -out "$LEAF_KEY" 2048
openssl req -new -key "$LEAF_KEY" -out multi-ip.csr -subj "/CN=wordpond.local"

# --- Sign CSR with root ------------------------------------------------------
echo "=== Signing server cert with root CA ==="
openssl x509 -req -in multi-ip.csr \
  -CA "$ROOT_PEM" -CAkey "$ROOT_KEY" -CAcreateserial \
  -out "$LEAF_PEM" -days 825 -sha256 \
  -extfile "$SAN_CFG" -extensions req_ext

# --- Verify ------------------------------------------------------------------
echo "=== Verifying chain ==="
openssl verify -CAfile "$ROOT_PEM" "$LEAF_PEM"
echo

echo "Done! Certificate now covers:"
echo "  - https://localhost:<port>"
echo "  - https://wordpond.local:<port>"
echo "  - https://127.0.0.1:<port>"
echo "  - https://10.0.0.242:<port> (and any other IPs on this machine)"
echo
echo "Root CA     : $ROOT_PEM"
echo "Server cert : $LEAF_PEM"
echo "Server key  : $LEAF_KEY"
echo
echo "Import $ROOT_PEM into Keychain (macOS) or Trusted Root CAs (Windows) and mark as 'Always Trust'."
