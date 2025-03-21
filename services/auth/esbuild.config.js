import { build } from "esbuild";

build({
  bundle: true,
  entryPoints: ["./request-email-otp/index", "./verify-otp/index"],
  external: ["@prisma/client"],
  keepNames: false,
  minify: true,
  outdir: "./lib",
  platform: "node",
  sourcemap: false,
  target: "node18",
  treeShaking: true,
});
