
const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <script src="./main.js"></script>

</body>
</html>
`

// await Bun.rmdir("./docs", { recursive: true, force: true })
await Bun.spawn(["rm", "-rf", "./docs"]).stdout.text()
await Bun.write("./docs/index.html", html)

await Bun.spawn(["bun", "build", "./main.ts", "--outdir", "./docs"])

Bun.serve({
    port: 4000,
    routes:{
        "/": Bun.file("./docs/index.html"),
        "/main.js": Bun.file("./docs/main.js")
    }

})