function updateAttributes(oldNode: Element, newNode: Element) {
  for (const { name, value } of [...newNode.attributes]) {
    if (value === oldNode.getAttribute(name)) {
      continue;
    }
    oldNode.setAttribute(name, value);
  }
  for (const { name } of [...oldNode.attributes]) {
    if (newNode.getAttribute(name) !== undefined) {
      continue;
    }
    oldNode.removeAttribute(name);
  }
}

export function updateElement(
  parent: Element,
  newNode: Element,
  oldNode: Element
) {
  if (!newNode && oldNode) return oldNode.remove();
  if (newNode && !oldNode) return parent.appendChild(newNode);

  if (newNode instanceof Text && oldNode instanceof Text) {
    if (oldNode.nodeValue === newNode.nodeValue) return;
    oldNode.nodeValue = newNode.nodeValue;
    return;
  }

  if (newNode.nodeName !== oldNode.nodeName) {
    parent.insertBefore(newNode, oldNode);
    oldNode.remove();
    return;
  }

  updateAttributes(oldNode, newNode);

  const newChildren = [...newNode.childNodes] as Element[];
  const oldChildren = [...oldNode.childNodes] as Element[];
  const maxLength = Math.max(newChildren.length, oldChildren.length);
  for (let i = 0; i < maxLength; i++) {
    updateElement(oldNode, newChildren[i], oldChildren[i]);
  }
}
