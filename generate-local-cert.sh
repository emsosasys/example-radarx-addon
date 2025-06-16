#!/bin/bash

set -e

DOMAIN="addon-local.dev"
CERT_NAME="$DOMAIN"
CERT_DIR="./certs"
CONF_FILE="$CERT_DIR/$CERT_NAME.conf"
CRT_FILE="$CERT_DIR/$CERT_NAME.crt"
KEY_FILE="$CERT_DIR/$CERT_NAME.key"

echo "🔧 Creando directorio $CERT_DIR..."
mkdir -p "$CERT_DIR"

echo "📝 Generando archivo de configuración OpenSSL con SAN..."
cat > "$CONF_FILE" <<EOF
[req]
default_bits       = 2048
prompt             = no
default_md         = sha256
distinguished_name = dn
req_extensions     = req_ext
x509_extensions    = v3_ca

[dn]
C  = US
ST = Dev
L  = Local
O  = Dev
OU = Dev
CN = $DOMAIN

[req_ext]
subjectAltName = @alt_names

[v3_ca]
subjectAltName = @alt_names
basicConstraints = critical, CA:TRUE
keyUsage = critical, digitalSignature, keyEncipherment, keyCertSign
extendedKeyUsage = serverAuth

[alt_names]
DNS.1 = $DOMAIN
EOF

echo "🔐 Generando certificado y clave..."
openssl req -x509 -nodes -days 365 \
  -newkey rsa:2048 \
  -keyout "$KEY_FILE" \
  -out "$CRT_FILE" \
  -config "$CONF_FILE"

echo "✅ Certificado generado:"
echo " - Certificado: $CRT_FILE"
echo " - Clave:       $KEY_FILE"

echo "🔒 Copiando certificado al sistema de confianza (requiere sudo)..."
sudo cp "$CRT_FILE" "/usr/local/share/ca-certificates/$CERT_NAME.crt"
sudo update-ca-certificates

echo "🧹 Limpiando configuración temporal..."
rm "$CONF_FILE"

echo ""
echo "🎉 Listo. Ahora podés usar el certificado en tu server Node."
echo ""
echo "👉 Si usás Brave o Chrome:"
echo "   - Abrí: brave://settings/security (o chrome://settings/security)"
echo "   - Ir a: 'Manage Certificates' > 'Authorities'"
echo "   - Importá el certificado $CRT_FILE"
echo "   - Activá: 'Trust this certificate for identifying websites'"
echo ""
echo "🧯 Si tenés errores HSTS, ejecutá esto y reiniciá el navegador:"
echo "   rm ~/.config/BraveSoftware/Brave-Browser/Default/TransportSecurity"
echo ""

