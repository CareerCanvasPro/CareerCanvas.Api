import { build } from "esbuild";

build({
  bundle: true,
  entryPoints: ["./api-key-authorizer/index", "./jwt-authorizer/index"],
  keepNames: false,
  minify: true,
  outdir: "./lib",
  platform: "node",
  sourcemap: false,
  target: "node22",
  treeShaking: true,
});
