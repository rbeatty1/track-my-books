import pubSub from "./util/pubSub.js";
import { Router } from "./router.js";

pubSub.publish(
    pubSub.actions.NAVIGATION.UPDATE,
    { navEvents : pubSub.actions.NAVIGATION.HOME}
)
