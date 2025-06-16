const swc = require("@swc/core")
const fs = require("fs").promises
const path = require("path")

const projectRoot = path.resolve(__dirname)

async function compileTsFile(filePath) {
  const source = await fs.readFile(filePath, "utf8")
  const isProd = process.env.NODE_ENV === "production"

  const result = await swc.transform(source, {
    filename: filePath,
    sourceMaps: true,
    jsc: {
      parser: {
        syntax: "typescript",
        tsx: false,
        decorators: true,
      },
      target: "es2017",
      loose: false,
      minify: {
        compress: {
          drop_console: isProd,
        },
        mangle: false,
      },
      baseUrl: projectRoot,
      paths: {
        "@/*": ["./src/*"],
      },
    },
    module: {
      type: "commonjs",
    },
    minify: true,
    isModule: true,
  })

  const outputPath = path.join("dist", path.relative("src", filePath)).replace(".ts", ".js")
  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  await fs.writeFile(outputPath, result.code)
}

async function compileProject() {
  const files = await fs.readdir("src", { recursive: true })
  const tsFiles = files.filter((file) => file.endsWith(".ts"))

  for (const file of tsFiles) {
    await compileTsFile(path.join("src", file))
  }
}

compileProject().catch(console.error)

