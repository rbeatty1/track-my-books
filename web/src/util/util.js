const properCapitalization = string => string[0].toUpperCase() + string.slice(1);

const mountComponent = (parent, component) =>{
    parent.insertAdjacentHTML("beforeend", component)
}

const refreshNode = component =>{
    let oldNode = component.node;
    let newNode = component.render();
    oldNode.parentNode.replaceChild(newNode, oldNode);
    component.node = newNode;
    return component;
}

const getTargetInfo = event =>{
    const target = event.target.dataset.eventName ? event.target : event.target.parentNode;
    const eventName = target.dataset.eventName;
    return { target, eventName }
}

const randomColorGenerator = numberOfColors =>{
    function generateHexCode(){
        var hexValues = "0123456789ABCDEF";
        let hexCode = "#";
        for(let j = 0; j < 6; j++){
            hexCode += hexValues[Math.floor(Math.random() * 16)];
        }
        return hexCode;
    }
    let i = 0,
    colors = [];

    while (i < numberOfColors){
        colors.push( generateHexCode() )
        i++
    }

    return colors;
}
function hexToRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
}
const friendlyMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export {
    properCapitalization,
    mountComponent,
    getTargetInfo,
    refreshNode,
    randomColorGenerator,
    hexToRGB,
    friendlyMonths
}