#!/usr/bin/env bash

OUTPUT_FILE="contents-code.txt"
SEPARATOR=$'\n\n==============================\n\n'

: > "$OUTPUT_FILE"

FILES=(
  apps/tv/program/init.ts
  apps/tv/program/types.ts
  apps/tv/program/update.ts
  apps/tv/program/subs.ts
  apps/tv/program/layout.ts
  apps/tv/program/view.ts

  apps/tv/program/controllers/types.ts
  apps/tv/program/controllers/init.ts
  apps/tv/program/controllers/update.ts

  apps/tv/program/network/init.ts
  apps/tv/program/network/update.ts
  apps/tv/program/network/subs.ts
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
