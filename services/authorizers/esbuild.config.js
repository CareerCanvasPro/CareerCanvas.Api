import { build } from "esbuild";

build({
  bundle: true,
  entryPoints: [
    "./admin-jwt-authorizer/index",
    "./api-key-authorizer/index",
    "./jwt-authorizer/index",
  ],
  keepNames: false,
  minify: true,
  outdir: "./lib",
  platform: "node",
  sourcemap: false,
  target: "node22",
  treeShaking: true,
});
