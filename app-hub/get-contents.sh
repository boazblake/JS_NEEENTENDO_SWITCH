#!/usr/bin/env bash

OUTPUT_FILE="contents-code.txt"
SEPARATOR=$'\n\n==============================\n\n'

: > "$OUTPUT_FILE"

FILES=(
apps/controller/main.ts
apps/controller/program/index.ts
apps/controller/program/env.ts
apps/controller/program/init.ts
apps/controller/program/subs.ts
apps/controller/program/update.ts
apps/controller/program/types.ts
apps/controller/program/network/index.ts
apps/controller/program/network/init.ts
apps/controller/program/network/subs.ts
apps/controller/program/network/update.ts
apps/controller/program/network/send.ts
apps/tv/main.ts
apps/tv/program/index.ts
apps/tv/program/env.ts
apps/tv/program/init.ts
apps/tv/program/subs.ts
apps/tv/program/update.ts
apps/tv/program/types.ts
apps/tv/program/network/index.ts
apps/tv/program/network/init.ts
apps/tv/program/network/subs.ts
apps/tv/program/network/update.ts
apps/tv/program/network/send.ts
app-hub/effects/index.ts
app-hub/effects/global.ts
app-hub/effects/network.ts
app-hub/effects/socket.ts
shared/src/network/index.ts
shared/src/network/messages.ts
shared/src/network/types.ts
shared/src/types.ts
shared/src/utils.ts
apps/server/src/main.ts
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
