import { withBaseWebpack } from "./webpack/config";
import { DefaultRemoteName, DefaultContainerName } from "./common/types";
// export * as rs from "./rspack";

export default {
    webpack: {
        withBaseWebpack,
        DefaultRemoteName,
        DefaultContainerName
    },
    rspack: {

    }
}
  