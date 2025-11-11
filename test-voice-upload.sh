#!/bin/bash

echo "Testing voice agent with audio upload..."

# Create a simple test audio file (silent webm)
echo "Creating test audio file..."
# This creates a minimal valid webm file (very short silence)
printf '\x1a\x45\xdf\xa3' > /tmp/test-audio.webm

echo ""
echo "Uploading to voice agent..."
curl -v -X POST http://localhost:5001/voice \
  -F "audio=@/tmp/test-audio.webm" \
  2>&1 | grep -E "HTTP|Connected|error"

echo ""
echo "Done!"
