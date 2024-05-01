const fs = require("fs") /** @type {import("fs")} */;
/**
 * @typedef {import("fs").Dirent} Dirent
 */

/**
 * @param {string} p_
 */
const path_after_pages = (p_) =>
    p_.split("\\").filter((v) => v.length && v !== "src" && v !== "pages" && v !== "./src/pages");

/**
 * @type {Record<string,string|object>}
 */
let routes = {};

/**
 *
 * @param {string[]} paths
 * @param {Dirent} name
 * @param {Record<string,string|object>} grimace
 * @return {object}
 */
function executor(paths, name, grimace) {
    const n = paths.shift();
    // console.log({grimace, paths, name, n})
    if (!n && !paths.length) {
        const jd = name.name.split(".")?.shift();
        if (!jd) {
            throw new Error("invalid name");
        }

        const n_ = path_after_pages(name.path).join("/");
        const jl = `${n_ ? `/${n_}` : ""}${jd !== 'index'?`/${jd}`:''}`;
        grimace[jd] = jl === ""?'/':jl;

        return grimace;
    }

    if (n) {
        if (!grimace[n]) {
            grimace[n] = {};
        }

        grimace[n] = executor(
            paths,
            name,
            /** @type {Record<string,string|object>} */ (grimace[n]),
        );
        return grimace;
    }

    return {};
}

if (process.env.NODE_ENV === "development") {
    fs.readdirSync("./src/pages", {
        encoding: "utf-8",
        recursive: true,
        withFileTypes: true,
    })
        .filter((/** @type {Dirent} */ v) => v.isFile() && v.name.endsWith(".tsx"))
        .map((/** @type {import("fs").Dirent} */ v) => {
            const j = path_after_pages(v.path);

            // console.log({v,j})

            executor(j, v, routes);
        });

    
    fs.writeFileSync("./src/server/routes.json", JSON.stringify(routes, null, 4), {
        encoding: "utf-8",
        flag: "w",
    });
}
module.exports = {
    routes,
    ping() {
        console.log("ping");
    },
    print(){
        console.log(routes);
    },
};
