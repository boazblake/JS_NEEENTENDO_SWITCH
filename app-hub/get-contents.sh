#!/usr/bin/env bash

OUTPUT_FILE="contents-code.txt"
SEPARATOR=$'\n\n==============================\n\n'

: > "$OUTPUT_FILE"

FILES=(
  apps/controller/program/index.ts
  apps/controller/program/update.ts
  apps/controller/program/subs.ts
  apps/controller/program/calibration/index.ts
  apps/controller/program/calibration/subs.ts
  apps/controller/program/calibration/update.ts
  apps/controller/program/calibration/init.ts
  apps/tv/program/update.ts
)

for FILE in "${FILES[@]}"; do
  if [ -f "$FILE" ]; then
    {
      printf "%s" "$SEPARATOR"
      printf "PATH: %s\n\n" "$FILE"
      cat "$FILE"
      printf "\n"
    } >> "$OUTPUT_FILE"
  fi
done
