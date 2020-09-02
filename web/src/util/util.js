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

export {
    properCapitalization,
    mountComponent,
    getTargetInfo,
    refreshNode
}