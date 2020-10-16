import SPARouter from "./router.js";
import './index.css';

window.addEventListener("hashchange", SPARouter.getPageFromURL);
window.addEventListener("load", SPARouter.getPageFromURL);
SPARouter.getPageFromURL();