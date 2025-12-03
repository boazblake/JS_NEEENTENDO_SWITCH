{
  description = "Edu Games monorepo";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.05";
    flake-utils.url = "github:numtide/flake-utils";
  };


  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in {
        devShell = pkgs.mkShell {
          name = "edu-games-shell";

          buildInputs = with pkgs; [
            nodejs_24
            pnpm
            git
            openssl
            python3
            ruby
            cocoapods
          ];

          shellHook = ''
            export NODE_ENV=development
            export PATH="$PWD/node_modules/.bin:$PATH"
            export PATH=$PATH:$HOME/.gem/ruby/*/bin
            echo "Edu Games dev shell ready"
          '';
        };
      });
}
