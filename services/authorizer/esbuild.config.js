import { build } from "esbuild";

build({
  bundle: true,
  entryPoints: ["./jwt-authorizer/index"],
  keepNames: false,
  minify: true,
  outdir: "./lib",
  platform: "node",
  sourcemap: false,
  target: "node18",
  treeShaking: true,
});
