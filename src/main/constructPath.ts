function removeSurroundings(str: string, char: string): string {
    if (str.startsWith(char)) str = str.substr(char.length)
    if (str.endsWith(char)) str = str.substr(0, str.length - char.length)
    return str
}


export function constructPath(prefix: string | null, path: string): string {
    let pathWithPrefix = removeSurroundings(prefix ?? "/", "/") + "/" + removeSurroundings(path, "/")
    if (pathWithPrefix.endsWith("/")) 
        pathWithPrefix = pathWithPrefix.substring(0, pathWithPrefix.length - 1)
    return pathWithPrefix.startsWith("/") ? pathWithPrefix : "/" + pathWithPrefix
}