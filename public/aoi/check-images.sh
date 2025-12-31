#!/bin/bash

# Script to check which aOi images are present

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  aOi Image Status Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

images=(
  "beginner-neutral.png:🌱 Beginner - Neutral"
  "explorer-thinking.png:🔍 Explorer - Thinking"
  "builder-excited.png:🔨 Builder - Excited"
  "guardian-neutral.png:🛡️ Guardian - Neutral"
)

total=0
found=0

for entry in "${images[@]}"; do
  IFS=':' read -r filename label <<< "$entry"
  total=$((total + 1))

  if [ -f "$SCRIPT_DIR/$filename" ]; then
    echo "✅ $label"
    found=$((found + 1))
  else
    echo "❌ $label (missing: $filename)"
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Status: $found/$total images present"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $found -eq 0 ]; then
  echo "ℹ️  No images found. The app will use fallback display (葵 kanji)"
  echo "   See HOW_TO_ADD_IMAGES.md for instructions"
elif [ $found -lt $total ]; then
  echo "⚠️  Some images missing. Fallback will be used for missing levels"
else
  echo "🎉 All aOi images are present!"
fi

echo ""
